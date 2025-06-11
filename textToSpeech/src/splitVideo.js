import ffmpeg from 'fluent-ffmpeg';
import async from 'async';
import { execSync } from 'child_process';
import fs from 'fs'
import path from 'path';

function getVideoDuration(videoFilePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoFilePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        // Obtém a duração do vídeo a partir dos metadados
        const durationInSeconds = metadata.format.duration;
        resolve(durationInSeconds);
      }
    });
  });
}


// Função para dividir um vídeo com base nas legendas usando fluent-ffmpeg

function generateSilentAudio(duration, outputPath) {
  try {
    execSync(
      `ffmpeg -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -t ${duration} ${outputPath}`,
      { stdio: 'inherit' }
    );
    console.log(`✅ Silêncio gerado: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Fallback ativado! Gerando silêncio alternativo...`);
    // Fallback usando vídeo preto -> áudio
    execSync(
      `ffmpeg -f lavfi -i "color=black:s=1x1:r=1:d=${duration}" -vf "nullsrc=s=1x1" -ar 44100 -ac 2 -t ${duration} ${outputPath}`,
      { stdio: 'inherit' }
    );
  }
}

  function generateVideoSegments(inputVideo, subtitles, videoOutputDirectory) {
    let previousEnd = 0;

    // Cria uma fila com concorrência limitada
    const queue = async.queue((task, callback) => {
      ffmpeg()
        .input(inputVideo)
        .setStartTime(task.start)
        .setDuration(task.duration)
        .output(task.outputFile)
        .on('end', () => {
          console.log(`Vídeo segmentado: ${task.outputFile}`);
          console.log('-------------------------------------------------');
          callback();
        })
        .on('error', (err) => {
          console.error('Erro ao segmentar o vídeo:', err);
          callback(err);
        })
        .run();
    }); // Limita a concorrência a 2

    for (const subtitle of subtitles) {
      if (subtitle.start > previousEnd) {
        const segmentOutputFile = `${videoOutputDirectory}/${previousEnd}_${subtitle.start}_segment.mp4`;
        queue.push({ start: previousEnd, duration: subtitle.start - previousEnd, outputFile: segmentOutputFile });
      }

      const segmentOutputFile = `${videoOutputDirectory}/${subtitle.start}_${subtitle.end}_segment.mp4`;
      queue.push({ start: subtitle.start, duration: subtitle.end - subtitle.start, outputFile: segmentOutputFile });

      previousEnd = subtitle.end;
    }
  }


export {generateVideoSegments, generateSilentAudio};

