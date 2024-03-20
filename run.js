const {generate} = require("./index");


generate({inputFile: "/home/akshat/Desktop/test-3.mp4",
inputType: "video",
whisperFlags: {
    subFormat: "vtt",
    model: "base",
    threadCount: 2,
}})
.then((r)=>console.log("Done scene hai"))
.catch((err)=>console.log(err));