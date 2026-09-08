const setValue = (selector, value) => (
  "(() => { const node = document.querySelector(" + JSON.stringify(selector) + "); if (!node) throw new Error('Missing input: ' + " + JSON.stringify(selector) + "); node.value = " + JSON.stringify(value) + "; node.dispatchEvent(new Event('input', { bubbles: true })); node.dispatchEvent(new Event('change', { bubbles: true })); })();"
);

const quotationSetup = [
  setValue('[name="issuerName"]', 'GA4 虛構測試團隊'),
  setValue('[name="clientName"]', 'GA4 虛構測試客戶'),
  setValue('[data-field="name"]', '虛構測試服務'),
  setValue('[data-field="description"]', '僅供分析驗證'),
  setValue('[data-field="quantity"]', '1'),
  setValue('[data-field="unitPrice"]', '100')
].join('\n');

const emailSetup = [
  setValue('input[name="name"]', 'GA4 虛構測試人員'),
  setValue('input[name="title"]', '測試職稱'),
  setValue('input[name="company"]', '虛構測試品牌'),
  setValue('input[name="email"]', 'ga4-test@example.invalid')
].join('\n');

const counterSetup = setValue(
  '#script-counter-text',
  '這是一段只用於 GA4 驗證的虛構稿件。\nThis is a safe test paragraph.'
);

const qrSetup = setValue('#qr-url', 'https://example.com/ga4-public-tool-test?q=1');

const socialSetup = [
  '(async () => {',
  '  const canvas = document.createElement("canvas");',
  '  canvas.width = 4; canvas.height = 4;',
  '  const context = canvas.getContext("2d");',
  '  context.fillStyle = "#315b9d"; context.fillRect(0, 0, 4, 4);',
  '  const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));',
  '  if (!blob) throw new Error("Unable to create a test image.");',
  '  const input = document.querySelector("#social-image-files");',
  '  const transfer = new DataTransfer();',
  '  transfer.items.add(new File([blob], "ga4-public-test.png", { type: "image/png" }));',
  '  input.files = transfer.files;',
  '  input.dispatchEvent(new Event("change", { bubbles: true }));',
  '  const format = document.querySelector("#social-image-format");',
  '  format.value = "image/png";',
  '  format.dispatchEvent(new Event("change", { bubbles: true }));',
  '})()'
].join('\n');

const click = selector => ({ selector });
const expected = (event, format) => ({ event, ...(format ? { format } : {}) });

