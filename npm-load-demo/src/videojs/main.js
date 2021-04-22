import videojs from 'video.js'
import 'video.js/dist/video-js.min.css'
import vectorlyUpscaler from '@vectorly-io/ai-upscaler/videojs';
vectorlyUpscaler.register(videojs)

const url = "https://files.vectorly.io/demo/high-quality-240p/jellyfish-240p.mp4";


document.addEventListener("DOMContentLoaded", () => {
  const player = videojs('my-video', {sources: [{
      src: url,
      type: 'video/mp4'
  }], width: 1280, height: 720});


  const upscaler = player.vectorlyPlugin({
    token: (new URLSearchParams(window.location.search)).get("token") // Pass in token from upscaler.vectorly.io
  });
})
