<img src="https://user-images.githubusercontent.com/5678502/134426534-effa11ab-2048-4d1f-85b0-d3355bce04f5.png" height="30" >

## Background Filter SDK

By using the Background Filter, you can implement features like Virtual Backgrounds or Background Blur, to give users additional privacy when calling from home. 

<img src="https://user-images.githubusercontent.com/5678502/134424415-71ff7fce-bf38-4062-8570-78960d5ba808.png" width="800" >



#### Basic Usage
The filter takes in a `MediaStream` or `VideoTrack`, and outputs another `MediaStream` or `VideoTrack`

```javascript
    const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true});
    const filter = new BackgroundFilter(stream, {
        token: 'vectorly-token', 
        background: 'blur',
        model: 'webgl' || 'selfie' // switch between models as per client device performance; read more here: https://vectorly.io/docs/docs-page.html#item-webgl-model
    });
    const outputStream =  await filter.getOutput();
```
#### Quickstarts

To just get started with a basic example, you can take a look at the following quickstarts:
* [NPM quickstart](npm-load-filters)
* [CDN quickstart](virtual-background)
* [Typescript quckstart](livekit-demo)
* [Vanilla WebRTC quickstart](webrtc-demo)



#### Integrations

We also have quickstarts/integrations with popular Video APIs

* [Agora](agora-demo)
* [Daily.co](daily-co-demo)
* [Twilio](twilio-demo)
* [Vonage](vonage-demo)


#### Other resources

To speed up deployment, we've included a few other resources, including
* [Sample UI components](ui-quickstart/html)
* [Sample background images](https://vectorly.io/docs/docs-page.html#item-background-images)
