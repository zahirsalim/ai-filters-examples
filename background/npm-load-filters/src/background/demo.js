/* eslint-disable */
let setBackground = false;


import { BackgroundFilter } from '@vectorly-io/ai-filters'
import './demo.css';

console.log('Feature Check', BackgroundFilter.isSupported());



function getUrlParams(prop) {
  window.searchParams = window.searchParams || (new URLSearchParams(window.location.search));
  return window.searchParams.get(prop)
}


async function initializeWebcam(width, height){
  console.log(`Initializing initializeWebcam with width: ${width}, height: ${height}`, window.mediaStream)

  window.mediaStream = await navigator.mediaDevices.getUserMedia(window.constraints || {audio: false, video:  {width: {exact: width}, height: {exact: height}}})

  const video = document.getElementById('video');
  window.bgFilter && window.bgFilter.changeInput(window.mediaStream)
  video.srcObject  = window.mediaStream;
}


window.streamWebcam  = async function(width=640, height=360) {
  try{
    if (!('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia)) {
      throw "webcam initialization failed"
    }

    document.getElementById('demo').setAttribute('poster', "https://i.stack.imgur.com/ATB3o.gif");

    await initializeWebcam(width, height);
    await enablebackground()
    updateFPS();


  } catch (e) {

    console.warn(e);
    alert(`Webcam initialized failed: ${e.name}`);
    document.getElementById('demo').setAttribute('poster', "");
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

  window.old_type = type;
  window.old_image = image;

  document.getElementById('btnradio2').disabled = true;
  document.getElementById('btnradio1').disabled = true;

  const params = {
    token: getUrlParams('token'),
    model: window.model || getUrlParams('model') || 'selfie',
    background: background,
    debug: false,
    analyticsEnabled: false,
    passthrough: true,
    frameRate: 30,
    segmentationFrameRate: 15
  }
  if (window.bgFilter) {
    window.bgFilter.enable()

  } else {
    try {

      console.log("Media stream");
      console.log(window.mediaStream);
      const bgFilter = new BackgroundFilter(window.mediaStream, params);
      window.bgFilter = bgFilter
      const outputStream = await bgFilter.getOutput()
      console.log('OutputStream', outputStream)
      processed.srcObject = outputStream
    } catch (err) {
      console.log('ERROR in enablebackground', err)
      console.log(err);
    }
  }

}

window.disable = function (){
  bgFilter.disable();
}
window.enable = function (){
  bgFilter.enable();
}

window.setAImodel = function(model){
  window.model = model;
  if(model==='webgl') document.getElementById('webgl-warning').style.display = 'block';
  else document.getElementById('webgl-warning').style.display = 'none';
}


window.disablebackground = function (){

  if (window.bgFilter) {
    window.bgFilter.disable()
  }
}

window.blurbackground = function (){
  if (setBackground && window.bgFilter) {
    window.bgFilter.enable()
    window.bgFilter && window.bgFilter.changeBackground('blur')
  } else {
    enablebackground()
  }
}

window.updatevirtualbackground = function(image_url){

  if (window.bgFilter) {
    window.bgFilter.enable()
    window.bgFilter && window.bgFilter.changeBackground(image_url)
  }
}



function updateFPS(){
  //return
  try {
    setInterval(() => {
      if (window.bgFilter && window.bgFilter.processor && window.bgFilter.processor.metrics && window.bgFilter.processor.metrics.fps) {
        let fps = window.bgFilter.processor.metrics.fps;
        document.getElementById('fps').innerHTML = 'FPS: '+fps;
      } else {
        document.getElementById('fps').innerHTML = '';
      }
    }, 1000);
  } catch (error) {
    console.log('ERROR in updateFPS', error)
  }
}




