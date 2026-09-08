import qrcode from './vendor/qrcode-generator-1.4.4.mjs';

const URL_PROTOCOLS = new Set(['http:', 'https:']);
const QR_LEVELS = new Set(['L', 'M', 'Q', 'H']);
const COLOR_RE = /^#[0-9a-f]{6}$/i;

export function escapeWifi(value) {
  return String(value ?? '').replace(/[\\;,:\"]/g, character => `\\${character}`);
}

export function buildWifiPayload({ ssid, password = '', security = 'WPA', hidden = false } = {}) {
  const cleanSsid = String(ssid ?? '');
  const cleanPassword = String(password ?? '');
  const auth = security === 'nopass' ? 'nopass' : security;
  if (!cleanSsid) throw new Error('請輸入 Wi-Fi 名稱。');
  if (!['WPA', 'WEP', 'nopass'].includes(auth)) throw new Error('Wi-Fi 安全性格式不支援。');
  if (auth !== 'nopass' && !cleanPassword) throw new Error('請輸入 Wi-Fi 密碼，或選擇無密碼。');
  return `WIFI:T:${auth};S:${escapeWifi(cleanSsid)};P:${escapeWifi(cleanPassword)};H:${hidden ? 'true' : 'false'};;`;
}

export function validateUrl(value) {
  const input = String(value ?? '').trim();
  if (!input) throw new Error('請輸入網址。');
  let parsed;
  try { parsed = new URL(input); } catch { throw new Error('請輸入有效網址，例如 https://example.com。'); }
  if (!URL_PROTOCOLS.has(parsed.protocol)) throw new Error('網址只接受 http:// 或 https://。');
  return input;
}

export function buildQrPayload({ type = 'url', url = '', text = '', ssid = '', password = '', security = 'WPA', hidden = false } = {}) {
  if (type === 'url') return validateUrl(url);
  if (type === 'text') {
    if (!String(text)) throw new Error('請輸入要編碼的文字。');
    return String(text);
  }
  if (type === 'wifi') return buildWifiPayload({ ssid, password, security, hidden });
  throw new Error('不支援的 QR Code 內容類型。');
}

export function normalizeHexColor(value, fallback = '#ffffff') {
  const candidate = String(value ?? '').trim();
  if (COLOR_RE.test(candidate)) return candidate.toLowerCase();
  if (/^#[0-9a-f]{3}$/i.test(candidate)) return `#${candidate.slice(1).split('').map(char => char + char).join('').toLowerCase()}`;
  return fallback;
}

export function hexToRgb(value) {
  const hex = normalizeHexColor(value);
  return [Number.parseInt(hex.slice(1, 3), 16), Number.parseInt(hex.slice(3, 5), 16), Number.parseInt(hex.slice(5, 7), 16)];
}

function channelLuminance(channel) {
  const normalized = channel / 255;
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function contrastRatio(foreground, background) {
  const [fr, fg, fb] = hexToRgb(foreground).map(channelLuminance);
  const [br, bg, bb] = hexToRgb(background).map(channelLuminance);
  const foregroundLuminance = 0.2126 * fr + 0.7152 * fg + 0.0722 * fb;
  const backgroundLuminance = 0.2126 * br + 0.7152 * bg + 0.0722 * bb;
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
}

export function validateContrast(darkColor, lightColor, minimum = 3) {
  const dark = normalizeHexColor(darkColor, '#111827');
  const light = normalizeHexColor(lightColor, '#ffffff');
  const ratio = contrastRatio(dark, light);
  const darkIsDarker = hexToRgb(dark).map(channelLuminance).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0) < hexToRgb(light).map(channelLuminance).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
  return { ok: ratio >= minimum && darkIsDarker, ratio, darkIsDarker, message: ratio >= minimum && darkIsDarker ? '' : `目前對比約 ${ratio.toFixed(2)}:1；建議使用更深的前景色和更淺的背景色，並用實際裝置掃描。` };
}

export function createQrMatrix(payload, errorCorrection = 'M') {
  if (!QR_LEVELS.has(errorCorrection)) throw new Error('錯誤更正格式不支援。');
  if (qrcode.stringToBytesFuncs?.['UTF-8']) qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
  const qr = qrcode(0, errorCorrection);
  qr.addData(String(payload), 'Byte');
  try { qr.make(); } catch (error) { throw new Error('內容太長，請縮短文字或降低錯誤更正等級。', { cause: error }); }
  const size = qr.getModuleCount();
  const modules = Array.from({ length: size }, (_, row) => Array.from({ length: size }, (_, column) => qr.isDark(row, column)));
  return { modules, size, errorCorrection };
}

function clampInteger(value, minimum, maximum, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.min(maximum, Math.max(minimum, parsed)) : fallback;
}

export function renderQrSvg(matrix, { size = 512, quietZone = 4, darkColor = '#111827', lightColor = '#ffffff', title = 'QR Code' } = {}) {
  if (!matrix || !Array.isArray(matrix.modules) || !matrix.size) throw new Error('缺少 QR Code 模組資料。');
  const pixelSize = clampInteger(size, 64, 4096, 512);
  const margin = clampInteger(quietZone, 0, 32, 4);
  const dark = normalizeHexColor(darkColor, '#111827');
  const light = normalizeHexColor(lightColor, '#ffffff');
  const total = matrix.size + margin * 2;
  const paths = [];
  for (let row = 0; row < matrix.size; row += 1) {
    for (let column = 0; column < matrix.size; column += 1) {
      if (matrix.modules[row][column]) paths.push(`M${column + margin} ${row + margin}h1v1h-1z`);
    }
  }
  const safeTitle = String(title).replace(/[<>&"']/g, character => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[character]));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${pixelSize}" height="${pixelSize}" viewBox="0 0 ${total} ${total}" role="img" aria-label="${safeTitle}" shape-rendering="crispEdges"><title>${safeTitle}</title><rect width="100%" height="100%" fill="${light}"/><path fill="${dark}" d="${paths.join('')}"/></svg>`;
}

export function drawQrCanvas(canvas, matrix, { size = 512, quietZone = 4, darkColor = '#111827', lightColor = '#ffffff' } = {}) {
  if (!canvas?.getContext) throw new Error('此瀏覽器不支援 Canvas。');
  const pixelSize = clampInteger(size, 64, 4096, 512);
  const margin = clampInteger(quietZone, 0, 32, 4);
  const total = matrix.size + margin * 2;
  const context = canvas.getContext('2d');
  canvas.width = pixelSize;
  canvas.height = pixelSize;
  context.imageSmoothingEnabled = false;
  context.fillStyle = normalizeHexColor(lightColor, '#ffffff');
  context.fillRect(0, 0, pixelSize, pixelSize);
  context.fillStyle = normalizeHexColor(darkColor, '#111827');
  for (let row = 0; row < matrix.size; row += 1) {
    for (let column = 0; column < matrix.size; column += 1) {
      if (matrix.modules[row][column]) context.fillRect((column + margin) * pixelSize / total, (row + margin) * pixelSize / total, pixelSize / total + 0.1, pixelSize / total + 0.1);
    }
  }
  return canvas;
}

function canvasToBlob(canvas, type, quality) {
  if (typeof canvas.toBlob !== 'function') return Promise.reject(new Error('此瀏覽器不支援圖片匯出。'));
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('圖片匯出失敗。')), type, quality));
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function initQrTool(root = typeof document === 'undefined' ? null : document) {
  const scope = root?.querySelector ? root : document;
  const type = scope?.querySelector?.('#qr-type');
  if (!type || type.dataset.ready === 'true') return null;
  type.dataset.ready = 'true';
  const $ = selector => scope.querySelector(selector);
  const fields = { url: $('#qr-url-fields'), text: $('#qr-text-fields'), wifi: $('#qr-wifi-fields') };
  const notice = $('#qr-notice');
  const preview = $('#qr-preview');
  const encoded = $('#qr-encoded');
  const moduleCount = $('#qr-module-count');
  const encodedLength = $('#qr-encoded-length');
  const pngButton = $('#qr-download-png');
  const svgButton = $('#qr-download-svg');
  let current = null;
  let renderTimer = 0;

  const updateFields = () => Object.entries(fields).forEach(([name, element]) => { if (element) element.hidden = type.value !== name; });
  const formPayload = () => buildQrPayload({ type: type.value, url: $('#qr-url')?.value, text: $('#qr-text')?.value, ssid: $('#qr-wifi-ssid')?.value, password: $('#qr-wifi-password')?.value, security: $('#qr-wifi-security')?.value, hidden: $('#qr-wifi-hidden')?.checked });
  const render = () => {
    updateFields();
    try {
      const payload = formPayload();
      const level = QR_LEVELS.has($('#qr-level')?.value) ? $('#qr-level').value : 'M';
      const matrix = createQrMatrix(payload, level);
      const darkColor = normalizeHexColor($('#qr-dark')?.value, '#111827');
      const lightColor = normalizeHexColor($('#qr-light')?.value, '#ffffff');
      const contrast = validateContrast(darkColor, lightColor);
      const size = clampInteger($('#qr-size')?.value, 64, 2048, 512);
      const quietZone = clampInteger($('#qr-quiet')?.value, 0, 32, 4);
      const svg = renderQrSvg(matrix, { size, quietZone, darkColor, lightColor });
      preview.innerHTML = svg;
      encoded.textContent = payload;
      moduleCount.textContent = `${matrix.size} × ${matrix.size}`;
      encodedLength.textContent = `${new TextEncoder().encode(payload).length} bytes`;
      const advice = [contrast.message, quietZone < 4 ? '建議四周至少保留 4 格留白，避免掃描器把外框誤判。' : ''].filter(Boolean);
      notice.textContent = advice.join(' ');
      notice.dataset.level = advice.length ? 'warning' : 'ok';
      pngButton.disabled = false;
      svgButton.disabled = false;
      current = { payload, matrix, darkColor, lightColor, size, quietZone, svg };
      return current;
    } catch (error) {
      current = null;
      preview.textContent = '尚未產生預覽';
      encoded.textContent = '—';
      moduleCount.textContent = '—';
      encodedLength.textContent = '—';
      pngButton.disabled = true;
      svgButton.disabled = true;
      notice.textContent = error instanceof Error ? error.message : String(error);
      notice.dataset.level = 'error';
      return null;
    }
  };
  const scheduleRender = () => { clearTimeout(renderTimer); renderTimer = setTimeout(render, 120); };
  type.addEventListener('change', render);
  scope.querySelectorAll('input, textarea, select').forEach(element => element.addEventListener('input', scheduleRender));
  $('#qr-generate')?.addEventListener('click', render);
  pngButton?.addEventListener('click', async () => {
    if (!current) return;
    try {
      const canvas = document.createElement('canvas');
      drawQrCanvas(canvas, current.matrix, current);
      triggerDownload(await canvasToBlob(canvas, 'image/png'), 'qr-code.png');
    } catch (error) { notice.textContent = error.message; notice.dataset.level = 'error'; }
  });
  svgButton?.addEventListener('click', () => { if (!current) return; triggerDownload(new Blob([current.svg], { type: 'image/svg+xml' }), 'qr-code.svg'); });
  updateFields();
  render();
  return { render, getCurrent: () => current };
}

if (typeof document !== 'undefined') {
  const start = () => initQrTool(document.getElementById('tool-workspace') || document);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
}
