const imagesContainer = document.querySelector(".images")
const messageLabel = document.querySelector("label")
const field = document.querySelector("input")

field.addEventListener('change', async (event) => {

  let imageDom = document.querySelector("img")
  if (!imageDom) {
    imageDom = document.createElement('img')
    imagesContainer.appendChild(imageDom)
  }
  imageDom.src = ''
  imageDom.alt = "Loading..."
  messageLabel.textContent = "Loading..."

  const image = field.files[0]
  // Create a web worker
  const worker = new Worker('worker.js', { type: "module" })

  worker.postMessage({ file: image })

  worker.onmessage = (e) => {
    const { isHeic, result, type } = e.data
    if (isHeic) {
      messageLabel.textContent = "It's a HEIC image"
      imageDom.src = URL.createObjectURL(result)
    } else {
      messageLabel.textContent = "It's not a HEIC image"
      imageDom.src = URL.createObjectURL(image)
    }
  }

  worker.onerror = (err) => {
    messageLabel.textContent = "Error processing image"
    imageDom.alt = "Error"
  }

})