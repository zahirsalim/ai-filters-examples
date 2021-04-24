# OpenSeaDragon Vectorly Integration

You can integrate Vectorly into OpenSeaDragon to upscale deep-zoom images on the browser.

## Requirements

You'll need to load OpenSeaDragon

```
    <script src="https://cdnjs.cloudflare.com/ajax/libs/openseadragon/2.4.2/openseadragon.min.js"></script>
```

As well as the Vectorly Core Library, which provides low level controls Upscaling images and canvas elements

    <script src="https://cdn.vectorly.io/upscaler/v2/latest/vectorly-core.js"></script>

**Get your Vectorly Token**

Sign up for an account at `https://upscaler.vectorly.io`, and go to preferences->"Model Token" to get your upscaler token



## Viewing

Just open index.html in your browser. Make sure to edit index.html to add your Model token

        const upscaler = new vectorlyUpscaler.core({
            token: "your-token",
            w: width,
            h: height,
            canvas: document.getElementById("upscaledCanvas"),
        });



