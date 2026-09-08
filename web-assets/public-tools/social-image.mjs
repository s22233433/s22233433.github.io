import { zipSync } from './vendor/fflate-0.8.2.mjs';

export const MAX_FILES = 10;
export const MAX_FILE_BYTES = 15 * 1024 * 1024;
export const MAX_DECODE_PIXELS = 24 * 1000 * 1000;
export const IMAGE_TYPES = Object.freeze({ 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' });
export const OUTPUT_PRESETS = Object.freeze({ square: [1080, 1080], portrait: [1080, 1350], story: [1080, 1920], landscape: [1920, 1080] });

function mimeFromName(name) {
  const extension = String(name ?? '').toLowerCase().match(/\.[a-z0-9]+$/)?.[0];
  return extension === '.jpg' || extension === '.jpeg' ? 'image/jpeg' : extension === '.png' ? 'image/png' : extension === '.webp' ? 'image/webp' : '';
}

export function validateImageFile(file) {
  if (!file || typeof file !== 'object') return { ok: false, message: '找不到圖片檔案。' };
  const type = String(file.type || mimeFromName(file.name)).toLowerCase();
  if (!IMAGE_TYPES[type]) return { ok: false, message: `${file.name || '此檔案'}：只接受 JPEG、PNG 或 WebP。`, type };
  if (!Number.isFinite(Number(file.size)) || Number(file.size) <= 0) return { ok: false, message: `${file.name || '此檔案'}：檔案大小無法判讀或是空檔。`, type };
  if (Number(file.size) > MAX_FILE_BYTES) return { ok: false, message: `${file.name || '此檔案'}：超過 15 MB。`, type };
  return { ok: true, type, size: Number(file.size) };
}

export function validateImageBatch(files) {
  const list = Array.from(files || []);
  return { ok: list.length > 0 && list.length <= MAX_FILES, count: list.length, message: list.length === 0 ? '請先選擇至少一張圖片。' : list.length > MAX_FILES ? `每批最多 ${MAX_FILES} 張圖片。` : '' };
}

export function getOutputDimensions(preset = 'square', width = 1080, height = 1080) {
  const dimensions = OUTPUT_PRESETS[preset] || (preset === 'custom' ? [Number(width), Number(height)] : OUTPUT_PRESETS.square);
  const outputWidth = Math.round(Number(dimensions[0]));
  const outputHeight = Math.round(Number(dimensions[1]));
  if (!Number.isFinite(outputWidth) || !Number.isFinite(outputHeight) || outputWidth < 1 || outputHeight < 1) throw new Error('輸出尺寸必須是正整數。');
  if (outputWidth > 8000 || outputHeight > 8000) throw new Error('輸出尺寸不可超過 8000 px。');
  if (outputWidth * outputHeight > MAX_DECODE_PIXELS) throw new Error('輸出尺寸超過 24 MP，請降低寬度或高度。');
  return { width: outputWidth, height: outputHeight };
}

export function calculateFit(sourceWidth, sourceHeight, targetWidth, targetHeight, mode = 'contain') {
  const sourceW = Number(sourceWidth); const sourceH = Number(sourceHeight); const targetW = Number(targetWidth); const targetH = Number(targetHeight);
  if (![sourceW, sourceH, targetW, targetH].every(value => Number.isFinite(value) && value > 0)) throw new Error('圖片或輸出尺寸無效。');
  if (!['contain', 'cover'].includes(mode)) throw new Error('比例處理只接受留白或裁切。');
  const scale = mode === 'cover' ? Math.max(targetW / sourceW, targetH / sourceH) : Math.min(targetW / sourceW, targetH / sourceH);
  const drawWidth = sourceW * scale; const drawHeight = sourceH * scale;
  if (mode === 'contain') return { sx: 0, sy: 0, sWidth: sourceW, sHeight: sourceH, dx: (targetW - drawWidth) / 2, dy: (targetH - drawHeight) / 2, dWidth: drawWidth, dHeight: drawHeight, scale };
  return { sx: (drawWidth - targetW) / scale / 2, sy: (drawHeight - targetH) / scale / 2, sWidth: targetW / scale, sHeight: targetH / scale, dx: 0, dy: 0, dWidth: targetW, dHeight: targetH, scale };
}

export function readJpegOrientation(input) {
  const bytes = input instanceof Uint8Array ? input : input instanceof ArrayBuffer ? new Uint8Array(input) : null;
  if (!bytes || bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return 1;
  let offset = 2;
  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) { offset += 1; continue; }
    const marker = bytes[offset + 1];
    if (marker === 0xda || marker === 0xd9) break;
    const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
    if (length < 2 || offset + 2 + length > bytes.length) break;
    if (marker === 0xe1 && length >= 10 && String.fromCharCode(...bytes.subarray(offset + 4, offset + 10)) === 'Exif\0\0') {
      const tiff = offset + 10;
      const little = bytes[tiff] === 0x49 && bytes[tiff + 1] === 0x49;
      const big = bytes[tiff] === 0x4d && bytes[tiff + 1] === 0x4d;
      const validMagic = little ? bytes[tiff + 2] === 0x2a && bytes[tiff + 3] === 0x00 : bytes[tiff + 2] === 0x00 && bytes[tiff + 3] === 0x2a;
      if ((little || big) && validMagic) {
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        const read16 = position => view.getUint16(position, little);
        const read32 = position => view.getUint32(position, little);
        const directory = tiff + read32(tiff + 4);
        if (directory + 2 <= bytes.length) {
          const entries = read16(directory);
          for (let index = 0; index < entries; index += 1) {
            const entry = directory + 2 + index * 12;
            if (entry + 12 > bytes.length) break;
            if (read16(entry) === 0x0112) {
              const orientation = read16(entry + 8);
              return orientation >= 1 && orientation <= 8 ? orientation : 1;
            }
          }
        }
      }
    }
    offset += 2 + length;
  }
  return 1;
}

export function orientedDimensions(width, height, orientation = 1) {
  return [5, 6, 7, 8].includes(orientation) ? { width: height, height: width } : { width, height };
}

function makeCanvas(width, height) {
  if (typeof document === 'undefined') throw new Error('圖片處理需要瀏覽器 Canvas。');
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  return canvas;
}

export async function decodeImageFile(file) {
  const validation = validateImageFile(file);
  if (!validation.ok) throw new Error(validation.message);
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      if (bitmap.width * bitmap.height > MAX_DECODE_PIXELS) { bitmap.close?.(); throw new Error('圖片解碼後超過 24 MP。'); }
      return { image: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close?.() };
    } catch (error) {
      if (error instanceof Error && /24 MP/.test(error.message)) throw error;
    }
  }
  if (typeof Image === 'undefined' || typeof URL === 'undefined') throw new Error('此瀏覽器無法解碼圖片。');
  const sourceUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise((resolve, reject) => { const element = new Image(); element.onload = () => resolve(element); element.onerror = () => reject(new Error('圖片損毀或無法解碼。')); element.src = sourceUrl; });
    const width = image.naturalWidth || image.width; const height = image.naturalHeight || image.height;
    if (width * height > MAX_DECODE_PIXELS) throw new Error('圖片解碼後超過 24 MP。');
    // Native Image owns EXIF orientation. Do not rotate a second time in fallback.
    return { image, width, height, close: () => {} };
  } finally { URL.revokeObjectURL(sourceUrl); }
}

