import { optionsSchema } from './types/interface';
import { validator , normalizeIO} from "./src/utils/function";

function parseOptions(options: optionsSchema) {
    if (options.inputType) options.inputType = options.inputType.toLowerCase() as 'video' | 'audio';
    if (options.whisperFlags) {
        if (options.whisperFlags.subFormat) options.whisperFlags.subFormat = options.whisperFlags.subFormat.toLowerCase();
        if (options.whisperFlags.model) options.whisperFlags.model = options.whisperFlags.model.toLowerCase();
        if (options.whisperFlags.language) options.whisperFlags.language = options.whisperFlags.language.toLowerCase();
    }
}
async function generate(options: optionsSchema) {
    try {
        const validate= await validator
    } catch(error) {
        
    }
}
