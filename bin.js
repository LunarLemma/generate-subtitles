#!/usr/bin/env node
const shell= require('shelljs');
const readlineSync= require('readline-sync');
const fs= require('fs');
const {MODEL_LIST, DEFAULT_MODEL} = require("./src/utils/static_definitions");

function modelCLI() {
    const cliResponse= readlineSync.question(`\n|| Auto-Subtitles-Download-Script || \nEnter the model name to be download\n-Empty for default(${DEFAULT_MODEL}) model \n-Ctrl+C(^C) to exit \n`);
    if(cliResponse=="") {
        console.log(`Proceeding with default ${DEFAULT_MODEL} model`);
        return DEFAULT_MODEL;
    }
    else if(!MODEL_LIST.includes(cliResponse)) {
        console.log("Invalid model name, reinitiating question ...");
        return modelCLI();
    }
    return cliResponse;
}

function formattedModelTable() {
    console.log("--------------------------------------");
    console.log("|------_Model------|-VRAM-|--rs--|def|");
    console.log("|------------------|------|------|---|");
    console.log("|   tiny/tiny.en   |  1GB |  32x | 0 |");
    console.log("|   base/base.en   |  1GB |  16x | 1 |");
    console.log("|  small/small.en  |  2GB |   6x | 0 |");
    console.log("| medium/medium.en |  5GB |   2x | 0 |");
    console.log("|       large      | 10GB |   1x | 0 |");
    console.log("--------------------------------------");
}

async function model_downloader() {
    try {
        console.log("*** || Auto-Subtitles-Download-Script || ***");
        shell.cd(`${__dirname}/lib/whisper.cpp/models`);
        if(!shell.which('./download-ggml-model.sh')) throw new Error('|| Auto-Subtitles-Download-Script || Error in running download executable');
        formattedModelTable();
        const fetchModel= modelCLI();
        const scriptPath= (process.platform == "win32") ? "download-ggml-model.cmd" : "./download-ggml-model.sh";
        shell.exec(`${scriptPath} ${fetchModel}`);
        console.log("Model compilation started ...");
        shell.cd('../');
        shell.exec("make");
        process.exit(0);
    } catch(err) {
        console.log("|| Auto-Subtitles-Download-Script || Error in compiling model \n",err);
    }
}

model_downloader();
