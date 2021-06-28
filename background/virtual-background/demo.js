/* eslint-disable */
let setBackground = false;
let old_id = "";
let isSafari = false;

function getUrlParams(prop) {
  window.searchParams = window.searchParams || (new URLSearchParams(window.location.search));
  return window.searchParams.get(prop)
}


async function initializeWebcam(){
  console.log('Initializing initializeWebcam', window.mediaStream)

  if(isSafari){

    if (window.mediaStream === null || window.mediaStream === undefined || window.mediaStream.active === false) {
      var webcamStream = await navigator.mediaDevices.getUserMedia(window.constraints || {audio: false, video: true})
      // {width: 640, height: 360}})
      window.mediaStream = webcamStream;
    }

  } else {
    window.mediaStream = await navigator.mediaDevices.getUserMedia(window.constraints || {audio: false, video: true})
  }

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

    if(old_id === 'video'){
      window.bgFilter &&  window.bgFilter.disable()
      await stopWebcam()
      old_id=''
    }else{
      await initializeWebcam();
      await enablebackground()
      updateFPS();
    }

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
    analyticsEnabled: true,
    token: getUrlParams('token') || '0b5707c6-6642-4cc8-8570-b29af9e51345',
    background: background
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

  if(isSafari) document.getElementById('sources').style.visibility = "hidden";
}

async function disablebackground(){
  setBackground = false;
  const processed = document.getElementById('demo');
  if (window.bgFilter) {
    window.bgFilter.disable()
    processed.srcObject = await window.bgFilter.getOutput()
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

async function changeInputStream(video_id) {

  let loadingGif = document.getElementById('loading');
  loadingGif.style.display = "block";

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

  loadingGif.style.display = "none";

}



async function safariClickEnableStream(){
  document.getElementById('safari-click-enable').style.display = "none";
  streamWebcam();
}

window.onload = (event) => {
  console.log(`event`, event)
    try {
      setTimeout(() => {



        for(var i=0; i < 4; i++){
          var video = document.getElementById('bg-video-' + (i+1));
          if(!(video.captureStream || video.mozCaptureStream))  {
           // document.getElementById('tab-video-' + (i+1)).style.visibility = "hidden";
            isSafari = true;
          }

        }

        if(isSafari) {
          document.getElementById('safari-click-enable').style.display = "block";
        }

    }, 200);
  } catch (error) {
    console.log('ERROR in background load', err)
  }
};
