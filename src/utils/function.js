
const { MODEL_LIST, NAME_CPP_MODEL_MAP, MODEL_PATH, DEFAULT_MODEL} = require("./static_definitions");
const { exist, addTrailingDirChar, getDirectory, getExtension, getFilename} = require("./fileSetup");
const path= require("path");
const { fetchAudio } = require("./ffmpeg");

/* ---- INTERNAL FUNCTIONS : HELPERS ---- */

async function locateIOandModel(modelName, inputFile, outputDir) {
    const checkInput= await exist(inputFile);
    if(!checkInput) return { code: 0, message: "Input file doesn't exist"};
    if(outputDir){
      const checkOutputDir = await exist(outputDir);
      if(!checkOutputDir) return { code: 0, message: "Output location(dir/file) doesn't exist"}
    }
    let getModelPath= path.resolve(`${addTrailingDirChar(__dirname)}../../${MODEL_PATH+NAME_CPP_MODEL_MAP[modelName]}`);
    let checkModel= await exist(getModelPath);
    if(checkModel) 
    return {code: 1, message: `|| Generate-Subtitles || ${modelName} model exists...`, modelPath: getModelPath};
    
    getModelPath= addTrailingDirChar(path.dirname(getModelPath))+NAME_CPP_MODEL_MAP[DEFAULT_MODEL];
    checkModel= await exist(getModelPath);
    if(checkModel) 
    return {code: 1, message: `|| Generate-Subtitles || Choosen model not found, proceeding with ${DEFAULT_MODEL} model !!`, modelPath: getModelPath};
    
    return {code: 0, message: `Neither ${modelName} nor ${DEFAULT_MODEL} exist, please run- npx generate-subtitles download`};    
}

/* ---- EXPORTED FUNCTIONS ---- */

function validator({inputType, inputFile, outputDir, outputFormat, whisperModel}) {
    return new Promise((resolve, reject) => {
        try {

            if (!["video", "audio", "mp4", ".mp4", "wav", ".wav"].includes(inputType))
              return reject("Only audio(.wav) and video(.mp4) files are allowed");
            if (![".vtt", ".srt","vtt", "srt"].includes(outputFormat))
              return reject(" Not a valid type, only .vtt and .srt files are permitted");
            if (!MODEL_LIST.includes(whisperModel)) 
              return reject(`Not a valid model, please choose a valid model\n${MODEL_LIST}`);
            
            // Check for model availability
            locateIOandModel(whisperModel, inputFile, outputDir)
            .then((response)=> {
              if(response.code != 1)
                return reject(response.message);
              return resolve({success: true, modelPath: response.modelPath});
            });
          } catch (error) {
            return reject(error);
          }   
    });
}

/**
 * This modifies input output files 
 * modify - usage
 * @param {*} param0 
 * @returns 
 */
function normalizeIO({ inputFile, outputDir, inputType, outputFormat}) {
    return new Promise((resolve, reject) => {
      
      let inputFileName= getFilename(inputFile), inputFileExt= getExtension(inputFile), outputFile;
      if(outputDir) outputDir= path.resolve(outputDir);
      else outputDir= path.resolve(inputFile);

      getDirectory(outputDir, {filename: inputFileName, ext: outputFormat})
      .then((output)=> {
          outputFile= output;
          if(['mp4', '.mp4', 'video'].includes(inputType))
            return fetchAudio({inputFile ,outputDir: path.dirname(outputFile), outputFileName: inputFileName+".wav"})
          else if(!['.wav','wav'].includes(inputFileExt)) return reject("Require file to be .wav format with 16Khz frequency or (.mp4) video");
          return resolve({inputFile, outputFile});

      }).then((getAudioDestination)=>{
        if(getAudioDestination) inputFile= getAudioDestination;
        else reject("File could not be converted to audio format");
        // console.log(`|| Generate-Subtitles || A temproray file with name ${inputFileName+ ".wav"} will be created at Output directory...`);
        return resolve({inputFile, outputFile});
      }).catch(error=>{
        return reject(error);
      });
    });
}

module.exports = { validator , normalizeIO }; 
