import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import {
  buildQrPayload,
  buildWifiPayload,
  contrastRatio,
  createQrMatrix,
  drawQrCanvas,
  renderQrSvg,
  validateContrast,
} from '../web-assets/public-tools/qr-code.mjs';
import {
  MAX_DECODE_PIXELS,
  MAX_FILE_BYTES,
  MAX_FILES,
  calculateFit,
  createZip,
  composeImage,
  getOutputDimensions,
  outputName,
  processImageFiles,
  readJpegOrientation,
  validateImageBatch,
  validateImageFile,
} from '../web-assets/public-tools/social-image.mjs';
import { unzipSync } from '../web-assets/public-tools/vendor/fflate-0.8.2.mjs';

const url = 'https://example.com/path?q=%E4%B8%AD%E6%96%87&emoji=😀#片段';
const textPayload = buildQrPayload({ type: 'text', text: '中文 😀 / 你好' });
const wifiPayload = buildWifiPayload({ ssid: '店家;Wi-Fi', password: 'p\\;a:ss,"word', security: 'WPA', hidden: true });
assert.equal(buildQrPayload({ type: 'url', url }), url);
assert.equal(textPayload, '中文 😀 / 你好');
assert.equal(wifiPayload, 'WIFI:T:WPA;S:店家\\;Wi-Fi;P:p\\\\\\;a\\:ss\\,\\"word;H:true;;');

