/* eslint-disable */

const BackgroundFilter = vectorly.BackgroundFilter;


async function startStream() {

  const processed = document.getElementById('demo');

  const inputStream = await navigator.mediaDevices.getUserMedia({audio: false, video: true})

  if (!BackgroundFilter.isSupported()) {

    alert("Virtual Backgrounds is not supported on this browser");
    processed.srcObject = inputStream;

  } else {

    try {
      const outputStream = await enablebackground(inputStream);
      processed.srcObject = outputStream;

    } catch (e) {
      alert("Unable to start virtual backgrounds", e);
      processed.srcObject = inputStream;
    }


  }
}

async function enablebackground(inputStream) {

  const params = {
    token: getUrlParams('token') || '0b5707c6-6642-4cc8-8570-b29af9e51345',
    passthrough: true
  }
  const bgFilter = new BackgroundFilter(inputStream, params);
  window.bgFilter = bgFilter
  return await bgFilter.getOutput()


}

async function disablebackground() {
  if (window.bgFilter) window.bgFilter.disable()
}


function updatevirtualbackground(image) {
  if (window.bgFilter) {
    window.bgFilter.enable()
    window.bgFilter.changeBackground(image);
  }
}



window.addEventListener('load', async function () {

  try {
    startStream();
  } catch (e) {
    alert("Unable to initialize webcam", e);
  }

});



function getUrlParams(prop) {
  window.searchParams = window.searchParams || (new URLSearchParams(window.location.search));
  return window.searchParams.get(prop)
}
