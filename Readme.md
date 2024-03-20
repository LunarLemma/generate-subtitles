# Generate-Subtitles

---

### To Install

```npmignore
npm i generate-subtitles
```

## Description

This package parses video and audio files, to generate .vtt formatted subtitle files. The package is fully asynchronous and adds support for threads flag to run on lower powered systems complemented by file system support.

The package is built upon 

- [Openai-whisper]([Introducing Whisper](https://openai.com/research/whisper)) | OpenAI's open source model 

- [Whisper.cpp](https://github.com/ggerganov/whisper.cpp) | A custom cpp implementation of whisper model in C++.

- [whisper-node](https://github.com/ariym/whisper-node) | A similar package based on OpenAi-whisper and Whisper.cpp

---

## Usage

---

**Note**- To run the script for first time the package needs to download the model which is then saved in /node_modules/generate-subtitles/lib/whisper.cpp/models

To do that, run

```js
npx generate-subtitles download
```

and select an appropriate model.

##### Usage as modules

- Import generate function from the package.

```js
import { generate } from "generate-subtitles";
```

- Now make the options data.

```js
const options = {
    //required- where file must be placed
    inputFile: '/path/to/the/file', 
    //optional- when not specified, it saves at the input Dir
    outputDir: '/path/to/the/dir',
    //required- (enum)Valid inputs are only 'audio' and 'video'
    inputType: '/type_of_input(audio/video)',
    //required
    whisperFlags: {
        //not required- currently supports vtt only
        subFormat: 'vtt',
        //required- default model is base
        model: 'model_name',
        //not required- when using a multilingual model
        //default-english
        language: 'language_name',
        //not required- no of threads to run the model
        //default- 7
        threadCount: number,
    }
}
```

- Pass it to the function.

```js
try {
    const getSubtiles= await generate(options);
    //resolves with true
} catch(error) {
   // rejects with an error
}
```

---




