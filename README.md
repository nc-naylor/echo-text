# EchoText

EchoText is a web application that allows users to transcribe audio from their voice or audio files into text. Additionally, users have the option to translate the transcription into over 200 languages. EchoText leverages advanced machine-learning models for accurate transcription and translation, providing a seamless user experience for multilingual text processing.

## Live Demo

Check out the live version of EchoText here: [EchoText](https://nc-naylor-echo-text.netlify.app/)

## Features

- **Audio Transcription:** Convert voice recordings or uploaded audio files (.mp3) into accurate text transcriptions.
- **Language Translation:** Optionally translate transcriptions into over 200 languages.
- **Copy & Download:** Users can copy the transcription to the clipboard or download it as a `.txt` file.
- **Machine Learning Models:** Utilizes reliable models from the `transformers.js` library, including `xenova/nllb-200-distilled-600M` for translation and `openai/whisper-tiny.en` for transcription.
- **User-Friendly Interface:** Simple and intuitive interface built with React.js and Tailwind CSS for a smooth user experience.

## Technologies Used

This project utilizes the following technologies and libraries:

- [React.js](https://react.dev/) - A JavaScript library for building user interfaces.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for styling.
- [transformers.js](https://github.com/xenova/transformers.js) - A library for machine learning models, used for transcription and translation. (See [this example](https://github.com/xenova/transformers.js/blob/main/examples/react-translator/src/components/LanguageSelector.jsx) for the language list used in the project)
- [Vite](https://vitejs.dev/) - A fast build tool and development server.
- [HuggingFace Models](https://huggingface.co/) - Used for transcription and translation:
  - [xenova/nllb-200-distilled-600M](https://huggingface.co/Xenova/nllb-200-distilled-600M) - For translation into over 200 languages.
  - [openai/whisper-tiny.en](https://huggingface.co/openai/whisper-tiny.en) - For audio transcription.

## Getting Started

**Prerequisites**

- Node.js (v14 or later)
- npm (v6 or later)

## Installation

1. Clone the repository:

```bash
  git clone https://github.com/nc-naylor/echo-text.git
  cd echo-text
```

2. Install dependencies:

```bash
  npm install
```

3. Run the development server:

```bash
  npm run dev
```

3. Open your browser and navigate to:

```bash
  http://localhost:5173
```

## Project Structure

**Component Overview:**

- `FileDisplay.jsx`: Handles the display of the selected audio file and options to reset or start the transcription process.
- `Header.jsx`: Displays the main header of the application.
- `HomePage.jsx`: Handles audio recording and file uploads. Users can start/stop recordings, view duration, and upload .mp3 files for processing.
- `Information.jsx`: Displays the transcription or translation of audio input. Users can switch between transcription and translation views, copy text to the clipboard, or download it as a .txt file. Uses a web worker for translation tasks.
- `Transcribing.jsx`: Displays a loading screen during transcription.
- `Transcription.jsx`: Displays the transcription result.
- `Translation.jsx`: Allows users to select a target language and translate the provided text.

**Utility Files:**

- `presets.js`: Contains configurations and preset settings used throughout the application. Contains predefined language options for translation, sourced from [`LanguageSelector.jsx`](https://github.com/xenova/transformers.js/blob/main/examples/react-translator/src/components/LanguageSelector.jsx) used in the FLORES-200 datasest.
- `translate.worker.js`: Web worker responsible for handling the translation process using the Xenova model.
- `whisper.worker.js`: Web worker responsible for handling the transcription process using the Whisper model.

## Usage

1. **Transcription:** Click the "Record" button to start recording your voice or upload an audio file (.mp3). The application will transcribe the audio into text.
2. **Translation:** Once the transcription is complete, select the target language to translate the text.
3. **Copy or Download:** After the transcription or translation, click the "Copy" button to copy the text into your clipboard or "Download" to save it as a `.txt` file.

## License

This project is licensed under the [MIT License](./LICENSE.txt)
