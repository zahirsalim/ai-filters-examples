# Vectorly Electron ARM Build

> A bare minimum project using Vectorly's Background SDK within Electron for ARM builds

## Getting Started
Simply clone down this repository, install dependencies, and get started on your application.

The use of the [yarn](https://yarnpkg.com/) package manager is **strongly** recommended, as opposed to using `npm`.

```bash
# or copy template using git clone
git clone https://github.com/electron-userland/electron-webpack-quick-start.git
cd electron-webpack-quick-start
rm -rf .git

# install dependencies
yarn
```

### Vectorly token

Add your Vectorly token into `src/renderer/index.js` in line 9

```angular2html
const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true});
const filter = new BackgroundFilter(stream, {token: 'vectorly-token'});
const outputStream =  await filter.getOutput();
```



### Development Scripts

```bash
# run application in development mode
yarn dev

# compile source code and create webpack output
yarn compile

# `yarn compile` & create build with electron-builder
yarn dist

# `yarn compile` & create unpacked build with electron-builder
yarn dist:dir
```
