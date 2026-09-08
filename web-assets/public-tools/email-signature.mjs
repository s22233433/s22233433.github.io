const TEMPLATE_NAMES = new Set(['plain', 'logo', 'bilingual']);
const DEFAULT_COLOR = '#315b9d';
const MIN_FONT_SIZE = 10;
const MAX_FONT_SIZE = 22;

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));
}

function oneLine(value) {
  return String(value ?? '').replace(/\s+/gu, ' ').trim();
}

export function normalizeHttpsUrl(value) {
  const raw = oneLine(value);
  if (!raw || /[\u0000-\u001f\u007f<>]/u.test(raw)) return '';
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) return '';
    return url.href;
  } catch {
    return '';
  }
}

export function isSafeHttpsUrl(value) {
  return Boolean(normalizeHttpsUrl(value));
}

function normalizeColor(value) {
  const color = oneLine(value).toLowerCase();
  return /^#[0-9a-f]{6}$/u.test(color) ? color : DEFAULT_COLOR;
}

function normalizeFontSize(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, Math.round(number))) : 14;
}

function isEmail(value) {
  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/u.test(value) && !/[\u0000-\u001f\u007f]/u.test(value);
}

function normalizeFields(fields = {}) {
  return {
    template: TEMPLATE_NAMES.has(fields.template) ? fields.template : 'plain',
    color: normalizeColor(fields.color),
    fontSize: normalizeFontSize(fields.fontSize),
    name: oneLine(fields.name),
    title: oneLine(fields.title),
    company: oneLine(fields.company),
    phone: oneLine(fields.phone),
    email: oneLine(fields.email),
    website: oneLine(fields.website),
    chatLabel: oneLine(fields.chatLabel),
    chatUrl: oneLine(fields.chatUrl),
    nameEn: oneLine(fields.nameEn),
    titleEn: oneLine(fields.titleEn),
    companyEn: oneLine(fields.companyEn),
    logoUrl: oneLine(fields.logoUrl)
  };
}

function joinNonEmpty(values, separator) {
  return values.filter(Boolean).join(separator);
}

function safeLink(label, url, color) {
  return '<a href="' + escapeHtml(url) + '" style="color:' + color + ';text-decoration:none;">' + escapeHtml(label) + '</a>';
}

function contactParts(fields, color, warnings) {
  const parts = [];
  if (fields.phone) parts.push(escapeHtml(fields.phone));
  if (fields.email) {
    if (isEmail(fields.email)) {
      parts.push('<a href="mailto:' + encodeURIComponent(fields.email) + '" style="color:' + color + ';text-decoration:none;">' + escapeHtml(fields.email) + '</a>');
    } else {
      warnings.push('Email 格式無法確認，已略過連結。');
    }
  }
  if (fields.website) {
    const url = normalizeHttpsUrl(fields.website);
    if (url) {
      parts.push(safeLink(new URL(url).hostname, url, color));
    } else {
      warnings.push('網站網址必須是沒有帳密的 HTTPS 網址，已略過。');
    }
  }
  if (fields.chatLabel) {
    const url = normalizeHttpsUrl(fields.chatUrl);
    parts.push(url ? safeLink(fields.chatLabel, url, color) : escapeHtml(fields.chatLabel));
    if (fields.chatUrl && !url) warnings.push('LINE／WeChat 連結必須是沒有帳密的 HTTPS 網址，已略過連結。');
  } else if (fields.chatUrl) {
    const url = normalizeHttpsUrl(fields.chatUrl);
    if (!url) warnings.push('LINE／WeChat 連結必須是沒有帳密的 HTTPS 網址，已略過。');
  }
  return parts;
}

function identityLines(fields) {
  const bilingual = fields.template === 'bilingual';
  const name = bilingual
    ? joinNonEmpty([fields.name, fields.nameEn], ' / ')
    : fields.name || fields.nameEn;
  const title = bilingual
    ? joinNonEmpty([fields.title, fields.titleEn], ' / ')
    : fields.title || fields.titleEn;
  const company = bilingual
    ? joinNonEmpty([fields.company, fields.companyEn], ' / ')
    : fields.company || fields.companyEn;
  return [name, joinNonEmpty([title, company], ' · ')].filter(Boolean);
}

function signatureText(fields, warnings) {
  const lines = identityLines(fields);
  if (fields.phone) lines.push(fields.phone);
  if (isEmail(fields.email)) lines.push(fields.email);
  else if (fields.email) warnings.push('Email 格式無法確認，純文字版本未加入。');
  if (fields.website) {
    const url = normalizeHttpsUrl(fields.website);
    if (url) lines.push(url);
  }
  if (fields.chatLabel) {
    const url = normalizeHttpsUrl(fields.chatUrl);
    lines.push(url ? fields.chatLabel + ': ' + url : fields.chatLabel);
  }
  return lines.join('\n');
}

