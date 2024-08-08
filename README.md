# heic-to

Convert HEIC/HEIF images to JPEG, PNG in browser using Javascript.

Inspired by [heic2any](https://github.com/alexcorvi/heic2any) and [libheif-web](https://github.com/joutvhu/libheif-web). The purpose of heic-to is to continuously follow up on releases of [libheif](https://github.com/strukturag/libheif) to be able to preview HEIC/HEIF images in browser.

Currently, heic-to is using [libheif 1.18.2](https://github.com/strukturag/libheif/releases/tag/v1.18.2) under the hood.

### Usage

#### Check whether the image is HEIC or not 

```js
import { isHeic } from "hiec-to"

const file = field.files[0]
await isHeic(file)
```

#### Convert HEIC to JPEG/PNG


```js
import { heicTo } from "hiec-to"

const file = field.files[0]

const jpeg = await heicTo({
  blob: file,
  type: "image/jpeg",
  quality: 0.5
})

const png = await heicTo({
  blob: file,
  type: "image/png",
  quality: 0.5
})
```

### Development guide

#### How to fast test your changes on local?

```bash
yarn s
```

This will open `http://127.0.0.1:8080/example/` for easy testing.

#### How to build libheif.js from [libheif](https://github.com/strukturag/libheif) on Mac

```bash
brew install cmake make pkg-config x265 libde265 libjpeg libtool
brew instll emscripten

git clone git@github.com:strukturag/libheif.git
```

Did below changes from `build-emscripten.sh`
```diff
# EXPORTED_FUNCTIONS=$($EMSDK/upstream/bin/llvm-nm $LIBHEIFA --format=just-symbols | grep "^heif_\|^de265_\|^aom_" | grep "[^:]$" | sed 's/^/_/' | paste -sd "," -)
EXPORTED_FUNCTIONS=$(/opt/homebrew/opt/llvm/bin/llvm-nm $LIBHEIFA --format=just-symbols | grep "^heif_\|^de265_\|^aom_" | grep "[^:]$" | sed 's/^/_/' | paste -sd "," -)
```

Start building
```bash
cd libheif
mkdir buildjs
cd buildjs
USE_WASM=0 ../build-emscripten.sh ..
```