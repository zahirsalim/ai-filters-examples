# Vectorly Integration for Agora

This demo is meant to illustrate how Vectorly can be integrated into a Video Conferencing WebRTC chat app built with Agora.

This repo is based on the 4.x demo app for Agora


## Prerequisites

- [Sign up for an Agora account](https://www.agora.io/).
- [Get Your Agora App id](https://docs.agora.io/en/Agora%20Platform/get_appid_token?platform=All%20Platforms) to test a video call quickly
- [Get a Vectorly token](https://ai-filters.vectorly.io/) by signing up or logging into the Vectorly dashboard


## Running locally


1. Set Environment variables `AGORA_APP_ID` to your Agora App Id,  and `VECTORLY_TOKEN` to your Vectorly Token
2. Run npm install
3. Run npm start

It will open up a browser on port 8080, and it should load a test page where you can see your local video stream.


## Integrating Vectorly's Background filters

You'll need to use take in the raw `video track` from Agora, and output the filtered `videoTrack` back to Agora by using the `createCustomVideoTrack` method

The relevant code block in this repo is located in Line 74 of src/index.js



```
  const BackgroundFilter = vectorly.BackgroundFilter;

  const mediaStream = new MediaStream([localTracks.videoTrack._mediaStreamTrack]);

  const filter = new BackgroundFilter(mediaStream, {token: document.getElementById("vectorly-token").value});

  const filteredStream = await filter.getOutput();

  const customTrack = AgoraRTC.createCustomVideoTrack({
    mediaStreamTrack: filteredStream.getVideoTracks()[0],
  });

  localTracks.videoTrack = customTrack;
 ```



With that code block, you should be able to see the filtered video track loading in your view window.