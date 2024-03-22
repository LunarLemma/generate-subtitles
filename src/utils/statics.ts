export const DEFAULT_MODEL= "base";
export const MODEL_PATH= "lib/whisper.cpp/models/";
export const SHELL_OPTIONS= {silent: true, async: true};
export const NAME_CPP_MODEL_MAP= {
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
export const MODEL_LIST= Object.keys(NAME_CPP_MODEL_MAP);

