// Whisper flags interface
interface flags {
    model : string;
    language?: string;
    subFormat?: string;
    threadCount?: number;
}
//Generate input options interface
export interface optionsSchema {
    inputFile: string;
    outputDir?: string;
    inputType: 'video' | 'audio' | 'Video' | 'Audio';
    whisperFlags: flags;
    enable_benchmarks?: boolean;     
}