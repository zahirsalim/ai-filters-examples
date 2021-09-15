/* eslint-disable */
let setBackground = false;
let old_id = "";


import { BackgroundFilter } from '@vectorly-io/ai-filters'
import './demo.css';

console.log('Feature Check', BackgroundFilter.isSupported());



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


window.streamWebcam  = async function() {
  try{
    if (!('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia)) {
      throw "webcam initialization failed"
    }

    
    document.getElementById('demo').setAttribute('poster', "https://i.stack.imgur.com/ATB3o.gif");

    if(old_id === 'video'){
      window.bgFilter &&  window.bgFilter.disable()
      await stopWebcam()
      old_id=''
    }else{
      await initializeWebcam();
      await enablebackground()
      updateFPS();
    }

  } catch (e) {

    console.log(e);

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

  window.old_type = type;
  window.old_image = image;

  document.getElementById('btnradio2').disabled = true;
  document.getElementById('btnradio1').disabled = true;

  const params = {
    debug: false,
    analyticsEnabled: false,
    token: getUrlParams('token') || '0b5707c6-6642-4cc8-8570-b29af9e51345',
    background: background,
    frameRate: 30,
    segmentationFrameRate: 15,
    model: window.model || getUrlParams('model') || 'selfie',
    passthrough: true
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

window.changeInputStream = async  function (video_id) {


  try {
    if(old_id === 'video'){
      await stopWebcam()
    }
    window.bgFilter && window.bgFilter.enable()



    document.getElementById(old_id) && document.getElementById(old_id).pause()
    if(old_id===video_id){
      window.bgFilter &&  window.bgFilter.disable()
      old_id=''
      return
    }
    old_id = video_id


    let sample_video = document.getElementById(video_id)

    let inputStream
    if (sample_video.captureStream) {
      inputStream = sample_video.captureStream()
    } else if (sample_video.mozCaptureStream) {
      sample_video.play()  // The video needs to play before the inputStream is readable?
      inputStream = sample_video.mozCaptureStream()
    } else {
      inputStream = sample_video;
    }
    window.mediaStream = inputStream;

    let default_video = document.getElementById('video');

    if (inputStream instanceof MediaStream) {
      default_video.srcObject = inputStream
    } else {
      default_video.setAttribute('src', sample_video.currentSrc);
      default_video.load();
      await default_video.play();
      default_video.pause();
    }

    if(!setBackground) await enablebackground();

    if (setBackground) {
      // window.bgFilter && window.bgFilter.changeInput(window.mediaStream)
      await sample_video.play()

      if (inputStream instanceof MediaStream) {
       await window.bgFilter.changeInput(inputStream);
      } else {
       await default_video.play();
       await window.bgFilter.changeInput(sample_video);
        document.getElementById('safari-click-enable').style.display = "none";
      }
    }

    updateFPS();


  } catch (error) {
    console.log('ERROR in enablebackground', error)
  }


}



