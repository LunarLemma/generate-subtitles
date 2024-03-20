const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic= require('ffmpeg-static');
const {addTrailingDirChar}= require("./fileSetup")

function fetchAudio( {inputFile ,outputDir, outputFileName}) {
  return new Promise(async (resolve, reject) => {
    ffmpeg.setFfmpegPath(ffmpegStatic);
    ffmpeg()
    .input(inputFile)
    .format('wav')
    .audioFrequency(16000)
    .output(outputDir+"/"+outputFileName)
    .on('error' ,function (error) { 
      reject(error);
    })
    .on('end', function () {
      resolve(addTrailingDirChar(outputDir) + outputFileName );
    }).run();
  })
}

module.exports= { fetchAudio};