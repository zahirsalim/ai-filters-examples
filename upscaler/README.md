<img src="https://user-images.githubusercontent.com/5678502/134426534-effa11ab-2048-4d1f-85b0-d3355bce04f5.png" height="30" >

## Upscale Filter SDK

Vectorly has built it's own AI Upscaling filter based on a technique called Super Resolution, which uses AI to upscale and enhance images. Through Super Resolution, we can upscale and clean-up low-resolution video, making it look close to HD quality.

<img src="https://user-images.githubusercontent.com/5678502/134424900-b3bf24f0-85aa-42e8-abd2-366940150d73.png" width="600" >


#### Basic Usage

For the `UpscaleFilter`, the basic API involves instantiating an `UpscaleFilter` object, and specifying a `video` element.

    const video = document.getElementById("video");
    const upscaler = new UpscaleFilter(video, {token: 'vectorly-token'});

#### Quickstarts

To just get started with a basic example, you can take a look at the following quickstarts:
* [NPM quickstart](npm-load-filters)
* [CDN quickstart](html5-plugins-demo/standalone/index.html)
* [Electron quickstart](electron-demo)
* [React quickstart](react-demo)
* [Low level control](low-level-control)


#### Integrations

We also have quickstarts/integrations with popular Video APIs and Video Players

* [HTML5 Video Players](html5-plugins-demo)
* [Amazon Chime](amazon-chime-sdk-demo)
* [Daily.co](daily-co-demo)
* [Vonage](vonage-demo)
* [WebRTC Demo](webrtc-demo)
