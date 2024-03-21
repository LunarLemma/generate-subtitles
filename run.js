const {generate} = require("./index");

generate({
    inputFile: '/home/akshat/Desktop/test-3.mp4',
    outputDir: '/home/akshat/Desktop/hello.vtt',
    inputType: 'video',
    whisperFlags: {
        model: 'base'
    }
}).then(x => {
    console.log("huax", x)
}).catch(e => {
    console.error("Huaae", e)
});