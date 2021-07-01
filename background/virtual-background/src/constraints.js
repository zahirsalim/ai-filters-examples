/* eslint-disable */

window.onload = () => {
  console.log('ONLOAD')
  let stream = window.mediaStream
  const video = document.getElementById('video');


  const dimensions = document.querySelector('#dimensions');

  const vgaButton = document.querySelector('#vga');
  const qvgaButton = document.querySelector('#qvga');
  const hdButton = document.querySelector('#hd');
  const fullHdButton = document.querySelector('#full-hd');
  /*
  const cinemaFourKButton = document.querySelector('#cinemaFourK');
  const televisionFourKButton = document.querySelector('#televisionFourK');
  const eightKButton = document.querySelector('#eightK');
  */

  let currentWidth = 0;
  let currentHeight = 0;

  vgaButton.onclick = () => {
    getMedia(vgaConstraints);
  };

  qvgaButton.onclick = () => {
    getMedia(qvgaConstraints);
  };

  hdButton.onclick = () => {
    getMedia(hdConstraints);
  };

  fullHdButton.onclick = () => {
    getMedia(fullHdConstraints);
  };

  /*
  televisionFourKButton.onclick = () => {
    getMedia(televisionFourKConstraints);
  };

  cinemaFourKButton.onclick = () => {
    getMedia(cinemaFourKConstraints);
  };

  eightKButton.onclick = () => {
    getMedia(eightKConstraints);
  };
  */

  const qvgaConstraints = {
    video: {width: {exact: 320}, height: {exact: 240}}
  };

  const vgaConstraints = {
    video: {width: {exact: 640}, height: {exact: 480}}
  };

  const hdConstraints = {
    video: {width: {exact: 1280}, height: {exact: 720}}
  };

  const fullHdConstraints = {
    video: {width: {exact: 1920}, height: {exact: 1080}}
  };

  /*
  const televisionFourKConstraints = {
    video: {width: {exact: 3840}, height: {exact: 2160}}
  };

  const cinemaFourKConstraints = {
    video: {width: {exact: 4096}, height: {exact: 2160}}
  };

  const eightKConstraints = {
    video: {width: {exact: 7680}, height: {exact: 4320}}
  };
  */

  function displayVideoDimensions(whereSeen) {
    if (video.videoWidth) {
      dimensions.innerText = 'Actual video dimensions: ' + video.videoWidth +
        'x' + video.videoHeight + 'px.';
      if (currentWidth !== video.videoWidth ||
        currentHeight !== video.videoHeight) {
        console.log(whereSeen + ': ' + dimensions.innerText);
        currentWidth = video.videoWidth;
        currentHeight = video.videoHeight;
      }
    } else {
      dimensions.innerText = 'Video not ready';
    }
  }

  video.onloadedmetadata = () => {
    displayVideoDimensions('loadedmetadata');
  };

  video.onresize = () => {
    displayVideoDimensions('resize');
  };



  function gotStream(mediaStream) {
    console.log('gotStream', mediaStream)
    window.mediaStream = mediaStream; // stream available to console
    stream = window.mediaStream
    initializeWebcam();
    const track = mediaStream.getVideoTracks()[0];
    const constraints = track.getConstraints();
    console.log('Result constraints: ' + JSON.stringify(constraints));
    /*
    if (constraints && constraints.width && constraints.width.exact) {
      widthInput.value = constraints.width.exact;
      widthOutput.textContent = constraints.width.exact;
    } else if (constraints && constraints.width && constraints.width.min) {
      widthInput.value = constraints.width.min;
      widthOutput.textContent = constraints.width.min;
    }
    */
  }


  function getMedia(constraints) {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
    }

    window.constraints = constraints

    // videoblock.style.display = 'none';
    navigator.mediaDevices.getUserMedia(constraints)
        .then(gotStream)
        .catch(e => {
          console.error('getUserMedia', e.message, e.name);
          dimensions.innerText = `getUserMedia: ${e.message} ${e.name}`
        });
  }
}
