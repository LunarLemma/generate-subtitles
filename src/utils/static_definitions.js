const DEFAULT_MODEL= "base";
const MODEL_PATH= "lib/whisper.cpp/models/";
const SHELL_OPTIONS= {silent: true, async: true};
const NAME_CPP_MODEL_MAP= {
    "tiny": "ggml-tiny.bin",
    "tiny.en": "ggml-tiny.en.bin",
    "base": "ggml-base.bin",
    "base.en": "ggml-base.en.bin",
    "small": "ggml-small.bin",
    "small.en": "ggml-small.en.bin",
    "medium": "ggml-medium.bin",
    "medium.en": "ggml-medium.en.bin",
    "large-v1": "ggml-large-v1.bin",
    "large": "ggml-large.bin"
}
const MODEL_LIST= Object.keys(NAME_CPP_MODEL_MAP);

module.exports= {DEFAULT_MODEL, MODEL_PATH, SHELL_OPTIONS, NAME_CPP_MODEL_MAP, MODEL_LIST}
