const {SHELL_OPTIONS, MODEL_PATH} = require("../utils/static_definitions");
const fs= require("fs");
const path= require("path");
// const {loadModel} = require("../../lib_whisper/download_model");
const shell= require('shelljs');
const {NAME_CPP_MODEL_LIST, DEFAULT_MODEL} = require("../utils/static_definitions")

function formatFlags(whisperFlags) {
    let flags="";
    if(whisperFlags.language) flags= flags + " -l " + whisperFlags.language;
    if(whisperFlags.threadCount) flags = flags + " -t " + whisperFlags.threadCount;
    else flags= flags + " -t 7";
    return flags;
}
function formatCommand({inputFile, modelPath, whisperFlags}) {
    return `./main ${formatFlags(whisperFlags)} -m ${modelPath} -f ${inputFile}`;
}

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