function signatureHtml(fields, warnings) {
  const identity = identityLines(fields);
  const contact = contactParts(fields, fields.color, warnings);
  const blocks = [];
  if (identity[0]) blocks.push('<div style="font-size:' + (fields.fontSize + 4) + 'px;line-height:1.25;font-weight:700;color:' + fields.color + ';">' + escapeHtml(identity[0]) + '</div>');
  if (identity[1]) blocks.push('<div style="margin-top:3px;font-size:' + fields.fontSize + 'px;line-height:1.45;color:#172033;">' + escapeHtml(identity[1]) + '</div>');
  if (contact.length) blocks.push('<div style="margin-top:10px;padding-top:9px;border-top:1px solid ' + fields.color + ';font-size:' + fields.fontSize + 'px;line-height:1.6;color:#172033;">' + contact.join(' <span style="color:#8a93a3;">·</span> ') + '</div>');
  const logo = fields.template === 'logo' ? normalizeHttpsUrl(fields.logoUrl) : '';
  if (fields.template === 'logo' && fields.logoUrl && !logo) warnings.push('Logo 網址必須是沒有帳密的 HTTPS 圖片網址，已略過圖片。');
  if (!blocks.length) return '';
  const content = '<div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif;color:#172033;">' + blocks.join('') + '</div>';
  const logoCell = logo
    ? '<td style="padding:0 16px 0 0;vertical-align:top;"><img src="' + escapeHtml(logo) + '" alt="' + escapeHtml(fields.company || fields.name || 'Logo') + '" width="72" style="display:block;width:72px;height:auto;border:0;"></td>'
    : '';
  const contentCellStyle = logo ? 'vertical-align:top;padding-left:16px;border-left:1px solid ' + fields.color + ';' : 'vertical-align:top;';
  return '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tbody><tr>' + logoCell + '<td style="' + contentCellStyle + '">' + content + '</td></tr></tbody></table>';
}

export function buildSignature(fields = {}) {
  const normalized = normalizeFields(fields);
  const warnings = [];
  const html = signatureHtml(normalized, warnings);
  const text = signatureText(normalized, warnings);
  return { html, text, warnings: [...new Set(warnings)], hasContent: Boolean(html) };
}

export function previewSignatureHtml(html) {
  return String(html ?? '')
    .replace(/<a\b([^>]*)>/gu, (_, attributes) => '<span' + attributes.replace(/\s+href="[^"]*"/giu, '') + '>')
    .replace(/<\/a>/giu, '</span>');
}

function fallbackCopyText(value) {
  if (typeof document === 'undefined' || typeof document.execCommand !== 'function') return false;
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.setAttribute('aria-hidden', 'true');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  }
  textarea.remove();
  return copied;
}

export async function copyText(value) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(String(value));
      return true;
    } catch {
      // The native clipboard can be denied; use the visible-browser fallback.
    }
  }
  return fallbackCopyText(String(value));
}

export async function copySignature(html, text) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.write && typeof globalThis.ClipboardItem === 'function' && typeof Blob === 'function') {
    try {
      const item = new globalThis.ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([text], { type: 'text/plain' })
      });
      await navigator.clipboard.write([item]);
      return 'html';
    } catch {
      // Fall through to a plain-text copy when rich clipboard permission is unavailable.
    }
  }
  return (await copyText(text)) ? 'text' : false;
}

function formValues(form) {
  return Object.fromEntries([...form.querySelectorAll('[name]')].map(input => [
    input.name,
    input.type === 'checkbox' ? input.checked : input.value
  ]));
}

export function initEmailSignatureTool(root = typeof document === 'undefined' ? null : document.querySelector('[data-tool="email-signature"]')) {
  if (!root || root.dataset.signatureReady === 'true') return false;
  const form = root.querySelector('#email-signature-form');
  if (!form) return false;
  root.dataset.signatureReady = 'true';
  const wide = root.querySelector('#signature-preview-wide');
  const narrow = root.querySelector('#signature-preview-narrow');
  const source = root.querySelector('#signature-html-source');
  const notice = root.querySelector('#signature-notice');
  const logoField = root.querySelector('.signature-logo-field');
  const bilingualFields = root.querySelector('.signature-bilingual-fields');
  let current = buildSignature({});
  const render = () => {
    current = buildSignature(formValues(form));
    [wide, narrow].forEach(preview => {
      preview.replaceChildren();
      if (current.html) preview.innerHTML = previewSignatureHtml(current.html);
      else preview.textContent = '填寫姓名或公司後預覽';
    });
    source.value = current.html;
    const template = form.elements.template?.value;
    if (logoField) logoField.hidden = template !== 'logo';
    if (bilingualFields) bilingualFields.hidden = template !== 'bilingual';
    notice.textContent = current.warnings.length
      ? current.warnings.join(' ')
      : current.hasContent ? '預覽已更新；可檢查 HTML 後複製。' : '尚未填寫內容；先填姓名或公司即可預覽。';
    notice.dataset.tone = current.warnings.length ? 'error' : 'info';
  };
  form.addEventListener('input', render);
  form.addEventListener('change', render);
  form.addEventListener('reset', () => setTimeout(render, 0));
  root.querySelector('#copy-signature-html')?.addEventListener('click', async () => {
    render();
    if (!current.html) {
      notice.textContent = '請先填寫至少姓名、公司或一項聯絡方式。';
      notice.dataset.tone = 'error';
      return;
    }
    const format = await copySignature(current.html, current.text);
    if (format === 'html') {
      notice.textContent = '已複製排版 HTML，可貼到郵件簽名設定。';
      notice.dataset.tone = 'info';
      try { window.zgToolEvent?.('tool_complete', { format: 'html' }); } catch {}
    } else if (format === 'text') {
      notice.textContent = '排版複製受限，已複製純文字版本。';
      notice.dataset.tone = 'info';
    } else {
      notice.textContent = '複製失敗，請手動選取下方 HTML 原始碼。';
      notice.dataset.tone = 'error';
    }
  });
  root.querySelector('#copy-signature-text')?.addEventListener('click', async () => {
    render();
    if (!current.text) {
      notice.textContent = '請先填寫至少姓名、公司或一項聯絡方式。';
      notice.dataset.tone = 'error';
      return;
    }
    notice.textContent = await copyText(current.text) ? '已複製純文字版本。' : '複製失敗，請手動選取預覽內容。';
    notice.dataset.tone = notice.textContent.includes('失敗') ? 'error' : 'info';
  });
  render();
  return true;
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initEmailSignatureTool(), { once: true });
  else initEmailSignatureTool();
}
