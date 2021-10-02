# Vectorly Background Filter Demo for Twilio Video (Web)

## Overview

This is a demo of how to use Vectorly's Background SDK with Twilio Video's web API. The repository is built on top of the Twilio [javascript quickstart](https://github.com/twilio/video-quickstart-js/)

## Setup Requirements

Before we begin, we need to collect all the config values we need to run the application:

- Twilio Account SID: Your primary Twilio account identifier - find this [in the console here](https://www.twilio.com/console).
- Twilio API Key SID: Used to authenticate - [generate one here](https://www.twilio.com/console/runtime/api-keys).
- Twilio API Key Secret: Used to authenticate - [just like the above, you'll get one here](https://www.twilio.com/console/runtime/api-keys).
- Vectorly token: Used to authenticate with [Vectorly](http://upscaler.vectorly.io/)


## Setting Up The Application

Create a configuration file for your application:

```bash
cp .env.template .env
```

Edit `.env` with the configuration parameters we gathered from above.

Next, we need to install our dependencies from npm:

```bash
npm install
```

Finally, insert your vectorly token into line 235 of quickstart/src/joinroom.js

```javascript
  const filter = new BackgroundFilter(inputStream, {
    token: 'your-vectorly-token', 
    background: 'blur',
    model: 'webgl' || 'selfie' // switch between models as per client device performance; read more here: https://vectorly.io/docs/docs-page.html#item-webgl-model
  });
```

## Running The Application

Now we should be all set! Run the application:

```bash
npm start
```

Your application should now be running at [http://localhost:3000](http://localhost:3000). You will
be prompted to test and choose your microphone and camera. On desktop browsers, your choices will
be saved. _On mobile browsers, you will be asked to test and choose your microphone and camera every
time you load the application in order to make sure they are not reserved by another application_.

After choosing your input devices, you will be prompted to enter your Room name and user name, following
which you will join the Room. Now, all you have to do is open another tab and join the same Room in order
to see and hear yourself on both tabs!

[joinroom.js](quickstart/src/joinroom.js) demonstrates how to use the SDK APIs to build a multi-party
video sesssion. You can start building your own application by incorporating this code into your own
application, and build your user interface around it.

## Running On Multiple Devices

You can use [ngrok](https://ngrok.com/) to try your application
on different devices by creating a secure tunnel to your application server:

```bash
ngrok http 3000
```

You will get a URL of the form `https://a1b2c3d4.ngrok.io` which can be loaded on a browser from a device
different than the one where your application server is running.

## Examples

The project contains some use-case examples for the Twilio Video JS SDK. After running the application
by following the instructions above, go to [http://localhost:3000/examples](http://localhost:3000/examples)
to try them out.
