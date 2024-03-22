import fs from 'fs';
import path from 'path';
import { fileStatSchema } from './interface';

/*
 * <---------------------- INTERNAL MODULE FUNCTIONS ---------------------->
 */

function removeTrailingPeriod(extension: string) : string {
    if(extension[0]==".") return extension.split(".")[1];
    else return extension;
}

/*
* <---------------------- EXPORT MODULE FUNCTIONS ---------------------->
*/

export async function fileStat(givenPath: string) : Promise<{exist: boolean;isDir?: boolean;}> {
    try {
        const status= await fs.promises.stat(givenPath);
        return { exist: true, isDir: status.isDirectory()}
    } catch(error) {
        return { exist: false }
    }
}

export async function (filePath: string) {
    try {
        filePath:
    } catch(Error)
}