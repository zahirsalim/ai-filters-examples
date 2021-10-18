// Initial welcome page. Delete the following line to remove it.

import { BackgroundFilter } from '@vectorly-io/ai-filters';

async function start(){


    const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:false});
    const filter = new BackgroundFilter(stream, {model: 'webgl', token: '<your-vectorly-token'>});

    const outputStream =  await filter.getOutput();

    const video = document.createElement('video');
    video.id = "myvideo";
    video.width = 640;
    video.height = 360;
    video.srcObject = outputStream;
    document.body.appendChild(video);

    video.play();
}

start();
