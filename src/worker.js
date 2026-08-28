import buildLibheif from LIB_HEIF_PATH;

const libheif = buildLibheif()

const displayImage = async (image) => {
  const width = image.get_width();
  const height = image.get_height();

  const whiteImage = new ImageData(width, height)
  for (let i = 0; i < width * height; i++) {
    whiteImage.data[i * 4 + 3] = 255;
  }

  return new Promise((resolve, reject) => {
    image.display(whiteImage, (displayData) => {
      if (!displayData) {
        return reject(new Error('HEIF processing error'));
      }

      resolve(displayData);
    });
  });
};

// Always resolves to a list. Without `multiple` it holds the first image only, which keeps the
// behaviour of every existing caller unchanged.
const decodeBuffer = async (buffer, multiple) => {
  let decoder, data;
  try {
    decoder = new libheif.HeifDecoder();
    data = decoder.decode(buffer);

    if (!data.length) {
      throw new Error('HEIF image not found');
    }

    const images = multiple ? data : [data[0]];

    // Decoded one after another instead of in parallel, so libheif never has more than one decode
    // in flight. The list itself does hold every decoded image until it is posted back.
    const imageDataList = [];
    for (let i = 0; i < images.length; i++) {
      imageDataList.push(await displayImage(images[i]));
    }

    return imageDataList;
  } finally {
    if (data && data.length) {
      for (let i = 0; i < data.length; i++) {
        data[i].free();
      }
    }
    if (decoder && decoder.decoder) {
      libheif.heif_context_free(decoder.decoder);
    }
  }
};

onmessage = async (message) => {
	const id = message.data.id;

  try {
    const imageDataList = await decodeBuffer(message.data.buffer, message.data.multiple);
    postMessage({ id, imageDataList, error: "" });
  } catch (e) {
		postMessage({
			id,
			imageDataList: null,
			error: e && e.toString ? e.toString() : e,
		});
  }
};
