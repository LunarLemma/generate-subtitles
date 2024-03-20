
const { MODEL_LIST, NAME_CPP_MODEL_MAP, MODEL_PATH, DEFAULT_MODEL} = require("./static_definitions");
const { exist, addTrailingDirChar, getDirectory, getExtension, getFilename} = require("./fileSetup");
const path= require("path");
const { fetchAudio } = require("./ffmpeg");

/* ---- INTERNAL FUNCTIONS : HELPERS ---- */
/**
 * @function Asynchronously locates the input file and model path for subtitle generation.
 * @param {string} modelName - The name of the model to locate.
 * @param {string} inputFile - The path or name of the input file.
 * @param {string} [outputDir] - The directory where the output will be saved.
 * @returns {Promise<Object>} 
 * A promise that resolves with an object containing information about the located model and input file, or rejects with an error.
 * - Successful resolution returns an object with the following properties:
 *   - code: 1,
 *   - message: A success message indicating the existence of the model or the fallback to a default model.
 *   - modelPath: The path to the located model.
 * - Rejection reasons:
 *   - Input file doesn't exist
 *   - Output location (directory or file) doesn't exist
 *   - Neither the specified model nor the default model exists
 */
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

/**
 * @function Validates input parameters for subtitle generation.
 * @param {Object} options - An object containing options for validation.
 * @param {string} options.inputType - The type of input data ('video' or 'audio').
 * @param {string} options.inputFile - The path or name of the input file.
 * @param {string} options.outputDir - The directory where the output will be saved.
 * @param {string} options.outputFormat - The format of the output file ('.srt' or '.vtt').
 * @param {string} options.whisperModel - The model to use for generation.
 * @returns {Promise<Object>} 
 * A promise that resolves with validation success or rejects with an error message.
 * - Successful resolution returns an object with the following properties:
 *   - success: true,
 *   - modelPath: The path to the located model.
 * - Rejection reasons:
 *   - Invalid input type (valid types are 'audio' or 'video')
 *   - Invalid output format (only '.srt' or '.vtt' are permitted)
 *   - Invalid model selection
 *   - Issues in locating the model or input file
 */
function validator({inputType, inputFile, outputDir, outputFormat, whisperModel}) {
    return new Promise((resolve, reject) => {
        try {
            if (!["video", "audio"].includes(inputType))
              return reject("Invalid Input type, valid types-> Audio/Video");
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
 * @function Normalizes input and output paths for subtitle generation.
 * @param {Object} options - An object containing input and output paths.
 * @param {string} options.inputFile - The path or name of the input file.
 * @param {string} options.outputDir - The directory where the output will be saved.
 * @param {string} options.inputType - The type of input data ('video' or 'audio').
 * @param {string} options.outputFormat - The format of the output file ('.srt' or '.vtt').
 * @returns {Promise<Object>} 
 * A promise that resolves with normalized input and output paths, or rejects with an error message.
 * - Successful resolution returns an object with the following properties:
 *   - inputFile: The normalized path of the input file.
 *   - outputFile: The normalized path of the output file.
 * - Rejection reasons:
 *   - Input file conversion issues
 *   - Errors in locating output directory or file
 */
function normalizeIO({ inputFile, outputDir, inputType, outputFormat}) {
    return new Promise((resolve, reject) => {
      
      let inputFileName= getFilename(inputFile), inputFileExt= getExtension(inputFile), outputFile;
      if(outputDir) outputDir= path.resolve(outputDir);
      else outputDir= path.resolve(inputFile);

      getDirectory(outputDir, {filename: inputFileName, ext: outputFormat})
      .then((output)=> {
          outputFile= output;
          if(['video'].includes(inputType))
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
