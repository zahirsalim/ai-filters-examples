/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* global TimelineDataSeries, TimelineGraphView */

'use strict';

const remoteVideo = document.querySelector('video#remoteVideo');
const localVideo = document.querySelector('video#localVideo');
const originalVideo = document.querySelector('video#originalVideo');




let pc1;
let pc2;
let localStream;
let filteredStream;

// Can be set in the console before making a call to test this keeps
// within the envelope set by the SDP. In kbps.
// eslint-disable-next-line prefer-const
let maxBandwidth = 0;

let headerrateSeries;


let height = 240;
let width = 320;


let packetSeries;

let upscaler;

let lastResult;

const offerOptions = {
  offerToReceiveAudio: 0,
  offerToReceiveVideo: 1
};





async function gotStream(stream) {
  console.log('Received local stream');
  localStream = stream;



  try {

    const BackgroundFilter = vectorly.BackgroundFilter;
    const filter = new BackgroundFilter(stream, {token:  getUrlParams("token"), background: 'https://demo.vectorly.io/virtual-backgrounds/1.jpg'});
    filteredStream=  await filter.getOutput();  //Video Stream Track

  } catch (e){

    console.log("Error");
    console.log(e);

  }



  originalVideo.srcObject = localStream;
  localVideo.srcObject = filteredStream;

  filteredStream.getTracks().forEach(function (track){
    pc1.addTrack(track, filteredStream);
  });



  console.log('Adding Local Stream to peer connection');

  pc1.createOffer(
      offerOptions
  ).then(
      gotDescription1,
      onCreateSessionDescriptionError
  );

}

function onCreateSessionDescriptionError(error) {
  console.log('Failed to create session description: ' + error.toString());
}

function getUrlParams(prop) {
  window.searchParams = window.searchParams || (new URLSearchParams(window.location.search));
  return window.searchParams.get(prop)
}




function call() {

  console.log('Starting call');

  const servers = null;
  pc1 = new RTCPeerConnection(servers);

    const rtpTransceiver = pc1.addTransceiver("video");

  console.log('Created local peer connection object pc1');
  pc1.onicecandidate = onIceCandidate.bind(pc1);

  pc2 = new RTCPeerConnection(servers);
  console.log('Created remote peer connection object pc2');
  pc2.onicecandidate = onIceCandidate.bind(pc2);
  pc2.ontrack = gotRemoteStream;

  console.log('Requesting local stream');
  navigator.mediaDevices.getUserMedia({video: { width:width, height: height }})
      .then(gotStream)
      .catch(e => console.warn('getUserMedia() error: ' + e.name));

}

function gotDescription1(desc) {
  console.log('Offer from pc1 \n' + desc.sdp);
  pc1.setLocalDescription(desc).then(
      () => {
        pc2.setRemoteDescription(desc)
            .then(() => pc2.createAnswer().then(gotDescription2, onCreateSessionDescriptionError),
                onSetSessionDescriptionError);
      }, onSetSessionDescriptionError
  );
}

function gotDescription2(desc) {
  pc2.setLocalDescription(desc).then(
      () => {
        console.log('Answer from pc2 \n' + desc.sdp);
        let p;
        if (maxBandwidth) {
          p = pc1.setRemoteDescription({
            type: desc.type,
            sdp: updateBandwidthRestriction(desc.sdp, maxBandwidth)
          });
        } else {
          p = pc1.setRemoteDescription(desc);
        }
        p.then(() => {}, onSetSessionDescriptionError);
      },
      onSetSessionDescriptionError
  );
}

function gotRemoteStream(e) {
  if (remoteVideo.srcObject !== e.streams[0]) {
    remoteVideo.srcObject = e.streams[0];
    console.log('Received remote stream');
  }
}

function getOtherPc(pc) {
  return pc === pc1 ? pc2 : pc1;
}

function getName(pc) {
  return pc === pc1 ? 'pc1' : 'pc2';
}

function onIceCandidate(event) {
  getOtherPc(this)
      .addIceCandidate(event.candidate)
      .then(onAddIceCandidateSuccess)
      .catch(onAddIceCandidateError);

  console.log(`${getName(this)} ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
}

function onAddIceCandidateSuccess() {
  console.log('AddIceCandidate success.');
}

function onAddIceCandidateError(error) {
  console.log('Failed to add ICE Candidate: ' + error.toString());
}

function onSetSessionDescriptionError(error) {
  console.log('Failed to set session description: ' + error.toString());
}




call();