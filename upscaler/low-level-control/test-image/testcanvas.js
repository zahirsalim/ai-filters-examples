window.onload = () => {


  const upscaler = (new vectorly.UpscaleCoreFilter())
  .on('load', function () {
      console.log(";;;Upscaler initialized"); })
  .on('error', function () {
      console.log(";;;Failed to initialize"); })
  window.upscaler = upscaler

  const image = new Image({});
  image.setAttribute('crossorigin', 'anonymous');
  image.src = "https://vectorly-demos.s3-us-west-1.amazonaws.com/test-demos/scenery.jpg";

  let loadP;

  image.onload = async () => {
    const config = {h: image.naturalHeight, w: image.naturalWidth, id: "canvas-2d"}
    const canvas = upscaler.createCanvas(config)
    // document.body.appendChild(canvas)

    const inputSize = {h: config.h, w: config.w}
    const renderSize = {h: 720, w: 1280}
    const upsConfig = {
      w: inputSize.w,
      h: inputSize.h,
      renderSize: renderSize,
      canvas: canvas,
      networkParams: {name: 'residual_3k_3x', tag: 'general', version: '2.1'},
      token: '81548a00-b412-49bb-82cb-f5ddce588dde'
    }
    loadP = upscaler.load(upsConfig)

    console.log('Waiting for loadP', loadP)
    await loadP
    console.log('Awaited loadP', loadP)
    renderFrame()
  }



  renderFrame = async () => {
    console.log('In renderFrame')
    // await loadP
    await upscaler.setInput(image)
    await upscaler.render()
  }

}
