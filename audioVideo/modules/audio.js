import ffmpeg from "fluent-ffmpeg";

async function separateAudio(video) {
  ffmpeg(video)
    .output("./output/audio/som.mp3")
    .on("end", () => {
      console.log("Áudio separado com sucesso!");
    })
    .on("error", (err) => {
      console.error("Erro ao separar o áudio:", err);
    })
    .run();
  return;
}

export default separateAudio;
