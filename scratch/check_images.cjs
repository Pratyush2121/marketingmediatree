const fs = require('fs');
const path = require('path');

function getPngDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  // PNG signature is 8 bytes, IHDR chunk starts at byte 12. Width is at byte 16, height at 20.
  const width = buffer.readInt32BE(16);
  const height = buffer.readInt32BE(20);
  return { width, height };
}

try {
  const img1Path = path.join(__dirname, '../src/assets/image1.png');
  const img2Path = path.join(__dirname, '../src/assets/image2.png');
  console.log('image1:', getPngDimensions(img1Path));
  console.log('image2:', getPngDimensions(img2Path));
} catch (e) {
  console.error('Error:', e.message);
}
