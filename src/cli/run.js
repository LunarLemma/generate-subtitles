const { formatCommand, txtToVtt, run} = require("./cliHelper");
const fs= require("fs");
const vtt2srt = require('node-vtt-to-srt');

async function writeToFile(outputFile, str) {
    try {
        await fs.promises.writeFile( outputFile, str);
        return true;
    } catch(error) {
        throw new Error(error);
    }
}

function executeCommand({inputFile, modelPath, outputFile, whisperFlags}) {
    return new Promise((resolve, reject) => {
        const command= formatCommand({inputFile, modelPath, whisperFlags});
        run(command)
        .then((transcribe)=> {
            //! TODO: sync function, convert to stream for larger files 
            transcribe= txtToVtt(transcribe);
            return writeToFile( outputFile, transcribe);
        }).then((res) => {
            if(res) console.log(`|| Generate-Subtitles || An ${whisperFlags.subFormat} file has been successfully created`);
            resolve(inputFile);
        })
        .catch((error) => {
            reject(`Some error occurred in processing..\n${error}`);
        });
    });
}


module.exports = { executeCommand };