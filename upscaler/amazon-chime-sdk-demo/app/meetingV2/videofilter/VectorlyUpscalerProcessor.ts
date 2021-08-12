// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  CanvasVideoFrameBuffer,
  VideoFrameBuffer,
  VideoFrameProcessor,
} from 'amazon-chime-sdk-js';

declare var vectorlyUpscaler: any;

/**
 * [[CircularCut]] is an implementation of {@link VideoFrameProcessor} for demonstration purpose.
 * It updates the first {@link VideoFrameBuffer} from the input array and clip the whole frame to a circle.
 */
export default class VectorlyUpscalerProcessor implements VideoFrameProcessor {
  private targetCanvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;
  private canvasVideoFrameBuffer = new CanvasVideoFrameBuffer(this.targetCanvas);
  private sourceWidth: number = 0;
  private sourceHeight: number = 0;
  private upscalerReady: boolean = false;
  private upscaler: any = null;

  constructor() {}

  destroy(): Promise<void> {
    this.targetCanvas = null;
    this.canvasVideoFrameBuffer.destroy();
    return;
  }

  process(buffers: VideoFrameBuffer[]): Promise<VideoFrameBuffer[]> {
    // assuming one video stream
    const canvas = buffers[0].asCanvasElement();

    const frameWidth = canvas.width;
    const frameHeight = canvas.height;

    if (frameWidth === 0 || frameHeight === 0) {
      return Promise.resolve(buffers);
    }

    if(!this.upscaler){

      try{

        this.upscaler = new vectorlyUpscaler.core();

        const config = {
          w: frameWidth,
          h: frameHeight,
          renderSize: {w: frameWidth*3, h: frameHeight*3},
          canvas: this.targetCanvas,
          networkParams: {name: 'residual_5k_3x', tag: 'general', version: '0'},
          token: "<your-token>"
        }

        this.upscaler.load(config);

        this.upscaler.on('load', function(){
          this.upscalerReady = true;
        }.bind(this));

      } catch (e){
        console.log("Error");
        console.log(e);


      }


    }


    if(this.upscalerReady){
      this.upscaler.setInput(canvas) // Sets input element
      this.upscaler.render() // Renders to canvas
    }


    if (this.sourceWidth !== frameWidth || this.sourceHeight !== frameHeight) {
      this.sourceWidth = frameWidth;
      this.sourceHeight = frameHeight;

      // update target canvas size to match the frame size
      this.targetCanvas.width = this.sourceWidth;
      this.targetCanvas.height = this.sourceHeight;
   }



 //   this.targetCanvasCtx.drawImage(canvas, 0, 0);

    buffers[0] = this.canvasVideoFrameBuffer;
    return Promise.resolve(buffers);
  }
}
