 /* eslint-disable */
let setBackground = false;
let old_id = ""

function getUrlParams(prop) {
  window.searchParams = window.searchParams || (new URLSearchParams(window.location.search));
  return window.searchParams.get(prop)
}

async function initializeWebcam(){
    console.log('Initializing initializeWebcam', window.mediaStream)
    window.mediaStream = null;
    if (window.mediaStream === null || window.mediaStream === undefined || window.mediaStream.active === false) {
      var webcamStream = await navigator.mediaDevices.getUserMedia(window.constraints || {audio: false, video: true})
      // {width: 640, height: 360}})
      window.mediaStream = webcamStream;
    }
    document.getElementById(old_id) && document.getElementById(old_id).pause()
    const video = document.getElementById('video');
    old_id = 'video'
    video.srcObject  = window.mediaStream;
    video.play()
    window.bgFilter && window.bgFilter.changeInput(window.mediaStream)
}


async function streamWebcam() {
  try{
      if (!('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia)) {
          throw "webcam initialization failed"
      }
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
  const params = {
    debug: false,
    analyticsEnabled: true,
    token: getUrlParams('token') || '0b5707c6-6642-4cc8-8570-b29af9e51345',
    background: {'type': type || 'blur', 'image': image}
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
      if (window.bgFilter && window.bgFilter.processor.metrics && window.bgFilter.processor.metrics.fps) {
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

    let inputStream = sample_video.captureStream()
    window.mediaStream = inputStream;

    let default_video = document.getElementById('video');

    if(!setBackground) await enablebackground();

    if (setBackground) {
      // window.bgFilter && window.bgFilter.changeInput(window.mediaStream)
      sample_video.play()
      default_video.srcObject = window.mediaStream.clone();
      window.bgFilter.changeInput(inputStream);
    }

    updateFPS();

  } catch (error) {
      console.log('ERROR in enablebackground', error)
  }

  // if (!setBackground && window.bgFilter === undefined) {
  //   try {
  //     setBackground = true;
  //     const processed = document.getElementById('demo');
  //     const params = {
  //       debug: true,
  //       token: getUrlParams('token'),
  //       serverType: 'staging',
  //     }
  //     const bgFilter = new vectorly.BackgroundFilter(inputStream, params);
  //     window.bgFilter = bgFilter
  //     virtualBg = true;
  //     const outputStream = await bgFilter.getOutput()
  //     console.log('OutputStream', outputStream)
  //     processed.srcObject = outputStream
  //     updateFPS();
  //   } catch (err) {
  //     console.log('ERROR in enablebackground', err)
  //   }
  // } else {
  //     window.bgFilter.changeInput(inputStream);
  //     updateFPS();
  // }
}

window.onload = (event) => {
  console.log(`event`, event)
    try {
      setTimeout(() => {
      // changeInputStream('bg-video-4');
      // streamWebcam()
    }, 1000);
  } catch (error) {
    console.log('ERROR in background load', err)
  }
};
