/* eslint-disable */

console.log('Feature Check', vectorly.BackgroundFilter.isSupported());

function getUrlParams(prop) {
  window.searchParams = window.searchParams || (new URLSearchParams(window.location.search));
  return window.searchParams.get(prop)
}


async function initializeWebcam(){

  window.mediaStream = await navigator.mediaDevices.getUserMedia(window.constraints || {audio: false, video: true})

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

async function enablebackground() {

  const processed = document.getElementById('demo');

  const params = {
    token: getUrlParams('token') || '0b5707c6-6642-4cc8-8570-b29af9e51345',
    passthrough: true
  }

  try {
    const bgFilter = new vectorly.BackgroundFilter(window.mediaStream, params);
    window.bgFilter = bgFilter
    const outputStream = await bgFilter.getOutput()
    processed.srcObject = outputStream
  } catch (err) {
    processed.srcObject = window.mediaStream;

  }

}

async function disablebackground(){

  if (window.bgFilter) {
    window.bgFilter.disable()

  }
}


function updatevirtualbackground(image){
  if (window.bgFilter) {
    window.bgFilter.enable()
    window.bgFilter.changeBackground(image);
  }
}


window.onload = (event) => {
  streamWebcam();
};
