import {heicTo, isHeic} from '../../dist/heic-to.js'

const imagesContainer = document.querySelector(".images")
const messageLabel = document.querySelector("label")
const field = document.querySelector("input")

field.addEventListener('change', async (event) => {

  let canvasDom = document.querySelector("canvas")
  if (!canvasDom) {
    canvasDom = document.createElement('canvas')
    imagesContainer.appendChild(canvasDom)
  }

  const image = field.files[0]
  if (await isHeic(image)) {
    messageLabel.textContent = "It's a HEIC image"
    const bitmapImage = await heicTo({blob: image, type: 'bitmap', options: {imageOrientation: 'flipY'}})
    const ctx = canvasDom.getContext('2d')
    canvasDom.width = bitmapImage.width
    canvasDom.height = bitmapImage.height
    ctx.drawImage(bitmapImage, 0, 0)
  } else {
    messageLabel.textContent = "It's not a HEIC image"
    canvasDom.remove()
  }

})