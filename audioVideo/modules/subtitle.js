import { exec } from "child_process";

async function run() {
  console.log("começando whisper");
  exec(
    `whisper ./output/audio/som.mp3 --model base --language pt --task translate --output_format srt`,
    (err, stdout, stderr) => {
      console.log("whisper começou");
      if (err) {
        console.error(err);
        return err;
      }
      // fs.writeFile("./output/subtitle/texto.srt", stdout);
    }
  );
}

export default run;