const matrix = createQrMatrix(url, 'H');
assert.ok(matrix.size >= 21);
assert.equal(matrix.modules.length, matrix.size);
assert.equal(matrix.modules.every(row => row.length === matrix.size), true);
const svg = renderQrSvg(matrix, { size: 640, quietZone: 4, darkColor: '#111827', lightColor: '#ffffff' });
assert.match(svg, /^<svg\b/);
assert.match(svg, /viewBox="0 0 /);
assert.match(svg, /#111827/);
assert.match(svg, /#ffffff/);
assert.ok(contrastRatio('#111827', '#ffffff') > 10);
assert.equal(validateContrast('#ffffff', '#111827').ok, false);

assert.deepEqual(getOutputDimensions('portrait'), { width: 1080, height: 1350 });
assert.throws(() => getOutputDimensions('custom', 5000, 5000), /24 MP/);
const contain = calculateFit(1600, 900, 1080, 1080, 'contain');
const cover = calculateFit(1600, 900, 1080, 1080, 'cover');
assert.equal(contain.sx, 0);
assert.equal(contain.sWidth, 1600);
assert.equal(cover.dWidth, 1080);
assert.equal(cover.sHeight, 900);
assert.equal(cover.sWidth, 900);
assert.equal(validateImageFile({ name: 'x.png', type: 'image/png', size: 20 }).ok, true);
assert.equal(validateImageFile({ name: 'x.gif', type: 'image/gif', size: 20 }).ok, false);
assert.equal(validateImageFile({ name: 'huge.jpg', type: 'image/jpeg', size: MAX_FILE_BYTES + 1 }).ok, false);
assert.equal(validateImageBatch(Array.from({ length: MAX_FILES + 1 }, () => ({ name: 'x.png' }))).ok, false);
assert.match(outputName('我的照片.jpeg', 'image/webp'), /\.webp$/);
assert.equal(MAX_DECODE_PIXELS, 24_000_000);

const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe1, 0, 32, 0x45, 0x78, 0x69, 0x66, 0, 0, 0x49, 0x49, 0x2a, 0, 8, 0, 0, 0, 1, 0, 0x12, 0x01, 3, 0, 1, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0xff, 0xd9]);
assert.equal(readJpegOrientation(jpeg), 6);

function hasBytes(bytes, needle) {
  return bytes.some((_, index) => needle.every((value, offset) => bytes[index + offset] === value));
}

function addOrientationAndGpsExif(jpegBytes) {
  const tiff = new Uint8Array(92); const view = new DataView(tiff.buffer);
  tiff.set([0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00], 0);
  view.setUint16(8, 2, true);
  view.setUint16(10, 0x0112, true); view.setUint16(12, 3, true); view.setUint32(14, 1, true); view.setUint16(18, 6, true);
  view.setUint16(22, 0x8825, true); view.setUint16(24, 4, true); view.setUint32(26, 1, true); view.setUint32(30, 38, true);
  view.setUint16(38, 2, true);
  view.setUint16(40, 0x0001, true); view.setUint16(42, 2, true); view.setUint32(44, 2, true); tiff.set([0x4e, 0x00], 48);
  view.setUint16(52, 0x0002, true); view.setUint16(54, 5, true); view.setUint32(56, 3, true); view.setUint32(60, 68, true);
  view.setUint32(68, 25, true); view.setUint32(72, 1, true); view.setUint32(76, 35, true); view.setUint32(80, 1, true); view.setUint32(84, 0, true); view.setUint32(88, 1, true);
  const payload = new Uint8Array(6 + tiff.length); payload.set([0x45, 0x78, 0x69, 0x66, 0x00, 0x00]); payload.set(tiff, 6);
  const segmentLength = payload.length + 2; const output = new Uint8Array(jpegBytes.length + payload.length + 4); output.set(jpegBytes.subarray(0, 2), 0); output.set([0xff, 0xe1, segmentLength >> 8, segmentLength & 0xff], 2); output.set(payload, 6); output.set(jpegBytes.subarray(2), 6 + payload.length); return output;
}

if (process.env.QR_DECODER_ROOT) {
  const decoderRoot = process.env.QR_DECODER_ROOT;
  const { default: jsQR } = await import(pathToFileURL(`${decoderRoot}/node_modules/jsqr/dist/jsQR.js`));
  const zxing = createRequire(`${decoderRoot}/package.json`)(`${decoderRoot}/node_modules/@zxing/library/cjs/index.js`);
  for (const payload of [url, textPayload, wifiPayload]) {
    const caseMatrix = createQrMatrix(payload, 'H'); const quiet = 4; const scale = 10; const rasterSize = (caseMatrix.size + quiet * 2) * scale;
    const rgba = new Uint8ClampedArray(rasterSize * rasterSize * 4); const grayscale = new Uint8ClampedArray(rasterSize * rasterSize);
    for (let y = 0; y < rasterSize; y += 1) for (let x = 0; x < rasterSize; x += 1) {
      const row = Math.floor(y / scale) - quiet; const column = Math.floor(x / scale) - quiet;
      const value = row >= 0 && column >= 0 && caseMatrix.modules[row]?.[column] ? 0 : 255;
      const rgbaIndex = (y * rasterSize + x) * 4; rgba[rgbaIndex] = value; rgba[rgbaIndex + 1] = value; rgba[rgbaIndex + 2] = value; rgba[rgbaIndex + 3] = 255; grayscale[y * rasterSize + x] = value;
    }
    assert.equal(jsQR(rgba, rasterSize, rasterSize)?.data, payload);
    const bitmap = new zxing.BinaryBitmap(new zxing.HybridBinarizer(new zxing.RGBLuminanceSource(grayscale, rasterSize, rasterSize)));
    assert.equal(new zxing.QRCodeReader().decode(bitmap).getText(), payload);
  }
  console.log('public QR independent jsQR + ZXing roundtrip pass');
}

if (process.env.IMAGE_CANVAS_ROOT) {
  const { createCanvas, loadImage } = await import(pathToFileURL(`${process.env.IMAGE_CANVAS_ROOT}/node_modules/@napi-rs/canvas/index.js`));
  const makeCanvas = () => { const canvas = createCanvas(1, 1); canvas.toBlob = (callback, type, quality) => { const options = Number.isFinite(quality) ? { quality: Math.round(quality * 100) } : undefined; callback(new Blob([canvas.toBuffer(type, options)], { type })); }; return canvas; };
  globalThis.document = { createElement: makeCanvas };
  const source = createCanvas(640, 360); const context = source.getContext('2d'); context.fillStyle = '#17324d'; context.fillRect(0, 0, 640, 360); context.fillStyle = '#f59e0b'; context.fillRect(24, 24, 200, 96);
  const qrCanvas = createCanvas(1, 1); drawQrCanvas(qrCanvas, matrix, { size: 512, quietZone: 4 }); const qrImage = await loadImage(qrCanvas.toBuffer('image/png')); assert.deepEqual([qrImage.width, qrImage.height], [512, 512]);
  for (const format of ['image/jpeg', 'image/png', 'image/webp']) {
    const output = composeImage(source, { width: 1080, height: 1350, fit: 'contain', format, background: '#ffffff', quality: 0.82, watermarkText: '@test' });
    const bytes = output.canvas.toBuffer(format, { quality: 82 }); const image = await loadImage(bytes); assert.deepEqual([image.width, image.height], [1080, 1350]);
    const signature = format === 'image/png' ? bytes.subarray(0, 8).toString('hex') : format === 'image/jpeg' ? bytes.subarray(0, 2).toString('hex') : bytes.subarray(0, 12).toString('ascii');
    assert.equal(format === 'image/png' ? signature === '89504e470d0a1a0a' : format === 'image/jpeg' ? signature === 'ffd8' : signature.startsWith('RIFF') && signature.endsWith('WEBP'), true);
  }
  const transparent = createCanvas(10, 10); const jpegBackground = composeImage(transparent, { width: 10, height: 10, fit: 'contain', format: 'image/jpeg', background: '#00ff00', transparent: true });
  const jpegBackgroundBytes = jpegBackground.canvas.toBuffer('image/jpeg', { quality: 100 }); const jpegBackgroundImage = await loadImage(jpegBackgroundBytes); const jpegPixelCanvas = createCanvas(10, 10); const jpegPixelContext = jpegPixelCanvas.getContext('2d'); jpegPixelContext.drawImage(jpegBackgroundImage, 0, 0); const pixel = jpegPixelContext.getImageData(0, 0, 1, 1).data; assert.ok(pixel[1] > 180 && pixel[0] < 80 && pixel[2] < 80);

  const originalJpeg = new Uint8Array(await readFile(new URL('../web-assets/influencer-avatars/INF00162.jpg', import.meta.url)));
  const orientedGpsJpeg = addOrientationAndGpsExif(originalJpeg); assert.equal(readJpegOrientation(orientedGpsJpeg), 6); assert.equal(hasBytes(orientedGpsJpeg, [0x25, 0x88]), true);
  const orientedImage = await loadImage(orientedGpsJpeg); const reencoded = composeImage(orientedImage, { width: orientedImage.width, height: orientedImage.height, fit: 'contain', format: 'image/jpeg', background: '#ffffff' }).canvas.toBuffer('image/jpeg', { quality: 90 });
  assert.equal(readJpegOrientation(reencoded), 1); assert.equal(hasBytes(reencoded, [0x45, 0x78, 0x69, 0x66]), false); assert.equal(hasBytes(reencoded, [0x25, 0x88]), false);

  const cancelController = new AbortController(); let canceledAfterFirst = false; const cancelResult = await processImageFiles([{ name: 'first.png', type: 'image/png', size: 1 }, { name: 'second.png', type: 'image/png', size: 1 }], { preset: 'custom', width: 32, height: 32, format: 'image/png', transparent: true }, { signal: cancelController.signal, decode: async () => ({ image: source, width: source.width, height: source.height, close() {} }), onProgress: progress => { if (!canceledAfterFirst && progress.status === 'done') { canceledAfterFirst = true; cancelController.abort(); } } });
  assert.equal(cancelResult.canceled, true); assert.equal(cancelResult.outputs.length, 1); assert.equal(cancelResult.errors.length, 0);
  console.log('public QR PNG/SVG and social JPEG/PNG/WebP output pass');
}

const zip = await createZip([{ name: 'qr.png', blob: new Blob(['image']) }, { name: '../two.png', blob: new Blob(['two']) }]);
assert.equal(zip.type, 'application/zip');
assert.ok(zip.size > 20);
const zipEntries = unzipSync(new Uint8Array(await zip.arrayBuffer()));
assert.equal(new TextDecoder().decode(zipEntries['qr.png']), 'image');
assert.equal(new TextDecoder().decode(zipEntries['__two.png']), 'two');

const [qrPage, socialPage] = await Promise.all([
  readFile(new URL('../tools/public-tools/qr-code.mjs', import.meta.url), 'utf8'),
  readFile(new URL('../tools/public-tools/social-image.mjs', import.meta.url), 'utf8'),
]);
assert.match(qrPage, /script: '\/web-assets\/public-tools\/qr-code\.mjs'/);
assert.match(socialPage, /script: '\/web-assets\/public-tools\/social-image\.mjs'/);
assert.match(qrPage, /id="qr-download-png"/);
assert.match(socialPage, /id="social-image-download-zip"/);
console.log('public QR/image pure contracts pass');
if (process.env.IMAGE_CANVAS_ROOT) process.exit(0);
