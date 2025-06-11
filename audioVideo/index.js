import separateAudio from "./modules/audio.js";
import run from "./modules/subtitle.js";

async function main(input) {
  await separateAudio(input);
  await run();
}
// main();
//Replace the .mp4 video name below with the name of your video (don't delete the .input/, just the video name)
main("./input/Orang 3.3_Arrange objects within the closed curves on the plane..mp4");
