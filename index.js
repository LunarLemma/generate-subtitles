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
 * 
 * @param {*} param0 
 * @returns 
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