function validHexColor(value, fallback = '#ffffff') {
  return /^#[0-9a-f]{6}$/i.test(String(value ?? '')) ? String(value).toLowerCase() : fallback;
}

function drawWatermark(context, canvas, { text = '', logoImage = null, opacity = 0.55 } = {}) {
  const cleanText = String(text || '').trim();
  if (!cleanText && !logoImage) return;
  const padding = Math.max(12, Math.round(canvas.width * 0.035));
  context.save();
  context.globalAlpha = Math.min(1, Math.max(0.05, Number(opacity)));
  context.textAlign = 'right'; context.textBaseline = 'bottom';
  let right = canvas.width - padding;
  if (cleanText) {
    const fontSize = Math.max(16, Math.round(canvas.width * 0.032));
    context.font = `600 ${fontSize}px system-ui, sans-serif`;
    context.fillStyle = '#ffffff'; context.shadowColor = 'rgba(0,0,0,.5)'; context.shadowBlur = Math.max(2, Math.round(fontSize * 0.18));
    context.strokeStyle = 'rgba(0,0,0,.85)'; context.lineWidth = Math.max(2, fontSize * 0.08);
    context.strokeText(cleanText, right, canvas.height - padding);
    context.fillText(cleanText, right, canvas.height - padding);
    right -= context.measureText(cleanText).width + padding;
  }
  if (logoImage) {
    const maxWidth = Math.max(24, Math.round(canvas.width * 0.2)); const maxHeight = Math.max(24, Math.round(canvas.height * 0.2));
    const ratio = Math.min(maxWidth / logoImage.width, maxHeight / logoImage.height, 1);
    const width = logoImage.width * ratio; const height = logoImage.height * ratio;
    context.shadowColor = 'rgba(0,0,0,.35)'; context.shadowBlur = Math.max(2, Math.round(width * 0.03));
    context.drawImage(logoImage, right - width, canvas.height - padding - height, width, height);
  }
  context.restore();
}

