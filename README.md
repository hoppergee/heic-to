# heic-to

Convert HEIC/HEIF images to JPEG, PNG in browser using Javascript.

Inspired by [heic2any](https://github.com/alexcorvi/heic2any) and [libheif-web](https://github.com/joutvhu/libheif-web). The purpose of heic-to is to continuously follow up on releases of [libheif](https://github.com/strukturag/libheif) to be able to preview HEIC/HEIF images in browser.

Currently, heic-to is using [libheif 1.19.8](https://github.com/strukturag/libheif/releases/tag/v1.19.8) under the hood. 

| Release  | libheif  |
| -------- | -------- |
| 1.1.14   | 1.19.8   | 
| 1.1.13   | 1.19.8   | 
| 1.1.12   | 1.19.7   | 
| 1.1.11   | 1.19.7   | 
| 1.1.10   | 1.19.7   | 
| 1.1.9    | 1.19.7   | 
| 1.1.8    | 1.19.7   | 
| 1.1.7    | 1.19.6   | 
| 1.1.6    | 1.19.5   | 
| 1.1.5    | 1.19.5   | 
| 1.1.4    | 1.19.4   | 
| 1.1.3    | 1.19.3   | 
| 1.1.2    | 1.19.2   | 
| 1.1.1    | 1.19.1   | 
| 1.1.0    | 1.19.0   | 
| 1.0.3    | 1.18.2   |
| 1.0.2    | 1.18.2   |
| 1.0.1    | 1.18.2   |
| 1.0.0    | 1.18.1   |

### Usage

#### Check whether the image is HEIC or not 

```js
import { isHeic } from "heic-to"

const file = field.files[0]
await isHeic(file)
```

#### Convert HEIC to JPEG/PNG


```js
import { heicTo } from "heic-to"

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

#### Cotent Security Policy

When meets CSP issue like this:

```
Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of script in the following Content Security Policy directive
```

Fix it by using `csp/heic-to` 

```diff
- import { heicTo } from "heic-to"
+ import { heicTo } from "heic-to/csp"
```

#### Access global variable with IIFE build

If you would like to access heic-to with pure JavaScript without package builder like with CDN.

```html
<script src="https://cdn.jsdelivr.net/npm/heic-to@1.1.12/dist/iife/heic-to.js"></script>
<script>
  /*...*/
  if (await HeicTo.isHeic(file)) {
    const jpeg = await HeicTo({
      blob: file,
      type: "image/jpeg",
      quality: 0.5
    })
    /*...*/
  }
  /*...*/
</script>
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
brew install emscripten

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

# Or build without unsafe-eval
USE_UNSAFE_EVAL=0 USE_WASM=0 ../build-emscripten.sh ..
```
