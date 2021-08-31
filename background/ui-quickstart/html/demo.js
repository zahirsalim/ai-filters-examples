/* eslint-disable */
let setBackground = false;
console.log('Feature Check', vectorly.BackgroundFilter.isSupported());

function getUrlParams(prop) {
  window.searchParams = window.searchParams || (new URLSearchParams(window.location.search));
  return window.searchParams.get(prop)
}


async function initializeWebcam(){

  window.mediaStream = await navigator.mediaDevices.getUserMedia(window.constraints || {audio: false, video: true})

  const video = document.getElementById('video');
  window.bgFilter && window.bgFilter.changeInput(window.mediaStream)
  video.srcObject  = window.mediaStream;
}


async function streamWebcam() {
  try{
    if (!('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia)) {
      throw "webcam initialization failed"
    }

    let loadingGif = document.getElementById('loading');
    loadingGif.style.display = "block";

    await initializeWebcam();
    await enablebackground()

    loadingGif.style.display = "none";
  } catch (e) {
    alert("webcam initialization failed")
  }
}

async function stopWebcam(){
  window.mediaStream.getTracks()[0].stop()
  window.bgFilter && window.bgFilter.stop()
}

async function enablebackground(type, image) {
  setBackground = true;
  const processed = document.getElementById('demo');
  let background;

  if(type) background = (type === 'blur') ? type : image;

  const params = {
    debug: false,
    analyticsEnabled: false,
    token: getUrlParams('token') || '0b5707c6-6642-4cc8-8570-b29af9e51345',
    background: background,
    passthrough: true
  }
  if (window.bgFilter) {
    window.bgFilter.enable()

  } else {
    try {

      console.log("Media stream");
      console.log(window.mediaStream);
      const bgFilter = new vectorly.BackgroundFilter(window.mediaStream, params);
      window.bgFilter = bgFilter
      virtualBg = true;
      const outputStream = await bgFilter.getOutput()
      console.log('OutputStream', outputStream)
      processed.srcObject = outputStream
    } catch (err) {
      processed.srcObject = window.mediaStream;
      virtualBg = true;
    }
  }
}

async function disablebackground(){

  if (window.bgFilter) {
    window.bgFilter.disable()

  }
}

function blurbackground(){
  if (setBackground && window.bgFilter) {
    window.bgFilter.enable()
    window.bgFilter && window.bgFilter.changeBackground('blur')
  } else {
    enablebackground()
  }
}


function updatevirtualbackground(image){

  if (window.bgFilter) {
    window.bgFilter.enable()
    window.bgFilter.changeBackground(image);
  } else {
    enablebackground('virtual', image)
  }
}


window.onload = (event) => {
  streamWebcam();
};
