import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");


let stream;
let recorder;
let videoFile;


const handleDownload = async() => {
    // running on webassembly 
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();

    // create transcoded file in ffmpeg world
    ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));
    await ffmpeg.run('-i', "recording.webm", "-r", "60", "output.mp4");
    
    // take screens shot of first frame at 1 second and save it as thumbnail.jpg in ffmpeg
    await ffmpeg.run('-i', "recording.webm", "-ss", "00:00:01", "-frames:v", "1", "thumbnail.jpg");

    // read transcoded file
    const mp4File = ffmpeg.FS("readFile", "output.mp4");
    // read image file
    const thumbFile = ffmpeg.FS("readFile", "thumbnail.jpg");

    // file number of array
    console.log(mp4File);
    // changed to raw binary data using buffer
    console.log(mp4File.buffer);

    // create blob, which is actual file
    const mp4Blob = new Blob([mp4File.buffer, { type:"video/mp4" }]);
    const thumbBlob = new Blob([thumbFile.buffer, { type:"image/jpg"}]);

    // create mp4 url & thumn url 
    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);


    // for video download
    const a = document.createElement("a");
    a.href= mp4Url;
    a.download = "MyRecording.mp4";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // for image download
    const thumbA = document.createElement("a");
    thumbA.href= thumbUrl;
    thumbA.download = "MyThumbnail.jpg";
    document.body.appendChild(thumbA);
    thumbA.click();
    document.body.removeChild(thumbA);

    // unlink files ::  cleansing (it stacks on memory so need to cleanse it)
    ffmpeg.FS("unlink", "recording.webm");
    ffmpeg.FS("unlink", "output.mp4");
    ffmpeg.FS("unlink", "thumbnail.jpg");
    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);

    // finish download event and make it start recording button & init
    startBtn.removeEventListener("click", handleDownload);
    startBtn.innerText="Start Recording";
    init();
    startBtn.addEventListener("click", handleStart);
}

const handleStop = () => {
    startBtn.innerText = "Download Recording";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleDownload);
    recorder.stop();

}

const handleStart = () =>{
    startBtn.innerText= "Stop Recording";
    startBtn.removeEventListener("click",handleStart);
    startBtn.addEventListener("click", handleStop);

    // Creates a new MediaRecorder object 
    recorder = new MediaRecorder(stream, {mimeType: "video/webm"});

    // add Event handlers 
    recorder.ondataavailable = (event) => {
        // console.log(event.data)
        videoFile = URL.createObjectURL(event.data);
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();

    } 
    recorder.start();

}

const init = async() => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            audio: true, 
            video: true,
        });

        video.srcObject = stream;
        video.play();

    } catch(err) {
        console.log(err)
    }
}

init();

startBtn.addEventListener("click", handleStart);