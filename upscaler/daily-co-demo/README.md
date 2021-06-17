# Vectorly Integration for Daily.co

This demo is meant to illustrate how Vectorly can be integrated into a Video Conferencing WebRTC chat app like Daily.co

This repo is forked from the [Daily.co demo repo](https://github.com/daily-demos/call-object-react). Much of the setup is directly from that original. We will highlight where Vectorly's code is located.


## Prerequisites

- [Sign up for a Daily account](https://dashboard.daily.co/signup).
- [Create a Daily room URL](https://help.daily.co/en/articles/4202139-creating-and-viewing-rooms) to test a video call quickly and hardcode a room URL (_this is NOT recommended for production_).

## How the demo works

In our app, when a user clicks to start a call, the app will create a [meeting room](https://docs.daily.co/reference#rooms), pass the room’s URL to a new Daily call object, and join the call [0]. The call object is something that keeps track of important information about the meeting, like other participants (including their audio and video tracks) and the things they do on the call (e.g. muting their mic or leaving), and provides methods for interacting with the meeting. The app leverages this object to update its state accordingly, and to carry out user actions like muting or screen-sharing. When the user leaves the meeting room, the call object is destroyed.

[0] If you'll be hardcoding the room URL for testing, the room will be passed as is to the call object. It bears repeating that _this is NOT recommended for production_.

## Running locally

1. Install dependencies `npm i`
2. Start dev server `npm run dev`
3. Then open your browser and go to `http://localhost:3002`
4. Add the Daily room URL you created to line 31 of `api.js`, and follow the comment's instructions.


## Integrating Vectorly AI Upscaling

You'll need to make 2 main changes to enable Vectorly's AI upscaling to work on a general video conferencing application like Daily.co.

1. Adjust the video encoder settings to send downscaled video content from the user's device (Line 121 in src/components/App/App.js

```
 case 'joined-meeting':
      window.callobj.setBandwidth({trackConstraints: {width: 320, height: 240}})
      setAppState(STATE_JOINED);
      break;
 ```

 2. Initialize the Upscaler object, and feed it the video tag of the main output view window (Line 77 in src/components/Tile/Tile.js)

```
    if (videoEl.current && props.isLarge) {
      window.upscalers = window.upscalers || {}
      window.upscalers[videoTrack.id] = new Upscaler(videoEl.current, {id: videoTrack.id});
    }
```


With those two changes, you should be able to see Vectorly's technology working to upscale video content.

