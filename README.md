# heic-to

Convert HEIC/HEIF images to JPEG, PNG in browser using Javascript.

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