import buildLibheif from LIB_HEIF_PATH;

const libheif = buildLibheif()

const decodeBuffer = async (buffer) => {
  let decoder, data;
  try {
    decoder = new libheif.HeifDecoder();
    data = decoder.decode(buffer);

    if (!data.length) {
      throw new Error('HEIF image not found');
    }

    const image = data[0]

    const width = image.get_width();
    const height = image.get_height();

    const whiteImage = new ImageData(width, height)
    for (let i = 0; i < width * height; i++) {
      whiteImage.data[i * 4 + 3] = 255;
    }

    const imageData = await new Promise((resolve, reject) => {
      image.display(whiteImage, (displayData) => {
        if (!displayData) {
          return reject(new Error('HEIF processing error'));
        }

        resolve(displayData);
      });
    });

    return imageData;
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
    const imageData = await decodeBuffer(message.data.buffer);
    postMessage({ id, imageData, error: "" });
  } catch (e) {
		postMessage({
			id,
			imageData: null,
			error: e && e.toString ? e.toString() : e,
		});
  }
};