export function composeImage(source, { width, height, fit = 'contain', format = 'image/jpeg', background = '#ffffff', transparent = false, quality = 0.85, watermarkText = '', watermarkOpacity = 0.55, logoImage = null } = {}) {
  if (!source || !source.width || !source.height) throw new Error('圖片來源無效。');
  const output = makeCanvas(width, height); const context = output.getContext('2d');
  context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high';
  if (!(transparent && format !== 'image/jpeg')) { context.fillStyle = validHexColor(background); context.fillRect(0, 0, width, height); }
  const plan = calculateFit(source.width, source.height, width, height, fit);
  context.drawImage(source, plan.sx, plan.sy, plan.sWidth, plan.sHeight, plan.dx, plan.dy, plan.dWidth, plan.dHeight);
  drawWatermark(context, output, { text: watermarkText, logoImage, opacity: watermarkOpacity });
  return { canvas: output, plan, width, height, format, quality: Math.min(1, Math.max(0.1, Number(quality) || 0.85)) };
}

function canvasBlob(canvas, format, quality) {
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error(`瀏覽器不支援輸出 ${format}。`)), format, quality));
}

function basename(name) {
  return String(name || 'image').replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9\u4e00-\u9fff._-]+/g, '-').replace(/^-+|-+$/g, '') || 'image';
}

export function outputName(inputName, format, index = 0) {
  const extension = IMAGE_TYPES[format] || '.png';
  const suffix = index ? `-${index + 1}` : '';
  return `${basename(inputName)}${suffix}${extension}`;
}

export async function processImageFile(file, options = {}, { decode = decodeImageFile } = {}) {
  const validation = validateImageFile(file);
  if (!validation.ok) throw new Error(validation.message);
  const dimensions = getOutputDimensions(options.preset, options.width, options.height);
  const decoded = options.decoded || await decode(file);
  try {
    if (decoded.width * decoded.height > MAX_DECODE_PIXELS) throw new Error('圖片解碼後超過 24 MP。');
    const format = IMAGE_TYPES[options.format] ? options.format : 'image/jpeg';
    const composed = composeImage(decoded.image, { ...options, ...dimensions, format, transparent: format !== 'image/jpeg' && Boolean(options.transparent) });
    const blob = await canvasBlob(composed.canvas, format, composed.quality);
    if (blob.type && blob.type.toLowerCase() !== format) throw new Error(`瀏覽器未能輸出要求的 ${format} 格式。`);
    return { blob, name: outputName(file.name, format, options.index), type: format, width: dimensions.width, height: dimensions.height, bytes: blob.size, inputName: file.name || 'image' };
  } finally { if (!options.decoded) decoded.close?.(); }
}

export async function processImageFiles(files, options = {}, { signal, onProgress, onItem, decode = decodeImageFile } = {}) {
  const list = Array.from(files || []); const result = { outputs: [], errors: [], canceled: false, total: list.length };
  const batch = validateImageBatch(list);
  if (!batch.ok && !list.length) return { ...result, errors: [{ index: -1, message: batch.message }] };
  let logoDecoded = null;
  if (options.logoFile) {
    try { logoDecoded = await decode(options.logoFile); } catch (error) { result.errors.push({ index: -1, name: options.logoFile.name, message: `Logo：${error.message}` }); }
  }
  for (let index = 0; index < list.length; index += 1) {
    if (signal?.aborted) { result.canceled = true; break; }
    const file = list[index];
    if (index >= MAX_FILES) {
      result.errors.push({ index, name: file.name, message: `超過每批 ${MAX_FILES} 張上限。` });
      onProgress?.({ completed: index + 1, total: list.length, index, status: 'error', name: file.name });
      continue;
    }
    try {
      const output = await processImageFile(file, { ...options, index, logoImage: logoDecoded?.image }, { decode });
      result.outputs.push(output); onItem?.({ index, status: 'done', output, name: file.name });
      onProgress?.({ completed: index + 1, total: list.length, index, status: 'done', name: file.name });
    } catch (error) {
      const item = { index, name: file.name || `圖片 ${index + 1}`, message: error instanceof Error ? error.message : String(error) };
      result.errors.push(item); onItem?.({ ...item, status: 'error' });
      onProgress?.({ completed: index + 1, total: list.length, index, status: 'error', name: item.name });
    }
  }
  logoDecoded?.close?.();
  return result;
}

