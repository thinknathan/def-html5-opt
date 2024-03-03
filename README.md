<img src="_docs/def-html5-opt.png" alt="Tool for Defold: Def HTML5 Opt">

# HTML5 Build Optimizer for Defold

[![CI](https://github.com/thinknathan/def-html5-opt/actions/workflows/ci.yml/badge.svg)](https://github.com/thinknathan/def-html5-opt/actions/workflows/ci.yml) 
![GitHub License](https://img.shields.io/github/license/thinknathan/def-html5-opt)

Adds loading and caching optimizations to HTML5 web games exported from [Defold](https://defold.com/).

1. Minifies HTML and JS to reduce file size and speed loading
2. Adds preload meta tags to speed up first boot
3. Generates a service worker to persistently cache assets

## Install

1. Install [Nodejs](https://nodejs.org/en) or equivalent

2. Clone this project (or fork it in Github)
   `git clone https://github.com/thinknathan/def-html5-opt`

3. Install dependencies
   `npm i`
   or
   `yarn`

## Usage

1. Build your HTML5 export from Defold
2. Copy your game files into the `copy-game-here` folder (don't include the build report: exclude `report.html` and similar)
3. Run `yarn preload` or `npm run preload` to add preload meta tags
4. Run `yarn minify` or `npm run minify` to reduce the size of `index.html` and `dmloader.js`
5. Run `yarn sw` or `npm run sw` to generate the service worker

- Done! We've completed the modifications to your game in the `copy-game-here` folder
- Upload all the files inside `copy-game-here` to distribute your game

## Other potential optimizations

Since Defold's usage of `emscripten` lags behind the latest release, you may be able to gain an improvement to speed and/or file size by downloading the latest version of [wasm-opt](https://github.com/WebAssembly/binaryen) and running it on your wasm binary.
