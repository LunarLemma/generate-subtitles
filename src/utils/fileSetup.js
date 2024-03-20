const fs= require("fs");
const path= require("path");
/* ---- INTERNAL FUNCTIONS : HELPERS ---- */
async function isDirectory(givenPath) {
    try {
        const status= await fs.promises.stat(givenPath);
        return status.isDirectory();
    } catch(error) {
        return false; // handled assuming it was a file
    }
}
function getDirChar() {
    if(process.platform=="win32") return "\\";
    else return "/";
}
function removePeriod(extension) {
    if(extension[0]==".")
        return extension.split(".")[1];
    return extension;
}

/* ---- EXPORTED FUNCTIONS ---- */

function getFilename(name) {
    const dirArray= name.split('/');
    const getFile= dirArray[dirArray.length-1];
    return getFile.split('.')[0];
}

function getExtension(name) {
    const dirArray= name.split('/');
    const getFile= dirArray[dirArray.length-1];
    return getFile.split('.')[1] ? getFile.split('.')[1] : "";
}

function addTrailingDirChar(dir) {
    try {
        const char= getDirChar();
        if(dir[dir.length-1]!=char) return dir+char;
        return dir; 
    } catch(err) {
        return dir;
    }
}

async function exist(file) {
    try {
        const check= await fs.promises.stat(file);
        return true;
    } catch(error) {
        return false;
    }
}

async function cleanUp(file_path) {
    try {
        await fs.promises.unlink(file_path);
        return true;
    } catch(error) {
        throw new Error(error);
    }
}

//Error needs to be handled at the callee function
async function getDirectory(filePath, {filename=undefined, ext=undefined}) {
    ext= removePeriod(ext)
    try {
        let dir;
        const checkDir= await isDirectory(filePath);
        if(filename && ext) {
            filename= filename+"." +ext;
        }
        if(checkDir) {
            if(filename) return (addTrailingDirChar(filePath)+filename);
            else return addTrailingDirChar(filePath);
        }
        dir= path.dirname(filePath);
        let file= (getFilename(filePath) ? getFilename(filePath) : filename) + (ext ? "." + ext : "." + getExtension(filePath));
        return addTrailingDirChar(dir)+file;
    } catch(error) {
        throw new Error(error);
    }
}


module.exports= { addTrailingDirChar, exist, getDirectory, getFilename, getExtension , cleanUp};