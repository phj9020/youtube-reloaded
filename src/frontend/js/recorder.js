import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");


let stream;
let recorder;
let videoFile;

const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg",
}

const downloadFile = (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href= fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

const handleDownload = async() => {
    actionBtn.removeEventListener("click", handleDownload);
    actionBtn.innerText="Transcoding...";
    actionBtn.disabled = true;

    // running on webassembly 
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();

    // create transcoded file in ffmpeg world
    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
    await ffmpeg.run('-i', files.input, "-r", "60", files.output);
    
    // take screens shot of first frame at 1 second and save it as thumbnail.jpg in ffmpeg
    await ffmpeg.run('-i', files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb);

    // read transcoded file
    const mp4File = ffmpeg.FS("readFile", files.output);
    // read image file
    const thumbFile = ffmpeg.FS("readFile", files.thumb);

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
    downloadFile(mp4Url, "MyRecording.mp4");
    
    // for image download
    downloadFile(thumbUrl, "MyThumbnail.jpg");
    

    // unlink files ::  cleansing (it stacks on memory so need to cleanse it)
    ffmpeg.FS("unlink", files.input);
    ffmpeg.FS("unlink", files.output);
    ffmpeg.FS("unlink", files.thumb);
    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);

    // finish download event and make it start recording button & init
    
    actionBtn.innerText="Start Recording";
    actionBtn.disabled = false;
    init();
    actionBtn.addEventListener("click", handleStart);
}

// const handleStop = () => {
//     actionBtn.innerText = "Download Recording";
//     actionBtn.removeEventListener("click", handleStop);
//     actionBtn.addEventListener("click", handleDownload);
//     recorder.stop();
// }

const handleStart = () =>{
    actionBtn.innerText= "Recording";
    actionBtn.disabled= true;
    actionBtn.removeEventListener("click",handleStart);
    // actionBtn.addEventListener("click", handleStop);

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
        actionBtn.innerText= "Download";
        actionBtn.disabled=false;
        actionBtn.addEventListener("click", handleDownload)
        
    }; 
    recorder.start();
    
    setTimeout(()=> {
        recorder.stop();
    }, 5000);

}

const init = async() => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            audio: true, 
            video: {
                width: 1024,
                height:576
            },
        });

        video.srcObject = stream;
        video.play();

    } catch(err) {
        console.log(err)
    }
}

init();

actionBtn.addEventListener("click", handleStart);