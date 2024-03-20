const { formatCommand, txtToVtt, run} = require("./cliHelper");
const fs= require("fs");
const vtt2srt = require('node-vtt-to-srt');

/**
 * @function Writes a string to a file asynchronously.
 * @param {string} outputFile - The path to the output file.
 * @param {string} str - The string to write to the file.
 * @returns {Promise<boolean>} 
 * A promise that resolves true if the write operation is successful, or rejects with an error message.
 * - Rejection reasons:
 *   - Error encountered during file write operation
 */
async function writeToFile(outputFile, str) {
    try {
        await fs.promises.writeFile( outputFile, str);
        return true;
    } catch(error) {
        throw new Error(error);
    }
}
/**
 * @function Executes a command asynchronously and writes the result to a file.
 * @param {Object} options - An object containing input file, model path, output file, and whisper flags.
 * @param {string} options.inputFile - The path or name of the input file.
 * @param {string} options.modelPath - The path to the whisper model.
 * @param {string} options.outputFile - The path to the output file.
 * @param {Object} options.whisperFlags - An object containing whisper flags.
 * @returns {Promise<string>} 
 * A promise that resolves with the path to the input file if successful, or rejects with an error message.
 * - Rejection reasons:
 *   - Error encountered during command execution or file write operation
 *   - Issues with processing or formatting the transcription
 */
function executeCommand({inputFile, modelPath, outputFile, whisperFlags}) {
    return new Promise((resolve, reject) => {
        const command= formatCommand({inputFile, modelPath, whisperFlags});
        run(command)
        .then((transcribe)=> {
            //! TODO: sync function, convert to stream for larger files 
            transcribe= txtToVtt(transcribe);
            return writeToFile( outputFile, transcribe);
        }).then((res) => {
            // if(res) console.log(`|| Generate-Subtitles || An ${whisperFlags.subFormat} file has been successfully created`);
            resolve(inputFile);
        })
        .catch((error) => {
            reject(`Some error occurred in processing..\n${error}`);
        });
    });
}


module.exports = { executeCommand };