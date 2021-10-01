

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
  return await navigator.mediaDevices.getUserMedia(window.constraints || {audio: false, video: true})
}


async function streamWebcam() {

    try{
      const inputStream = await initializeWebcam();

      const [selfieStream, unetStream] = await Promise.all([getFilter(inputStream,'selfie'), getFilter(inputStream,'webgl')]);

      document.getElementById('unet').srcObject = unetStream;
      document.getElementById('selfie').srcObject = selfieStream;




    } catch (e){

      console.log("There was an error loading the streams", e);
      console.log(e);

      const error  = document.getElementById('error');
      error.style.display = "block";
      error.textContent = e.stack;


    }



}


async function getFilter(inputStream, model) {


  const params = {
    token: getUrlParams('token') || '0b5707c6-6642-4cc8-8570-b29af9e51345',
    model: model,
    background: 'blur',
    debug: false,
    analyticsEnabled: false,
    passthrough: true,
    frameRate: 30,
    segmentationFrameRate: 15
  }

  const bgFilter = new vectorly.BackgroundFilter(inputStream, params);

  //updateFPS(model, bgFilter);

  return await bgFilter.getOutput();


}


function updateFPS(model, filter){
  //return
  try {
    setInterval(() => {

        let fps = filter.processor.metrics.fps;
        document.getElementById(model + '-fps').innerHTML = model + ' fps: '+fps;

    }, 1000);
  } catch (error) {
    console.log('ERROR in updateFPS', error)
  }
}




streamWebcam();

