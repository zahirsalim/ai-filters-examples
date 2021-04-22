# Vectorly NPM Package demo

Demo repository to show how to load Vectorly's AI upscaler through NPM

Start by installing using npm/yarn

```
yarn add @vectorly-io/ai-upscaler
```
OR

```
npm install --save @vectorly-io/ai-upscaler
```


Get a token from https://upscaler.vectorly.io to use the library

Follow the docs at https://vectorly.io/docs

## Test Vectorly Videojs plugin

`yarn videojs` will compile and output the bundle to `demo/` folder

You can run live dev server using `yarn demo:videojs`


## Test Vectorly Upscaler Core

After running the

Compile Upscaler Core
```
yarn core
```

or

Run Upscaler Core on localhost

```
yarn demo:core
```
Then visit "http://localhost:9000/?token='your-token-id'&img_url='your-img-path'
