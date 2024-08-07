
const isHeic = async (file) => {
  const buffer = await file.arrayBuffer()
  const slicedBuffer = buffer.slice(8, 12)
  const brandMajor = new TextDecoder('utf-8')
    .decode(slicedBuffer)
    .replace('\0', ' ')
    .trim();

  switch (brandMajor) {
    case 'mif1':
      return true; // {ext: 'heic', mime: 'image/heif'};
    case 'msf1':
      return true; // {ext: 'heic', mime: 'image/heif-sequence'};
    case 'heic':
    case 'heix':
      return true; // {ext: 'heic', mime: 'image/heic'};
    case 'hevc':
    case 'hevx':
      return true; // {ext: 'heic', mime: 'image/heic-sequence'};
  }

  return false;
};

export {
  heicTo
}