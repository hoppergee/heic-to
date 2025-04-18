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
  if (await HeicTo.isHeic(image)) {
    messageLabel.textContent = "It's a HEIC image"
    const heifImage = await HeicTo({blob: image, type: 'image/jpeg', quality: 0.5})
    imageDom.src = URL.createObjectURL(heifImage)
  } else {
    messageLabel.textContent = "It's not a HEIC image"
    imageDom.src = URL.createObjectURL(image)
  }

})