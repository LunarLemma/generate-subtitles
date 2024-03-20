const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic= require('ffmpeg-static');
const {addTrailingDirChar}= require("./fileSetup")

/**
 * @function  Fetches audio from the input file and saves it as a WAV file.
 * @param {Object} options - An object containing input and output configurations.
 * @param {string} options.inputFile - The path or name of the input file.
 * @param {string} options.outputDir - The directory where the output will be saved.
 * @param {string} options.outputFileName - The name of the output file.
 * @returns {Promise<string>} 
 * A promise that resolves with the path to the saved audio file, or rejects with an error message.
 * - Successful resolution returns the path to the saved audio file.
 * - Rejection reasons:
 *   - Errors encountered during audio conversion
 */
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