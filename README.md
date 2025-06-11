# Translate and Sync Subtitles and Voice

## Project Overview
A script for translating and synchronizing videos with the following steps:

1. Audio extraction - Separates the audio from the original video

2. Translation with Whisper - Transcribes and translates the audio into English (generating a .srt file)

3. Human review - Manually edit the generated subtitles

4. Subtitle insertion - Using ffmpeg to embed the subtitles into the video

5. Audio generation - TTS system to create new audio tracks

6. Final editing - Manually synchronizing the clips in the video editor

# Prerequisites

| Component | Minimum Version | Verification Command | Notes |
|-------------|---------------|------------------------|----------------------------|
| FFmpeg | Latest | `ffmpeg -version` | Video/Audio Manipulation |
| Whisper | - | `Whisper --version` | Translation template |
| Python | 3.8+ | `python3 --version` | Required by Whisper |
| Node.js | v22.13+ | `node --version` | Main runtime |
| Yarn | Latest | `yarn --version` | Package manager |

# Installing Prerequisites

## Node.js v22.13+

### Windows/macOS
1. Download the official installer: Node.js v22.x

2. Run the installer with default settings

3. Verify the installation:

```bash
node --version # Should return v22.13 or higher
npm --version
```

### Linux (Ubuntu/Debian)
```bash
## Set up the NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

## Install Node.js
sudo apt-get install -y nodejs

## Verify installation
node --version
```

### Via NVM
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
## Restart the terminal after
nvm install 22
nvm use 22
```

## FFmpeg

### Windows
1. Download ffmpeg: [FFmpeg Windows Builds](https://ffmpeg.org/download.html)

2. Extract and add to PATH

or install via Chocolatey:
```bash
choco install ffmpeg
```

### MacOS (via Homebrew)
```bash
brew install ffmpeg
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install ffmpeg
```

## Python and Whisper

### Windows
- On Windows you can download Python through the website:[Python](https://www.python.org/downloads/)
- Or download by Microsoft Store. The Whisper you can follow the command below.

```bash
## Install Python
sudo apt install python3 python3-pip # Linux
brew install python # macOS

## Install Whisper
pip install -U openai-whisper

## Verify installation
whisper --version
```

## Yarn
Run in the terminal:
```bash
npm install --global yarn
```

# Installing the script
1. In the terminal, navigate to `textToSpeech/`.

2. Run the `yarn` command to install the packages.

3. Still in the terminal, navigate to audioVideo.

4. Run the `yarn` command.

# Recommended Workflow
## Best practices
- It is recommended to use Visual Studio Code.

- Use one terminal open in `/audioVideo` and another in `/textToSpeech`.

- Always keep the terminals open while using the script.

## How to run the script:

### In the audioVideo folder:

1. Place the original video in the `audioVideo/input/` folder.

2. Copy the name of your video and paste it in the indicated line inside the `index.js` file

3. Save the file with `ctrl + S`

4. Run the `node index.js` command

5. Wait until the .srt file is generated

6. Manually edit the .srt file

7. Run the ffmpeg command in the terminal to incorporate the subtitles:

```bash
ffmpeg -i input.mp4 -vf "subtitles=som.srt" output.mp4
```

8. Move or copy the subtitled video to `textToSpeech/` and the subtitle file to `textToSpeech/subtitles/`

### In the textToSpeech folder

1. With the video in the `textToSpeech/` folder and the subtitle file in the `textToSpeech/subtitles/` folder, just run the `node index.js` command.

2. Wait for the video and audio clips to process.

3. Import everything into your favorite video editor for final synchronization.