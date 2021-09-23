# Vectorly WebSDK <> Dolby Interactivity filters Integration

This is the sample app from [Dolby / Voxeet Getting started demo](https://github.com/voxeet/voxeet-sdk-browser-gettingstarted)


### Pre-requisites

#### Dolby Credientials

Make sure you have an account on [Dolby.io](https://dolby.io/) and get your consumer key and secret.

See the [Getting Started](https://docs.dolby.io/interactivity/docs/create-a-basic-audio-conference-application#step-2-initialize-the-sdk-with-your-dolbyio-credentials) article for more info on authentication

#### Vectorly credentials

If you haven't already, first sign up for an account on Vectorly on the website [website](https://ai-filters.vectorly.io/#/signup). Once you sign up, you should be able to login to the dashboard, where you will see an option to get your Vectorly token

<img src="https://user-images.githubusercontent.com/5678502/134422770-9c73bf82-dc78-4c18-bfc2-73cd507b5480.png" width="800" >

Keep that token handy, as it will be required to use the SDK


## Running

See [this page](https://docs.dolby.io/interactivity/docs/create-a-basic-audio-conference-application#step-6-run-your-application)
for instructions on how to run the app.

In either case, to enable the Vectorly SDK, you will need to either inlude the Vectorly token in line 76 of `src/scripts/client.js` or you can provide it as a URL parameter when loading index.html

     localhost:..../index.html?token=...

