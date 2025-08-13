import {heicTo, isHeic} from '../../dist/next/heic-to.js'

onmessage = async (message) => {
  console.log("Worker received message:", message);
  const image = message.data.file;

  if (await isHeic(image)) {
    const heifImage = await heicTo({blob: image, type: 'image/jpeg', quality: 0.5})
    postMessage({
      type: "result",
      isHeic: true,
      result: heifImage
    });
  } else {
    postMessage({
      type: "result",
      isHeic: false,
      result: null
    });
  }
};
