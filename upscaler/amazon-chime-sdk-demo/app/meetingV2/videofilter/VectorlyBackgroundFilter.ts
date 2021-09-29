// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  CanvasVideoFrameBuffer,
  VideoFrameBuffer,
  VideoFrameProcessor,
} from 'amazon-chime-sdk-js';

const BackgroundFilterCore = require('@vectorly-io/ai-filters/dist/vectorly.BackgroundFilterCore')

const vectorly = {BackgroundFilterCore: BackgroundFilterCore}

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

    const frameWidth = canvas.width;
    const frameHeight = canvas.height;

    if (frameWidth === 0 || frameHeight === 0) {
      return Promise.resolve(buffers);
    }

    if(!this.bgFilter){

      try{

        this.bgFilter = new vectorly.BackgroundFilterCore();

        const config = {
          inputSize: {w: frameWidth, h: frameHeight},
          token: "<your-token>",
          canvas: this.targetCanvas,
          model: 'selfie_v2',
        }

        this.bgFilter.load(config).then(() => {
          this.filterReady = true
        })

      } catch (e){
        console.log("Error");
        console.log(e);
      }
    }


    if(this.filterReady){
      this.bgFilter.setInput(canvas) // Sets input element
      this.bgFilter.render() // Renders to canvas
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
