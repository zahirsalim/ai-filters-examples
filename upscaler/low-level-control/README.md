# Low Level Control demo

The Vectorly-core library was built for use cases where lower level control of upscaling is needed, such as instances where frames are being decoded using a custom decoder or the WebCodecs API.


## Requirements

This example uses the [WebCodecs API](https://github.com/w3c/webcodecs), as it is a [W3C standard](https://web.dev/webcodecs/) designed to provide lower level control for video processing tasks

It is still experimental and needs to be enabled, make sure you are using the latest version of Chrome.

To try it on your machine, either
* enable `chrome://flags/#enable-experimental-web-platform-features`, or
* pass `--enable-blink-features=WebCodecs` flag via the command line.

To try it with real users, [sign up for the origin trial here](
https://developers.chrome.com/origintrials/#/register_trial/-7811493553674125311).

You can read more about the spec [here](https://github.com/w3c/webcodecs/blob/main/explainer.md)


## API

With the low level upscaling API, you have control over

* The Input source
* The destination
* When rendering happens

**Setting a destination**

Each Upscaler object is tied to an individual `canvas` element, and renders to that `canvas` element.

You specify the `canvas` element you want to render the upscales to via the upscaler constructor

```
    const upscaler = new vectorlyUpscaler.core({
        token:  "your-token",
        canvas: document.getElementById('your-canvas-element'),
        w: 640,
        h: 360
    });
```


If you want to upscale multiple streams to different canvases, you will need to define a seperate upscaler for each `canvas` element.

**Setting an input**

At any time, you can set the input of the upscaler via the `upscaler.setInput()` method

```
 upscaler.setInput(source); // Sets input element
```

Accepted sources include
* `HTMLImageElement` 
* `HTMLCanvasElement` 
* `HTMLVideoElement`
* `ImageData`
* `ImageBitmap`
* Anything else that the [texImage2d](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D) function accepts

**Rendering**

Finally, you can render using

```
upscaler.render();
```

Which will run the AI upscaling process on the canvas

**Styling & Scaling**

You need to set the input width and height of your input image or video streaming using the `w` and `h` properties in the constructor.

Based on whether you are using  a 2X network, or 3X network, it will set the canvas.width and canvas.height property to 2x or 3x the specified `w` and `h`.

If you want your canvas to be displayed at anything other than `2*w`by `2*h` on the screen, you should use CSS styling.

```
canas.style.width = desiredWidth + "px";
canas.style.height = desiredheight + "px";
```

The browser will still upscale the image from `wxh` to  `2*w x 2*h`, but will then use CSS styling & scaling (bicubic scaling) to scale the final output to the  height/width you specify via CSS.







