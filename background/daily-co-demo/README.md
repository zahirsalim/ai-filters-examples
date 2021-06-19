# Vectorly Integration for Daily.co

This demo is meant to illustrate how Vectorly can be integrated into a Video Conferencing WebRTC chat app like Daily.co

This repo is forked from the [Daily.co demo repo](https://github.com/daily-demos/call-object-react). Much of the setup is directly from that original. We will highlight where Vectorly's code is located.


## Prerequisites

- [Sign up for a Daily account](https://dashboard.daily.co/signup).
- [Create a Daily room URL](https://help.daily.co/en/articles/4202139-creating-and-viewing-rooms) to test a video call quickly and hardcode a room URL (_this is NOT recommended for production_).
- [Get a Vectorly token](https://upscaler.vectorly.io/) by signing up or logging into the Vectorly dashboard
## How the demo works

In our app, when a user clicks to start a call, the app will create a [meeting room](https://docs.daily.co/reference#rooms), pass the room’s URL to a new Daily call object, and join the call [0]. The call object is something that keeps track of important information about the meeting, like other participants (including their audio and video tracks) and the things they do on the call (e.g. muting their mic or leaving), and provides methods for interacting with the meeting. The app leverages this object to update its state accordingly, and to carry out user actions like muting or screen-sharing. When the user leaves the meeting room, the call object is destroyed.

[0] If you'll be hardcoding the room URL for testing, the room will be passed as is to the call object. It bears repeating that _this is NOT recommended for production_.

## Running locally

1. Install dependencies `npm i`
2. Start dev server `npm run dev`
3. Then open your browser and go to `http://localhost:3002`
4. Add the Daily room URL you created to line 31 of `api.js`, and follow the comment's instructions.
5. Insert your Vectorly token into line 130 of src/components/App/App.js

## Integrating Vectorly's Background filters

You'll need to use the Daily.co API's `callObject`, specifically the callObject's `setIputDevice` method, in order to send a custom video source from the local sender.


You do this by intercepting the local participant's current video track, filtering it with Vectorly's background filter, and then sending the filtered video stream as the source video for the local participant.

The relevant code block in this repo is located in Line 126 of src/components/App/App.js



```
          const sourceVideoTrack = callObject._participants.local.videoTrack;

          const inputStream = new MediaStream([sourceVideoTrack]);

          const filter = new vectorly.BackgroundFilter(inputStream, {token: 'your-vectorly-token', background: 'https://demo.vectorly.io/virtual-backgrounds/1.jpg'});

          filter.getOutput().then(function(filteredTrack ){

            callObject.setInputDevicesAsync({
              videoSource: filteredTrack.getVideoTracks()[0],
            });

          });
 ```



With that code block, you should be able to see the background filter enabled for the local participant's video feed