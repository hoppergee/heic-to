import {heicTo, isHeic} from '../dist/heic-to.js'

const fileInput = document.getElementById("fileInput")
const statusMessage = document.getElementById("statusMessage")
const resultContainer = document.getElementById("resultContainer")
const originalImage = document.getElementById("originalImage")
const convertedImage = document.getElementById("convertedImage")

function showStatus(message, type = 'info') {
  statusMessage.textContent = message
  statusMessage.className = `status-message ${type}`
  statusMessage.style.display = 'block'
}

function hideStatus() {
  statusMessage.style.display = 'none'
}

function showResult() {
  resultContainer.style.display = 'grid'
}

function hideResult() {
  resultContainer.style.display = 'none'
}

function createImageElement(src, alt = '') {
  const img = document.createElement('img')
  img.src = src
  img.alt = alt
  img.style.maxWidth = '100%'
  img.style.maxHeight = '300px'
  img.style.objectFit = 'contain'
  return img
}

function clearContainer(container) {
  container.innerHTML = '<p style="color: #666;">Processing...</p>'
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0]
  
  if (!file) {
    hideStatus()
    hideResult()
    return
  }

  try {
    // Reset UI
    hideResult()
    clearContainer(originalImage)
    clearContainer(convertedImage)
    
    showStatus('🔍 Analyzing file...', 'loading')

    // Check if it's a HEIC file
    const isHeicFile = await isHeic(file)
    
    if (isHeicFile) {
      showStatus('✅ HEIC/HEIF file detected! Converting to JPEG...', 'loading')
      
      // Show original file info
      originalImage.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 10px;">📷</div>
          <div style="font-weight: bold; margin-bottom: 5px;">${file.name}</div>
          <div style="color: #666; font-size: 0.9rem;">
            HEIC/HEIF • ${formatFileSize(file.size)}
          </div>
        </div>
      `
      
      showResult()
      
      // Convert to JPEG
      const startTime = Date.now()
      const convertedBlob = await heicTo({
        blob: file, 
        type: 'image/jpeg', 
        quality: 0.8
      })
      const conversionTime = Date.now() - startTime
      
      // Show converted image
      const convertedUrl = URL.createObjectURL(convertedBlob)
      const convertedImg = createImageElement(convertedUrl, 'Converted JPEG image')
      
      convertedImage.innerHTML = ''
      convertedImage.appendChild(convertedImg)
      
      // Add download button and info
      const infoDiv = document.createElement('div')
      infoDiv.style.marginTop = '15px'
      infoDiv.style.textAlign = 'center'
      infoDiv.innerHTML = `
        <div style="color: #666; font-size: 0.9rem; margin-bottom: 10px;">
          JPEG • ${formatFileSize(convertedBlob.size)} • ${conversionTime}ms
        </div>
        <button onclick="downloadImage('${convertedUrl}', '${file.name.replace(/\.[^/.]+$/, '')}.jpg')" 
                style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">
          📥 Download JPEG
        </button>
      `
      convertedImage.appendChild(infoDiv)
      
      const compressionRatio = ((file.size - convertedBlob.size) / file.size * 100).toFixed(1)
      const sizeChange = convertedBlob.size > file.size ? 'larger' : 'smaller'
      
      showStatus(
        `🎉 Successfully converted! File is ${Math.abs(compressionRatio)}% ${sizeChange} (${conversionTime}ms)`, 
        'success'
      )
      
    } else {
      // Not a HEIC file - show as regular image if possible
      showStatus('ℹ️ This is not a HEIC/HEIF file. Displaying as regular image.', 'info')
      
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file)
        const img = createImageElement(imageUrl, 'Original image')
        
        originalImage.innerHTML = ''
        originalImage.appendChild(img)
        
        const infoDiv = document.createElement('div')
        infoDiv.style.marginTop = '15px'
        infoDiv.style.textAlign = 'center'
        infoDiv.innerHTML = `
          <div style="font-weight: bold; margin-bottom: 5px;">${file.name}</div>
          <div style="color: #666; font-size: 0.9rem;">
            ${file.type} • ${formatFileSize(file.size)}
          </div>
        `
        originalImage.appendChild(infoDiv)
        
        convertedImage.innerHTML = `
          <div style="padding: 20px; text-align: center; color: #666;">
            <div style="font-size: 2rem; margin-bottom: 10px;">ℹ️</div>
            <div>No conversion needed</div>
            <div style="font-size: 0.9rem; margin-top: 5px;">
              This file is already in a web-compatible format
            </div>
          </div>
        `
        
        showResult()
      } else {
        originalImage.innerHTML = `
          <div style="padding: 20px; text-align: center; color: #666;">
            <div style="font-size: 2rem; margin-bottom: 10px;">❌</div>
            <div>Unsupported file type</div>
            <div style="font-size: 0.9rem; margin-top: 5px;">
              Please select a HEIC/HEIF or image file
            </div>
          </div>
        `
        showResult()
      }
    }
    
  } catch (error) {
    console.error('Conversion error:', error)
    showStatus(`❌ Error: ${error.message || 'Failed to process file'}`, 'error')
    hideResult()
  }
})

// Global function for download button
window.downloadImage = function(url, filename) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

// Clean up object URLs when page unloads
window.addEventListener('beforeunload', () => {
  const images = document.querySelectorAll('img[src^="blob:"]')
  images.forEach(img => URL.revokeObjectURL(img.src))
})