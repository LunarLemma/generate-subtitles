/* *
 * * ------------------------------------------------------------------------
 * * This model is based on openai-whisper cpp implementation from 
 * * ggerganov || URL- https://github.com/ggerganov/whisper.cpp ||
 * * All the models are then loaded into lib_whisper/whisper.cpp via
 * * npx script. Run ->> npx generate-subtitles download after installing
 * * this package in NPM.
 * * Package takes download scipt structure from whisper-node but adds 
 * * additional threads support and direct video support.
 * * Package is not tested on Win32 based platforms.
 * * ------------------------------------------------------------------------
 * */
//TODO: Modify the package to typescript
const { validator , normalizeIO} = require("./src/utils/function");
const { executeCommand} = require("./src/cli/run");
const { cleanUp } = require("./src/utils/fileSetup");
/**
 * Asynchronously generates subtitles based on input file and flags.
 * @param {Object} options - An object containing options for generation.
 * @param {string} options.inputFile - The path or name of the input file.
 * @param {string} options.outputDir - The directory where the output will be saved.
 * @param {string} options.inputType - The type of input data.
 * @param {Object} options.whisperFlags - An object containing flags for whispering.
 * @param {string} options.whisperFlags.subFormat - The subtitle format to generate.
 * @param {string} options.whisperFlags.model - The model to use for generation.
 * @param {string} options.whisperFlags.language - The language for subtitles.
 * @param {number} options.whisperFlags.threadCount - The number of threads to use.
 * @param {boolean} options.enableTraceLogs - A flag to enable trace logs.
 * @returns {Promise<boolean>} - A promise that resolves true when the file is succesfully generated
 */
async function generate({ inputFile, outputDir, inputType, whisperFlags, enableTraceLogs}) {
    //! TODO: Add benchmarking flags for user, sending user performance
    //! TODO: Add support for srt: parse the vtt output from openAI TO srt
    whisperFlags.subFormat= "vtt";
    let modelPath="";
    return new Promise((resolve, reject) => {
        validator({inputType, inputFile, outputDir, outputFormat: whisperFlags.subFormat, whisperModel: whisperFlags.model })
        .then((isValid)=> {
            if(isValid.success) modelPath= isValid.modelPath;
            return normalizeIO({ inputFile, outputDir, inputType, outputFormat: whisperFlags.subFormat})
        }).then((file)=> {
            return executeCommand({inputFile: file.inputFile, outputFile: file.outputFile, modelPath, whisperFlags})
        }).then((modifiedFile)=> {
            if(modifiedFile && ['mp4', 'video', '.mp4'].includes(inputType))
                return cleanUp(modifiedFile);
            else return resolve(true);
        }).then((done)=> {
            console.log("I fired");
            console.log("|| Generate-Subtitles || The temporary file has been cleaned up");
            return resolve(true);
        })
        .catch((error)=> {
            if(enableTraceLogs) console.trace("|| Error: Generate-Subtitles || \n ",error);
            reject(error);
        })
    })
}


module.exports = { generate };
