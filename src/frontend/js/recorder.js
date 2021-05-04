const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");


let stream;
let recorder;
let videoFile;


const handleDownload = () => {
    const a = document.createElement("a");
    a.href= videoFile;
    a.download = "MyRecording.webm";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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