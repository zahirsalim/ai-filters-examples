// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  CanvasVideoFrameBuffer,
  VideoFrameBuffer,
  VideoFrameProcessor,
} from 'amazon-chime-sdk-js';

const BackgroundFilter = require('@vectorly-io/ai-filters/dist/vectorly.BackgroundFilter')

const vectorly = {BackgroundFilter: BackgroundFilter}

/**
 * [[CircularCut]] is an implementation of {@link VideoFrameProcessor} for demonstration purpose.
 * It updates the first {@link VideoFrameBuffer} from the input array and clip the whole frame to a circle.
 */
export default class VectorlyBackgroundFilter implements VideoFrameProcessor {
  private targetCanvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;
  private canvasVideoFrameBuffer = new CanvasVideoFrameBuffer(this.targetCanvas);
  private sourceWidth: number = 0;
  private sourceHeight: number = 0;
  private filterReady: boolean = false;
  private outputStream: MediaStream = null;
  private bgFilter: any = null;

  constructor() {}

  destroy(): Promise<void> {
    this.targetCanvas = null;
    this.canvasVideoFrameBuffer.destroy();
    return;
  }

  async process(buffers: VideoFrameBuffer[]): Promise<VideoFrameBuffer[]> {
    // assuming one video stream
    const canvas = buffers[0].asCanvasElement();
    const inputStream = canvas.captureStream()

    const frameWidth = canvas.width;
    const frameHeight = canvas.height;

    if (frameWidth === 0 || frameHeight === 0) {
      return Promise.resolve(buffers);
    }

    if(!this.bgFilter){

      try{

        this.bgFilter = new vectorly.BackgroundFilter(inputStream, {
          token: "4b6789ac-2241-4359-98fb-0364f2fb3919",
          // canvas: this.targetCanvas,
        });

        this.outputStream = await this.bgFilter.getOutput()
        console.log('Output stream', this.outputStream)

        this.filterReady = true
      } catch (e){
        console.log("Error");
        console.log(e);
      }
    }


    if(this.filterReady){
      // this.bgFilter.render()
    }


    if (this.sourceWidth !== frameWidth || this.sourceHeight !== frameHeight) {
      this.sourceWidth = frameWidth;
      this.sourceHeight = frameHeight;

      // update target canvas size to match the frame size
      this.targetCanvas.width = this.sourceWidth;
      this.targetCanvas.height = this.sourceHeight;
   }



    // this.targetCanvasCtx.drawImage(canvas, 0, 0);

    buffers[0] = this.canvasVideoFrameBuffer;
    return Promise.resolve(buffers);
  }
}
