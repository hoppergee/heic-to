import buildLibheif from "./lib/libheif";

const libheif = buildLibheif()

const decodeBuffer = async (buffer) => {
  const decoder = new libheif.HeifDecoder();
  const data = decoder.decode(buffer);

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
};

onmessage = async (message) => {
	const id = message.data.id;

  try {
    const imageData = await decodeBuffer(message.data.buffer)
    postMessage({ id, imageData, error: "" });
  } catch (e) {
		postMessage({
			id,
			imageData: null,
			error: e && e.toString ? e.toString() : e,
		});
  }
};
