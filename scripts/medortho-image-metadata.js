import fs from 'node:fs';
import path from 'node:path';

// Read intrinsic dimensions without recompressing or renaming any source image.
const directory = 'public/medortho/tests/images';
const metadata = {};
for (const filename of fs.readdirSync(directory).sort()) {
  if (!filename.endsWith('.webp')) continue;
  const data = fs.readFileSync(path.join(directory, filename));
  if (data.toString('ascii', 0, 4) !== 'RIFF' || data.toString('ascii', 8, 12) !== 'WEBP') throw new Error(`Invalid WebP: ${filename}`);
  let width, height;
  for (let offset = 12; offset + 8 < data.length;) {
    const kind = data.toString('ascii', offset, offset + 4);
    const size = data.readUInt32LE(offset + 4);
    const start = offset + 8;
    if (kind === 'VP8X') {
      width = data.readUIntLE(start + 4, 3) + 1;
      height = data.readUIntLE(start + 7, 3) + 1;
      break;
    }
    if (kind === 'VP8 ') {
      width = data.readUInt16LE(start + 6) & 0x3fff;
      height = data.readUInt16LE(start + 8) & 0x3fff;
      break;
    }
    if (kind === 'VP8L') {
      const bits = data.readUInt32LE(start + 1);
      width = (bits & 0x3fff) + 1;
      height = ((bits >>> 14) & 0x3fff) + 1;
      break;
    }
    offset = start + size + (size % 2);
  }
  if (!width || !height) throw new Error(`Missing dimensions: ${filename}`);
  metadata[filename] = { width, height };
}
fs.mkdirSync('src/apps/medortho/data', { recursive: true });
fs.writeFileSync('src/apps/medortho/data/imageMetadata.json', JSON.stringify(metadata, null, 2) + '\n');
console.log(`Read dimensions for ${Object.keys(metadata).length} original images.`);
