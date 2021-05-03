const video = document.querySelector("video");
const videoContainer = document.getElementById("videoContainer");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeLine = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoControls = document.getElementById("videoControls");

let controlsMovementTimeout = null;
let controlsTimeOut = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
    console.log(e);
    // if video playing pause it else play the video
    if(video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtnIcon.classList = video.paused ?  "fas fa-play" : "fas fa-pause";
};

const handleMuteClick = (e) => {
    if(video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
    volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
    const {target :{value}} = event;
    if(video.muted) {
        video.muted = false;
        muteBtn.innerText = "Mute";
    } 
    volumeValue = value;
    video.volume = value;
}

const formatTime = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(11,8);
}

const handleLoadedMetaData = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeLine.max = Math.floor(video.duration);
    
}

const handleTimeUpDate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeLine.value = Math.floor(video.currentTime);
}

const handleTimeLineChange = (event) => {
    const {target :{value}} = event;
    video.currentTime = value;
}

const handleFullScreen = () => {
    const fullscreen = document.fullscreenElement;
    if(fullscreen) {
        document.exitFullscreen();
        fullScreenIcon.classList = "fas fa-expand";
    } else {
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fas fa-compress";
    }
}

const hideControls = () => videoControls.classList.remove("showing");


const handleMouseMove = () => {
    if(controlsTimeOut) {
        clearTimeout(controlsTimeOut);
        controlsTimeOut = null;
    }
    if(controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    controlsMovementTimeout = setInterval(hideControls, 2000);
    videoControls.classList.add("showing");
}

const handleMouseLeave = () => {
    controlsTimeOut = setInterval(hideControls, 2000)
}

const handleEnded = () => {
    // cannot get id so, leave clue in pug template and get it here
    const { videoid } = videoContainer.dataset;
    fetch(`/api/videos/${videoid}/view`, {
        method: "POST",
    })
}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
// loadedmetadata event to get totalTime
video.addEventListener("loadedmetadata", handleLoadedMetaData);
// timeupdate event to track currentTime
video.addEventListener("timeupdate", handleTimeUpDate);
timeLine.addEventListener("input", handleTimeLineChange);
fullScreenBtn.addEventListener("click",handleFullScreen);

// video completed post view
video.addEventListener("ended", handleEnded)

// controller show hide
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);