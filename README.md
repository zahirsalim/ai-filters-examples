<img src="https://user-images.githubusercontent.com/5678502/134426534-effa11ab-2048-4d1f-85b0-d3355bce04f5.png" height="50" >

# AI Filters Web SDK

[![npm version](https://badge.fury.io/js/@vectorly-io%2Fai-filters.svg)](https://badge.fury.io/js/@vectorly-io%2Fai-filters)

Vectorly's AI Filters SDK makes it easy to add AI features such as Virtual Backgrounds and AI Upscaling into WebRTC and video streaming applications.

The SDK currently supports the following filters:
* [Backgrounds](#backgrounds)
* [AI Upscaling](#upscaling)


This repository has a number of examples and quickstarts for get set up with Vectorly's AI Filters library in various environments

### Installation

#### Get your token
If you haven't already, first sign up for an account on Vectorly on the website [website](https://ai-filters.vectorly.io/#/signup). Once you sign up, you should be able to login to the dashboard, where you will see an option to get your Vectorly token

<img src="https://user-images.githubusercontent.com/5678502/134422770-9c73bf82-dc78-4c18-bfc2-73cd507b5480.png" width="800" >

Keep that token handy, as it will be required to use the SDK

#### NPM

You can load our library via npm as follows

    npm install --save @vectorly-io/ai-filters

Once loaded into your project, you can then include the filter via the following command

    import * from '@vectorly-io/ai-filters';

#### CDN

You can also load our library via CDN in a script tag

    <script src="https://cdn.vectorly.io/ai-filters/v1/latest/vectorly.filters.js" type="application/javascript" />

### Available filters


#### Backgrounds

By using the Background Filter, you can implement features like Virtual Backgrounds or Background Blur, to give users additional privacy when calling from home. 

<img src="https://user-images.githubusercontent.com/5678502/134424415-71ff7fce-bf38-4062-8570-78960d5ba808.png" width="800" >

The filter takes in a `MediaStream` or `VideoTrack`, and outputs another `MediaStream` or `VideoTrack`
```javascript
    const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true});
    const filter = new BackgroundFilter(stream, {
        token: 'vectorly-token', 
        background: 'blur'
        model: 'webgl' || 'selfie', // switch between models as per client device performance; read more here: https://vectorly.io/docs/docs-page.html#item-webgl-model
    });
    const outputStream =  await filter.getOutput();
```


You can find more details in the [docs](https://vectorly.io/docs/docs-page.html#section-background), or find quickstarts/integrations in the [backgrounds](/background) section

#### Upscaling 

Vectorly has built it's own AI Upscaling filter based on a technique called Super Resolution, which uses AI to upscale and enhance images. Through Super Resolution, we can upscale and clean-up low-resolution video, making it look close to HD quality.

<img src="https://user-images.githubusercontent.com/5678502/134424900-b3bf24f0-85aa-42e8-abd2-366940150d73.png" width="600" >


For the `UpscaleFilter`, the basic API involves instantiating an `UpscaleFilter` object, and specifying a `video` element.
```javascript
    const video = document.getElementById("video");
    const upscaler = new UpscaleFilter(video, {token: 'vectorly-token'});
```

You can find more details in the [docs](https://vectorly.io/docs/docs-page.html#section-upscaling), or find quickstarts/integrations in the [upscaler](/upscaler) section




