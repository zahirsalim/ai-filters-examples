/* eslint-disable */

let captureCam =false;
let segmentBg =false;
let blurBg =false;
let virtualBg =false;

// const width = 640;
// const height = 360;

function getUrlParams(prop) {
  window.searchParams = window.searchParams || (new URLSearchParams(window.location.search));
  return window.searchParams.get(prop)
}

async function initializeWebcam(){
    console.log('Initializing initializeWebcam', window.mediaStream)
    if (window.mediaStream === null || window.mediaStream === undefined || window.mediaStream.active === false) {
      var webcamStream = await navigator.mediaDevices.getUserMedia(window.constraints || {audio: false, video: true})
      // {width: 640, height: 360}})

      window.mediaStream = webcamStream;
    }
    const video = document.getElementById('video');
    window.bgFilter && window.bgFilter.changeInput(window.mediaStream)
    video.srcObject  = window.mediaStream;
}


async function playPause(capture) {
    console.log(capture)
    if (capture !== null && capture !== undefined){
      captureCam = capture
    } else {
      captureCam = !captureCam;
    }
    let btn = document.getElementById("cam-button");
    if (captureCam) {
        try{
            if (!('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia)) {
                throw "webcam initialization failed"
            }
            await initializeWebcam();
            await enablebackground('virtual')
        } catch (e) {
            alert("webcam initialization failed")
        }
        // btn.innerText = "Pause";
    } else {
        console.log("Pausing the video")
        window.mediaStream.getTracks()[0].stop()
        window.bgFilter && window.bgFilter.stop()
        // btn.innerText = "Play";
    }
}

async function enablebackground(type, image) {
    segmentBg = !segmentBg
    let btn = document.getElementById("bg-button");
    const processed = document.getElementById('demo');
    if (segmentBg) {
        const params = {
          debug: true,
          token: getUrlParams('token'),
          serverType: 'staging',
          background: {type: type, image: image},
        }
        if (window.bgFilter) {
          window.bgFilter.enable()
          processed.srcObject = await window.bgFilter.getOutput()
        } else {
          try {
            const bgFilter = new vectorly.BackgroundFilter(window.mediaStream, params);
            window.bgFilter = bgFilter
            virtualBg = true;
            const outputStream = await bgFilter.getOutput()
            console.log('OutputStream', outputStream)
            processed.srcObject = outputStream
          } catch (err) {
            console.log('ERROR in enablebackground', err)
          }
        }
        // btn.innerText = "Turn Virtual Background: OFF";
    }
}

async function disablebackground(){
  const processed = document.getElementById('demo');
  if (window.bgFilter) {
      window.bgFilter.disable()
      processed.srcObject = await window.bgFilter.getOutput()
      // btn.innerText = "Turn Virtual Background: ON";
    }
}

function blurbackground(){
  window.bgFilter && segmentBg && window.bgFilter.changeBackground('blur')
}

function virtualbackground(){
  window.bgFilter && segmentBg && window.bgFilter.changeBackground('')
}

function updatevirtualbackground(image_url){
  image_url = image_url || "https://cdn.vectorly.io/public-demos/background-waterfall-pexels.jpg"
  window.bgFilter && segmentBg && window.bgFilter.changeBackground(image_url)
}

