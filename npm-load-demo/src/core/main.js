import  vectorlyUpscaler from '@vectorly-io/ai-upscaler/core';

// create a canvas element
const webglcanvas = document.createElement('canvas');
webglcanvas.id = "canvas-webgl"
document.body.appendChild(webglcanvas);

const image_tag = new Image({}) //document.createElement('image');
image_tag.id = "image"
image_tag.setAttribute('crossorigin', 'anonymous');
image_tag.setAttribute('src', new URLSearchParams(window.location.search).get("img_url"));
document.body.appendChild(image_tag);

image_tag.onload = async function(){
    // Instantiate the upscaler configs
    const upscaler_init_config = {w: image_tag.naturalWidth,
                                  h: image_tag.naturalHeight,
                                  renderSize: {w: image_tag.naturalWidth*2, h: image_tag.naturalHeight*2},
                                  canvas: webglcanvas,
                                  float_type: "float16",
                                  use_webgl1: "false",
                                  networkParams :
                                  {name: 'residual_5k_2x',
                                   tag: 'general',
                                   version: '0',
                                  },
                                  token: (new URLSearchParams(window.location.search)).get("token")
                                 }
    // Instantiate the upscaler object
    const upscaler = new vectorlyUpscaler.core(upscaler_init_config);

    // render the image
    requestAnimationFrame( () => {
     // Set the input image
     upscaler.setInput(image_tag)
     // Render the image
     upscaler.render();
    });
}
