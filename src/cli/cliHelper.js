const {SHELL_OPTIONS, MODEL_PATH} = require("../utils/static_definitions");
const fs= require("fs");
const path= require("path");
// const {loadModel} = require("../../lib_whisper/download_model");
const shell= require('shelljs');
const {NAME_CPP_MODEL_LIST, DEFAULT_MODEL} = require("../utils/static_definitions")
/**
 * @function Formats whisper flags into a string for command-line usage.
 * @param {Object} whisperFlags - An object containing whisper flags.
 * @param {string} [whisperFlags.language] - The language for subtitles.
 * @param {number} [whisperFlags.threadCount] - The number of threads to use.
 * @returns {string} 
 * A formatted string containing whisper flags for command-line usage.
 */
function formatFlags(whisperFlags) {
    let flags="";
    if(whisperFlags.language) flags= flags + " -l " + whisperFlags.language;
    if(whisperFlags.threadCount) flags = flags + " -t " + whisperFlags.threadCount;
    else flags= flags + " -t 7";
    return flags;
}
/**
 * @function Formats a command string to run the main program.
 * @param {Object} options - An object containing input file, model path, and whisper flags.
 * @param {string} options.inputFile - The path or name of the input file.
 * @param {string} options.modelPath - The path to the whisper model.
 * @param {Object} options.whisperFlags - An object containing whisper flags.
 * @returns {string} 
 * A formatted command string to run the main program with specified options.
 */
function formatCommand({inputFile, modelPath, whisperFlags}) {
    return `./main ${formatFlags(whisperFlags)} -m ${modelPath} -f ${inputFile}`;
}
/**
 * @function Executes a command asynchronously.
 * @param {string} command - The command to execute.
 * @returns {Promise<string>} 
 * A promise that resolves with the stdout of the command if successful, or rejects with an error message.
 */
async function run(command){
    return new Promise( async (resolve, reject) => {
        try {
            shell.cd(path.normalize(`${__dirname}/../../${MODEL_PATH}../`));
            shell.exec(command, SHELL_OPTIONS, (code, stdout, stderr) => {
                if (code === 0) resolve(stdout);
                else reject(stderr);
              })
        } catch(error) {
            reject(error);
        }
    })

}
/**
 * @function Converts a transcript from plain text format to WebVTT format.
 * @param {string} transcript - The transcript in plain text format.
 * @param {string} [sub] - Subtitle identifier.
 * @returns {string} 
 * The transcript converted to WebVTT format.
 */
function txtToVtt(transcript, sub) {
    let str="WEBVTT";
    const numCharArray= ['1','2','3','4','5','6','7','8','9','0'];
    for(let i=0; i< transcript.length; i++){
        if(transcript[i] == "[" && numCharArray.includes(transcript[i+1])) {
            str=str+"\n";
            continue;
        } else if(transcript[i] == "]" && numCharArray.includes(transcript[i-1])) {
            str=str+"\n";
            continue;
        }
        if(transcript[i]==" " && transcript[i+1]==" ") continue;
        str=str+transcript[i];
    }
    return str;
}

module.exports= {formatCommand, txtToVtt, run};