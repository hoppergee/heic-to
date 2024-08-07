# heic-to

Convert HEIC/HEIF images to JPEG, PNG in browser using Javascript.

Inspired by [heic2any](https://github.com/alexcorvi/heic2any) and [libheif-web](https://github.com/joutvhu/libheif-web). The purpose of heic-to is to continuously follow up on releases of [libheif](https://github.com/strukturag/libheif)

### Development guide

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