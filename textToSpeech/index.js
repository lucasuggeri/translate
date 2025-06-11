import * as googleTTS from 'google-tts-api';
import fs from 'fs';
import path from 'path';
import { generateVideoSegments, generateSilentAudio }from './src/splitVideo.js';
import axios from 'axios';

// Função para extrair texto e timestamps de um arquivo SRT em inglês
function extractTextAndTimestampsFromSRT(srtFilePath) {
  const srtContent = fs.readFileSync(srtFilePath, 'utf-8');
  const lines = srtContent.split('\n');
  let subtitles = [];

  let currentSubtitle = { text: '', start: 0, end: 0 };

  for (const line of lines) {
    if (!line.trim()) {
      // Linha em branco indica o final de uma legenda
      if (currentSubtitle.text.trim() !== '') {
        subtitles.push(currentSubtitle);
        currentSubtitle = { text: '', start: 0, end: 0 };
      }
    } else if (/^\d+$/.test(line.trim())) {
      // Linha contendo apenas números é o número de sequência, podemos ignorar
      continue;
    } else if (line.includes('-->')) {
      // Linha contendo timestamps
      const [startTime, endTime] = line.split('-->').map(time => time.trim());
      currentSubtitle.start = convertTimestampToSeconds(startTime);
      currentSubtitle.end = convertTimestampToSeconds(endTime);
    } else {
      // Linha de texto da legenda
      currentSubtitle.text += line + ' ';
    }
  }

  // Adiciona a última legenda à lista
  if (currentSubtitle.text.trim() !== '') {
    subtitles.push(currentSubtitle);
  }

  return subtitles;
}

// Função para converter timestamps do formato SRT para segundos
function convertTimestampToSeconds(timestamp) {
  const timeParts = timestamp.split(/[,.]/); // Lidar com ',' ou '.' como separadores de milissegundos
  const [hh, mm, ss] = timeParts[0].split(':').map(Number);

  let milliseconds = 0;
  if (timeParts.length > 1) {
    milliseconds = parseInt(timeParts[1].padEnd(3, '0')); // Pad zeros à direita se necessário
  }

  return hh * 3600 + mm * 60 + ss + milliseconds / 1000;
}


// Função para gerar áudio a partir do texto usando a API do Google TTS
async function generateAudioFromText(text, outputFile) {
  try {
    const audioBufferUrl = googleTTS.getAudioUrl(text, {
      lang: 'en',
      slow: false,
      host: 'https://translate.google.com',
    }); // 'en-US' representa o idioma inglês dos Estados Unidos
    const { data } = await axios.get(audioBufferUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(outputFile, Buffer.from(data));
    
    console.log(`Áudio gerado com sucesso: ${outputFile}`);
    console.log('------------------------------------------------------------');
  } catch (error) {
    console.error('Erro ao gerar áudio:', error);
    console.log('------------------------------------------------------------');
  }
}

// Caminho para o arquivo SRT e o diretório de saída de áudio

const srtFilePath = await fs.promises.readdir('./subtitles/')
  .then(files => {
    const srtFile = files.find(file => path.extname(file) === '.srt');
    return `./subtitles/${srtFile}`;
  });

const inputVideo = await fs.promises.readdir('./')
  .then(files => {
    const mp4File = files.find(file => path.extname(file) === '.mp4');
    return `./${mp4File}`;
  });
const audioOutputDirectory = './audios/';
const videoOutputDirectory = './videos'
 console.log(srtFilePath);
 console.log(inputVideo);
// Extrai texto e timestamps do arquivo SRT
  const subtitles = extractTextAndTimestampsFromSRT(srtFilePath);

// //Verifica se há legendas
if (subtitles.length === 0) {
  console.log('Nenhuma legenda encontrada no arquivo SRT.');
} else {

  let previousEnd = 0;

  // Gera áudio para cada legenda
  for (const subtitle of subtitles) {
    const audioOutputPath = `${audioOutputDirectory}${subtitle.start}_${subtitle.end}_audio.mp3`;

    // Verifica se há um intervalo entre o final da legenda anterior e o início desta
    if (subtitle.start > previousEnd) {
      console.log('Intervalo silencioso encontrado, gerando áudio silencioso.');
      console.log('------------------------------------------------------------');
      const silentAudioOutputPath = `${audioOutputDirectory}${previousEnd}_${subtitle.start}_audio.mp3`;
      generateSilentAudio(subtitle.start - previousEnd, silentAudioOutputPath);
    }

    // Adiciona mensagem de log para verificar o caminho do arquivo de saída
    console.log('Gerando áudio para:', audioOutputPath);

    // Gera áudio a partir do texto e timestamps
    await generateAudioFromText(subtitle.text, audioOutputPath);

    previousEnd = subtitle.end;
  }

}

   await generateVideoSegments(inputVideo, subtitles, videoOutputDirectory, audioOutputDirectory);