export const publicToolTargets = Object.freeze([
  {
    id: 'daily-draw', slug: 'daily-draw', path: '/tools/daily-draw/', uiSelector: '#draw-app[data-ready="true"]',
    setup: setValue('#draw-options', '抽籤測試甲\n抽籤測試乙\n抽籤測試丙'),
    canary: ['抽籤測試甲', '抽籤測試乙', '抽籤測試丙'],
    actions: [
      { name: 'pick', before: [], click: click('#draw-submit'), waitFor: '#draw-output .draw-result-card', expect: [expected('tool_start'), expected('tool_complete', 'preview')] },
      { name: 'double click', before: [click('#draw-submit')], click: click('#draw-submit'), waitFor: '#draw-output .draw-result-card', expect: [expected('tool_start'), expected('tool_complete', 'preview')] },
      { name: 'groups', before: [], setup: setValue('#draw-mode', 'groups'), click: click('#draw-submit'), waitFor: '#draw-output[data-mode="groups"] .draw-result-card', expect: [expected('tool_start'), expected('tool_complete', 'preview')] },
      { name: 'copy text', before: [click('#draw-submit')], beforeWaitFor: '#draw-output .draw-result-card', click: click('#draw-copy'), expect: [expected('tool_start'), expected('tool_complete', 'preview'), expected('tool_export', 'text')] },
      { name: 'download PNG', before: [click('#draw-submit')], beforeWaitFor: '#draw-output .draw-result-card', click: click('#draw-png'), expect: [expected('tool_start'), expected('tool_complete', 'preview'), expected('tool_export', 'png')], download: true }
    ]
  },
  {
    id: 'quotation',
    slug: 'quotation-generator',
    path: '/tools/quotation-generator/',
    uiSelector: '#quotation-form',
    setup: quotationSetup,
    canary: ['GA4 虛構測試團隊', 'GA4 虛構測試客戶', '虛構測試服務', '僅供分析驗證'],
    actions: [
      { name: 'preview', before: [], click: click('[data-action="generate"]'), expect: [expected('tool_start'), expected('tool_complete', 'preview')] },
      { name: 'print PDF', before: [], click: click('[data-action="print"]'), expect: [expected('tool_start'), expected('tool_complete', 'preview'), expected('tool_export', 'pdf')], print: true },
      { name: 'export JSON', before: [], click: click('[data-action="export-json"]'), expect: [expected('tool_start'), expected('tool_export', 'json')], download: true }
    ]
  },
  {
    id: 'email-signature',
    slug: 'email-signature-generator',
    path: '/tools/email-signature-generator/',
    uiSelector: '#email-signature-form',
    setup: emailSetup,
    canary: ['GA4 虛構測試人員', '測試職稱', '虛構測試品牌', 'ga4-test@example.invalid'],
    actions: [
      { name: 'copy HTML', before: [], click: click('#copy-signature-html'), expect: [expected('tool_start'), expected('tool_complete', 'html')] }
    ]
  },
  {
    id: 'qr-code',
    slug: 'qr-code-generator',
    path: '/tools/qr-code-generator/',
    uiSelector: '#qr-type',
    setup: qrSetup,
    canary: ['https://example.com/ga4-public-tool-test?q=1'],
    actions: [
      { name: 'generate', before: [click('#qr-generate')], click: click('#qr-generate'), expect: [expected('tool_start'), expected('tool_complete', 'preview')] },
      { name: 'download PNG', before: [click('#qr-generate')], beforeWaitFor: '#qr-download-svg:not([disabled])', click: click('#qr-download-png'), expect: [expected('tool_start'), expected('tool_complete', 'preview'), expected('tool_export', 'png')], download: true },
      { name: 'download SVG', before: [click('#qr-generate')], beforeWaitFor: '#qr-download-svg:not([disabled])', click: click('#qr-download-svg'), expect: [expected('tool_start'), expected('tool_complete', 'preview'), expected('tool_export', 'svg')], download: true }
    ]
  },
  {
    id: 'script-counter',
    slug: 'script-word-counter',
    path: '/tools/script-word-counter/',
    uiSelector: '#script-counter-form',
    setup: counterSetup,
    canary: ['這是一段只用於 GA4 驗證的虛構稿件。', 'This is a safe test paragraph.'],
    actions: [
      { name: 'copy summary', before: [], click: click('#copy-counter-summary'), expect: [expected('tool_start'), expected('tool_complete', 'summary')] }
    ]
  },
  {
    id: 'social-image',
    slug: 'social-image-tool',
    path: '/tools/social-image-tool/',
    uiSelector: '#social-image-files',
    setup: socialSetup,
    canary: ['ga4-public-test.png'],
    actions: [
      { name: 'process PNG', before: [], click: click('#social-image-process'), waitFor: '#social-image-download-zip:not([disabled])', expect: [expected('tool_start'), expected('tool_complete', 'preview')] },
      { name: 'download PNG', before: [click('#social-image-process')], beforeWaitFor: '#social-image-download-zip:not([disabled])', click: click('#social-image-output-grid button'), waitFor: '#social-image-download-zip:not([disabled])', expect: [expected('tool_start'), expected('tool_complete', 'preview'), expected('tool_export', 'png')], download: true },
      { name: 'download ZIP', before: [click('#social-image-process')], beforeWaitFor: '#social-image-download-zip:not([disabled])', click: click('#social-image-download-zip'), waitFor: '#social-image-download-zip:not([disabled])', expect: [expected('tool_start'), expected('tool_complete', 'preview'), expected('tool_export', 'zip')], download: true }
    ]
  }
]);

export const publicToolPages = [
  ...publicToolTargets.flatMap(target => [
    { id: target.id, kind: 'tool', slug: target.slug, path: target.path },
    { id: target.id, kind: 'updates', slug: target.slug, path: target.path + 'updates/' }
  ]),
  { id: 'privacy-tools', kind: 'privacy', slug: 'tools', path: '/privacy/tools/' }
];

export const publicToolLinks = publicToolTargets.flatMap(target => [
  { id: target.id, name: target.id + ' updates CTA', path: target.path, selector: '[data-tool-link="tool_update_click"]', event: 'tool_update_click' },
  { id: target.id, name: target.id + ' service CTA', path: target.path, selector: '[data-tool-link="tool_cta_click"]', event: 'tool_cta_click' }
]);