async function asBytes(value) {
  if (value instanceof Uint8Array) return value;
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (value?.arrayBuffer) return new Uint8Array(await value.arrayBuffer());
  throw new Error('ZIP 內容不是有效的圖片資料。');
}

export async function createZip(outputs) {
  const files = {};
  for (const output of outputs || []) {
    const baseName = String(output.name || 'image').replace(/[\\/]/g, '_').replace(/^\.+/, '_');
    let name = baseName || 'image'; let suffix = 2;
    while (files[name]) name = `${baseName.replace(/(\.[^.]+)$/, '')}-${suffix++}${baseName.match(/\.[^.]+$/)?.[0] || ''}`;
    files[name] = await asBytes(output.blob || output.bytes);
  }
  if (!Object.keys(files).length) throw new Error('沒有可放入 ZIP 的輸出圖片。');
  return new Blob([zipSync(files, { level: 6 })], { type: 'application/zip' });
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  const format = { 'image/jpeg':'jpeg', 'image/png':'png', 'image/webp':'webp', 'application/zip':'zip' }[blob.type];
  if (format) window.zgToolEvent?.('tool_export', { format });
}

export function initSocialImageTool(root = typeof document === 'undefined' ? null : document) {
  const scope = root?.querySelector ? root : document; const fileInput = scope?.querySelector?.('#social-image-files');
  if (!fileInput || fileInput.dataset.ready === 'true') return null;
  fileInput.dataset.ready = 'true';
  const $ = selector => scope.querySelector(selector);
  const state = { files: [], outputs: [], inputPreviewUrls: [], outputPreviewUrls: [], controller: null };
  const preset = $('#social-image-preset'); const custom = $('#social-image-custom-fields'); const format = $('#social-image-format'); const transparent = $('#social-image-transparent');
  const quality = $('#social-image-quality'); const qualityValue = $('#social-image-quality-value'); const opacity = $('#social-image-opacity'); const opacityValue = $('#social-image-opacity-value');
  const notice = $('#social-image-notice'); const errorList = $('#social-image-errors'); const progress = $('#social-image-progress'); const processButton = $('#social-image-process'); const cancelButton = $('#social-image-cancel'); const zipButton = $('#social-image-download-zip'); const fileList = $('#social-image-file-list'); const outputGrid = $('#social-image-output-grid'); const dropZone = $('#social-image-drop-zone');
  const syncControls = () => { custom.hidden = preset.value !== 'custom'; qualityValue.value = quality.value; qualityValue.textContent = quality.value; opacityValue.value = opacity.value; opacityValue.textContent = opacity.value; transparent.disabled = format.value === 'image/jpeg'; if (transparent.disabled) transparent.checked = false; };
  const readOptions = () => { const dimensions = getOutputDimensions(preset.value, $('#social-image-width')?.value, $('#social-image-height')?.value); return { ...dimensions, preset: preset.value, fit: $('#social-image-fit').value, format: format.value, quality: Number(quality.value) / 100, background: $('#social-image-background').value, transparent: transparent.checked, watermarkText: $('#social-image-watermark').value, watermarkOpacity: Number(opacity.value) / 100, logoFile: $('#social-image-logo').files?.[0] || null }; };
  const clearUrls = urls => urls.splice(0).forEach(url => URL.revokeObjectURL(url));
  const renderFileList = () => { clearUrls(state.inputPreviewUrls); fileList.innerHTML = ''; state.files.forEach(file => { const card = document.createElement('div'); card.className = 'social-file-card'; const image = document.createElement('img'); const url = URL.createObjectURL(file); state.inputPreviewUrls.push(url); image.src = url; image.alt = file.name || '待處理圖片'; const caption = document.createElement('span'); caption.textContent = file.name || '圖片'; card.append(image, caption); fileList.append(card); }); };
  const renderOutputs = () => { clearUrls(state.outputPreviewUrls); outputGrid.innerHTML = ''; if (!state.outputs.length) { outputGrid.innerHTML = '<p class="social-empty">目前沒有可下載的輸出圖片。</p>'; return; } state.outputs.forEach(output => { const card = document.createElement('article'); card.className = 'social-output-card'; const image = document.createElement('img'); const url = URL.createObjectURL(output.blob); state.outputPreviewUrls.push(url); image.src = url; image.alt = `${output.name} 預覽`; const text = document.createElement('p'); text.textContent = `${output.name} · ${output.width} × ${output.height} · ${Math.max(1, Math.round(output.bytes / 1024))} KB`; const button = document.createElement('button'); button.type = 'button'; button.textContent = '下載'; button.addEventListener('click', () => { triggerDownload(output.blob, output.name); }); card.append(image, text, button); outputGrid.append(card); }); };
  const run = async () => { if (state.controller) return; const batch = validateImageBatch(state.files); if (!state.files.length) { notice.textContent = batch.message; notice.dataset.level = 'error'; return; } let options; try { options = readOptions(); } catch (error) { notice.textContent = error.message; notice.dataset.level = 'error'; return; } errorList?.replaceChildren(); state.outputs = []; renderOutputs(); state.controller = new AbortController(); processButton.disabled = true; cancelButton.disabled = false; progress.hidden = false; progress.max = state.files.length; progress.value = 0; const result = await processImageFiles(state.files, options, { signal: state.controller.signal, onProgress: update => { progress.value = update.completed; notice.textContent = `${update.completed}/${state.files.length}：${update.name || ''}${update.status === 'error' ? '（失敗）' : ''}`; }, onItem: item => { if (item.status === 'done') { state.outputs.push(item.output); renderOutputs(); } } }); state.outputs = result.outputs; if (!result.canceled && result.outputs.length) window.zgToolEvent?.('tool_complete', { format: 'preview' }); renderOutputs(); state.controller = null; processButton.disabled = false; cancelButton.disabled = true; zipButton.disabled = !state.outputs.length; progress.hidden = true; notice.textContent = result.canceled ? `已取消；保留 ${result.outputs.length} 張已完成圖片。` : `完成 ${result.outputs.length} 張${result.errors.length ? `，${result.errors.length} 張失敗。` : '。'}`; notice.dataset.level = result.errors.length ? 'warning' : 'ok'; errorList?.replaceChildren(...result.errors.map(error => { const item = document.createElement('p'); item.textContent = `${error.name || '項目'}：${error.message}`; return item; })); };
  const setFiles = files => { state.files = Array.from(files || []); state.outputs = []; errorList?.replaceChildren(); renderOutputs(); renderFileList(); notice.textContent = state.files.length > MAX_FILES ? `已選 ${state.files.length} 張；處理時只會保留前 ${MAX_FILES} 張。` : ''; };
  fileInput.addEventListener('change', () => setFiles(fileInput.files));
  dropZone?.addEventListener('dragover', event => { event.preventDefault(); dropZone.classList.add('is-dragging'); });
  dropZone?.addEventListener('dragleave', () => dropZone.classList.remove('is-dragging'));
  dropZone?.addEventListener('drop', event => { event.preventDefault(); dropZone.classList.remove('is-dragging'); setFiles(event.dataTransfer?.files); });
  [preset, format, quality, opacity, transparent, $('#social-image-fit'), $('#social-image-background'), $('#social-image-width'), $('#social-image-height')].filter(Boolean).forEach(element => element.addEventListener('input', syncControls));
  preset.addEventListener('change', syncControls); format.addEventListener('change', syncControls); processButton.addEventListener('click', run); cancelButton.addEventListener('click', () => state.controller?.abort());
  zipButton.addEventListener('click', async () => { try { triggerDownload(await createZip(state.outputs), 'social-images.zip'); } catch (error) { notice.textContent = error.message; notice.dataset.level = 'error'; } });
  syncControls(); renderOutputs();
  return { run, getState: () => ({ ...state, files: state.files.slice(), outputs: state.outputs.slice() }) };
}

if (typeof document !== 'undefined') {
  const start = () => initSocialImageTool(document.getElementById('tool-workspace') || document);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
}
