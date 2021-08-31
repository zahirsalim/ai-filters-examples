/* eslint-disable */
let setBackground = false;
let old_id = "";
let isSafari = false;
console.log('Feature Check', vectorly.BackgroundFilter.isSupported());



function getUrlParams(prop) {
  window.searchParams = window.searchParams || (new URLSearchParams(window.location.search));
  return window.searchParams.get(prop)
}


async function initializeWebcam(){
  console.log('Initializing initializeWebcam', window.mediaStream)

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

  if(isSafari) document.getElementById('sources').style.visibility = "hidden";
}

window.disable = function (){
  bgFilter.disable();
}
window.enable = function (){
  bgFilter.enable();
}

async function disablebackground(){
 // setBackground = false;
  if (window.bgFilter) {
    window.bgFilter.disable()
   // processed.srcObject = await window.bgFilter.getOutput()
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

function virtualbackground(){
  window.bgFilter && window.bgFilter.changeBackground('')
}

function updatevirtualbackground(image_url){
  if(!setBackground) return;
  if (setBackground && window.bgFilter) {
    window.bgFilter.enable()
    image_url = image_url || "https://cdn.vectorly.io/public-demos/background-waterfall-pexels.jpg"
    window.bgFilter && window.bgFilter.changeBackground(image_url)
  } else {
    enablebackground('virtual', image_url)
  }
}


window.onload = (event) => {
  streamWebcam();
};
