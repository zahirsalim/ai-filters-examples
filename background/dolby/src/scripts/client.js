const avengersNames = ['Thor', 'Cap', 'Tony Stark', 'Black Panther', 'Black Widow', 'Hulk', 'Spider-Man'];
let randomName = avengersNames[Math.floor(Math.random() * avengersNames.length)];

const main = async () => {
  /* Event handlers */

  // When a stream is added to the conference
  VoxeetSDK.conference.on('streamAdded', (participant, stream) => {
    if (stream.type === 'ScreenShare') {
      return addScreenShareNode(stream);
    }

    if (stream.getVideoTracks().length) {
      // Only add the video node if there is a video track
      addVideoNode(participant, stream);
    }

    addParticipantNode(participant);
  });

  // When a stream is updated
  VoxeetSDK.conference.on('streamUpdated', (participant, stream) => {
    if (stream.type === 'ScreenShare') return;

    if (stream.getVideoTracks().length) {
      // Only add the video node if there is a video track
      addVideoNode(participant, stream);
    } else {
      removeVideoNode(participant);
    }
  });

  // When a stream is removed from the conference
  VoxeetSDK.conference.on('streamRemoved', (participant, stream) => {
    if (stream.type === 'ScreenShare') {
      return removeScreenShareNode();
    }

    removeVideoNode(participant);
    removeParticipantNode(participant);
  });

  try {
    // Initialize the Voxeet SDK
    // WARNING: It is best practice to use the VoxeetSDK.initializeToken function to initialize the SDK.
    // Please read the documentation at:
    // https://docs.dolby.io/interactivity/docs/initializing
    VoxeetSDK.initialize('customerKey', 'customerSecret');

    // Open a session for the user
    await VoxeetSDK.session.open({ name: randomName });

    // Initialize the UI
    initUI();
  } catch (e) {
    alert('Something went wrong : ' + e);
  }
}

function monkeyPatchVectorlyFilter(){

  navigator.mediaDevices._getUserMedia = navigator.mediaDevices.getUserMedia;


  navigator.mediaDevices.getUserMedia = async function (params){


    const original = await navigator.mediaDevices._getUserMedia(params);

    try{

      if(original.getVideoTracks().length === 0) return original;

      const originalVideoTrack  = original.getVideoTracks()[0];

      const filter = new vectorly.BackgroundFilter(originalVideoTrack, {token:  getUrlParams("token") || 'your-token',  model: 'webgl'})

      const filteredVideoStream = await filter.getOutput();

      if(original.getAudioTracks().length > 0) filteredVideoStream.addTrack(original.getAudioTracks()[0]);

      return filteredVideoStream;


    } catch (e) {

      return original;
    }

  };


}

monkeyPatchVectorlyFilter();

main();


function getUrlParams(prop) {
  window.searchParams = window.searchParams || (new URLSearchParams(window.location.search));
  return window.searchParams.get(prop)
}