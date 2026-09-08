/**
 * Public quotation generator.
 *
 * The calculation and import/export helpers intentionally live beside the
 * browser controller so they can be imported by Node contract tests without
 * touching the DOM.
 */

export const STORAGE_KEY = 'zhenguocool_public_quotation_drafts';
export const STORAGE_VERSION = 1;
export const MAX_ITEMS = 50;
export const MAX_IMPORT_BYTES = 1024 * 1024;

export const CURRENCY_OPTIONS = Object.freeze([
  { value: 'TWD', label: '新台幣（TWD）' },
  { value: 'USD', label: '美元（USD）' },
  { value: 'JPY', label: '日圓（JPY）' },
  { value: 'EUR', label: '歐元（EUR）' },
  { value: 'CNY', label: '人民幣（CNY）' },
]);

const CURRENCY_CODES = new Set(CURRENCY_OPTIONS.map(({ value }) => value));
const TEMPLATE_CODES = new Set(['blank', 'general', 'design', 'creator']);
const TAX_MODES = new Set(['exclusive', 'inclusive']);
const DISCOUNT_MODES = new Set(['percent', 'fixed']);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isDate(value) {
  if (!ISO_DATE.test(String(value ?? ''))) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === String(value);
}

const FIELD_LIMITS = Object.freeze({
  short: 160,
  medium: 500,
  long: 4000,
  logo: 900000,
});

function text(value, limit = FIELD_LIMITS.medium) {
  return String(value ?? '').trim().slice(0, limit);
}

function imageData(value) {
  return typeof value === 'string' && /^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(value) ? value : '';
}

function number(value, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
  const parsed = typeof value === 'number' ? value : Number(String(value ?? '').replace(/,/g, '').trim());
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(max, Math.max(min, parsed));
}

export function roundMoney(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.round((parsed + Number.EPSILON) * 100) / 100;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function createEmptyItem() {
  return { name: '', description: '', quantity: 1, unitPrice: '', note: '' };
}

export function createEmptyQuote() {
  return {
    version: STORAGE_VERSION,
    template: 'blank',
    quoteNumber: '',
    quoteDate: '',
    validUntil: '',
    currency: 'TWD',
    taxMode: 'exclusive',
    taxRate: '',
    discountMode: 'percent',
    discountValue: '',
    issuer: {
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      logoData: '',
    },
    client: {
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
    },
    items: [createEmptyItem()],
    notes: '',
  };
}

export function normalizeItem(item = {}) {
  return {
    name: text(item.name, FIELD_LIMITS.short),
    description: text(item.description ?? item.spec, FIELD_LIMITS.medium),
    quantity: number(item.quantity, { max: 1000000 }),
    unitPrice: number(item.unitPrice, { max: 1000000000000 }),
    note: text(item.note, FIELD_LIMITS.medium),
  };
}

function normalizePerson(person = {}) {
  return {
    name: text(person.name, FIELD_LIMITS.short),
    company: text(person.company, FIELD_LIMITS.short),
    email: text(person.email, FIELD_LIMITS.short),
    phone: text(person.phone, FIELD_LIMITS.short),
    address: text(person.address, FIELD_LIMITS.medium),
  };
}

export function normalizeQuoteData(source = {}) {
  const data = source && typeof source === 'object' ? source : {};
  const issuer = data.issuer ?? data.supplier ?? {};
  const client = data.client ?? {};
  const items = Array.isArray(data.items) ? data.items.slice(0, MAX_ITEMS).map(normalizeItem) : [];
  const currency = CURRENCY_CODES.has(data.currency) ? data.currency : 'TWD';
  const taxMode = TAX_MODES.has(data.taxMode) ? data.taxMode : 'exclusive';
  const discountMode = DISCOUNT_MODES.has(data.discountMode) ? data.discountMode : 'percent';

  return {
    version: STORAGE_VERSION,
    template: TEMPLATE_CODES.has(data.template) ? data.template : 'blank',
    quoteNumber: text(data.quoteNumber, FIELD_LIMITS.short),
    quoteDate: text(data.quoteDate, FIELD_LIMITS.short),
    validUntil: text(data.validUntil, FIELD_LIMITS.short),
    currency,
    taxMode,
    taxRate: number(data.taxRate, { max: 100 }),
    discountMode,
    discountValue: number(data.discountValue, { max: 1000000000000 }),
    issuer: { ...normalizePerson(issuer), logoData: imageData(text(issuer.logoData, FIELD_LIMITS.logo)) },
    client: normalizePerson(client),
    items,
    notes: text(data.notes, FIELD_LIMITS.long),
  };
}

function sourceFieldTooLong(source, path, limit, errors) {
  if (source === undefined || source === null) return;
  if (String(source).length > limit) errors.push(`${path} 超過 ${limit} 字元。`);
}

export function validateQuoteData(source) {
  const errors = [];
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return { ok: false, valid: false, errors: ['報價資料必須是 JSON 物件。'], data: createEmptyQuote() };
  }

  if (source.items !== undefined && !Array.isArray(source.items)) errors.push('items 必須是陣列。');
  if (Array.isArray(source.items) && source.items.length > MAX_ITEMS) errors.push(`明細最多 ${MAX_ITEMS} 筆。`);
  if (source.currency !== undefined && !CURRENCY_CODES.has(source.currency)) errors.push('不支援的幣別。');
  if (source.taxMode !== undefined && !TAX_MODES.has(source.taxMode)) errors.push('稅額模式只能是含稅或未稅。');
  if (source.discountMode !== undefined && !DISCOUNT_MODES.has(source.discountMode)) errors.push('折扣模式只能是百分比或固定金額。');
  if (source.quoteDate && !isDate(source.quoteDate)) errors.push('報價日期格式應為 YYYY-MM-DD 的有效日期。');
  if (source.validUntil && !isDate(source.validUntil)) errors.push('有效日期格式應為 YYYY-MM-DD 的有效日期。');

  const taxRate = Number(source.taxRate);
  if (source.taxRate !== undefined && source.taxRate !== '' && (!Number.isFinite(taxRate) || taxRate < 0 || taxRate > 100)) {
    errors.push('稅率需介於 0 至 100。');
  }
  const discountValue = Number(source.discountValue);
  if (source.discountValue !== undefined && source.discountValue !== '' && (!Number.isFinite(discountValue) || discountValue < 0)) {
    errors.push('折扣不可為負數。');
  }

  const people = [
    ['issuer', source.issuer ?? source.supplier],
    ['client', source.client],
  ];
  for (const [prefix, person] of people) {
    if (person !== undefined && person !== null && (typeof person !== 'object' || Array.isArray(person))) {
      errors.push(`${prefix} 必須是 JSON 物件。`);
      continue;
    }
    if (!person) continue;
    for (const key of ['name', 'company', 'email', 'phone']) sourceFieldTooLong(person[key], `${prefix}.${key}`, FIELD_LIMITS.short, errors);
    sourceFieldTooLong(person.address, `${prefix}.address`, FIELD_LIMITS.medium, errors);
    if (prefix === 'issuer') {
      sourceFieldTooLong(person.logoData, 'issuer.logoData', FIELD_LIMITS.logo, errors);
      if (person.logoData && !imageData(person.logoData)) errors.push('issuer.logoData 必須是本機圖片資料。');
    }
  }
  for (const [key, limit] of [['quoteNumber', FIELD_LIMITS.short], ['quoteDate', FIELD_LIMITS.short], ['validUntil', FIELD_LIMITS.short], ['notes', FIELD_LIMITS.long]]) {
    sourceFieldTooLong(source[key], key, limit, errors);
  }
  if (Array.isArray(source.items)) {
    source.items.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        errors.push(`第 ${index + 1} 筆明細格式錯誤。`);
        return;
      }
      sourceFieldTooLong(item.name, `items[${index}].name`, FIELD_LIMITS.short, errors);
      sourceFieldTooLong(item.description ?? item.spec, `items[${index}].description`, FIELD_LIMITS.medium, errors);
      sourceFieldTooLong(item.note, `items[${index}].note`, FIELD_LIMITS.medium, errors);
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unitPrice);
      if ((item.quantity !== undefined && item.quantity !== '' && !Number.isFinite(quantity)) || (item.unitPrice !== undefined && item.unitPrice !== '' && !Number.isFinite(unitPrice))) {
        errors.push(`第 ${index + 1} 筆明細數量或單價格式錯誤。`);
      } else if (quantity < 0 || unitPrice < 0) errors.push(`第 ${index + 1} 筆明細不可為負數。`);
    });
  }

  const data = normalizeQuoteData(source);
  return { ok: errors.length === 0, valid: errors.length === 0, errors, data };
}

export function isValidQuoteData(source) {
  return validateQuoteData(source).ok;
}

export function calculateQuote({
  items = [],
  discountMode = 'percent',
  discountValue = 0,
  taxMode = 'exclusive',
  taxRate = 0,
} = {}) {
  const normalizedItems = Array.isArray(items) ? items.slice(0, MAX_ITEMS).map(normalizeItem) : [];
  const lineItems = normalizedItems.map((item) => ({ ...item, lineTotal: roundMoney(item.unitPrice * item.quantity) }));
  const itemSubtotal = roundMoney(lineItems.reduce((sum, item) => sum + item.lineTotal, 0));
  const safeDiscountMode = DISCOUNT_MODES.has(discountMode) ? discountMode : 'percent';
  const safeDiscountValue = number(discountValue, { max: 1000000000000 });
  const discountAmount = roundMoney(Math.min(
    itemSubtotal,
    safeDiscountMode === 'fixed' ? safeDiscountValue : itemSubtotal * Math.min(100, safeDiscountValue) / 100,
  ));
  const taxableSubtotal = roundMoney(Math.max(0, itemSubtotal - discountAmount));
  const safeTaxRate = number(taxRate, { max: 100 });
  const safeTaxMode = TAX_MODES.has(taxMode) ? taxMode : 'exclusive';
  const tax = safeTaxMode === 'inclusive' && safeTaxRate > 0
    ? roundMoney(taxableSubtotal - taxableSubtotal / (1 + safeTaxRate / 100))
    : safeTaxMode === 'exclusive'
      ? roundMoney(taxableSubtotal * safeTaxRate / 100)
      : 0;
  const total = safeTaxMode === 'inclusive' ? taxableSubtotal : roundMoney(taxableSubtotal + tax);
  const pretaxTotal = safeTaxMode === 'inclusive' ? roundMoney(total - tax) : taxableSubtotal;

  return {
    lineItems,
    items: lineItems,
    itemSubtotal,
    subtotal: itemSubtotal,
    discountAmount,
    discount: discountAmount,
    taxableSubtotal,
    pretaxTotal,
    tax,
    total,
    taxMode: safeTaxMode,
    taxRate: safeTaxRate,
    discountMode: safeDiscountMode,
  };
}

export function formatMoney(value, currency = 'TWD') {
  const safeCurrency = CURRENCY_CODES.has(currency) ? currency : 'TWD';
  const maximumFractionDigits = safeCurrency === 'JPY' ? 0 : 2;
  try {
    const formatted = new Intl.NumberFormat('zh-Hant-TW', {
      style: 'currency',
      currency: safeCurrency,
      currencyDisplay: 'symbol',
      maximumFractionDigits,
    }).format(Number(value) || 0);
    return safeCurrency === 'TWD' && !formatted.includes('NT') ? formatted.replace('$', 'NT$') : formatted;
  } catch {
    return `${safeCurrency} ${roundMoney(value).toLocaleString('zh-Hant-TW')}`;
  }
}

export function formatDate(value) {
  if (!isDate(value)) return '—';
  try {
    return new Intl.DateTimeFormat('zh-Hant-TW', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(`${value}T00:00:00`));
  } catch {
    return String(value);
  }
}

function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `draft-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createStore() {
  return { version: STORAGE_VERSION, activeDraftId: null, drafts: [] };
}

export function draftName(data, fallback = '未命名報價草稿') {
  const normalized = normalizeQuoteData(data);
  const subject = normalized.client.company || normalized.client.name || normalized.issuer.company || normalized.issuer.name;
  return subject ? `${subject} - 報價草稿` : fallback;
}

export function createDraft(data, name = draftName(data), now = new Date().toISOString()) {
  return {
    id: makeId(),
    name: text(name, FIELD_LIMITS.short) || '未命名報價草稿',
    createdAt: now,
    updatedAt: now,
    data: normalizeQuoteData(data),
  };
}

export function copyDraft(draft, name, now = new Date().toISOString()) {
  return createDraft(clone(draft?.data ?? createEmptyQuote()), name || `${draft?.name || '報價草稿'} 複本`, now);
}

export function readDraftStore(raw) {
  if (raw === null || raw === undefined || raw === '') return createStore();
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!parsed || !Array.isArray(parsed.drafts)) return { ...createStore(), error: '找不到可用的草稿資料。' };
    if (parsed.version !== undefined && parsed.version !== STORAGE_VERSION) return { ...createStore(), error: '草稿資料版本無法讀取。' };
    const drafts = parsed.drafts.filter((draft) => {
      if (!draft || typeof draft.id !== 'string' || typeof draft.name !== 'string' || !draft.data || typeof draft.data !== 'object') return false;
      return validateQuoteData(draft.data).ok;
    }).map((draft) => ({
      id: draft.id,
      name: text(draft.name, FIELD_LIMITS.short) || '未命名報價草稿',
      createdAt: typeof draft.createdAt === 'string' ? draft.createdAt : new Date().toISOString(),
      updatedAt: typeof draft.updatedAt === 'string' ? draft.updatedAt : new Date().toISOString(),
      data: normalizeQuoteData(draft.data),
    }));
    const activeDraftId = drafts.some((draft) => draft.id === parsed.activeDraftId) ? parsed.activeDraftId : null;
    return { version: STORAGE_VERSION, activeDraftId, drafts };
  } catch {
    return { ...createStore(), error: '草稿資料損壞，已略過舊資料。' };
  }
}

export function serializeDraftStore(store) {
  const parsed = readDraftStore(store);
  return JSON.stringify({ version: STORAGE_VERSION, activeDraftId: parsed.activeDraftId, drafts: parsed.drafts }, null, 2);
}

export function serializeQuote(data) {
  const result = validateQuoteData(data);
  if (!result.ok) {
    const error = new Error(result.errors.join(' '));
    error.issues = result.errors;
    throw error;
  }
  return JSON.stringify(result.data, null, 2);
}

export function parseQuoteJSON(raw, { maxBytes = MAX_IMPORT_BYTES } = {}) {
  if (typeof raw !== 'string') throw new TypeError('匯入內容必須是文字。');
  const bytes = typeof TextEncoder === 'function' ? new TextEncoder().encode(raw).length : raw.length;
  if (bytes > maxBytes) throw new Error(`匯入檔案不可超過 ${Math.round(maxBytes / 1024)} KB。`);
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('JSON 格式無法讀取。');
  }
  const result = validateQuoteData(parsed);
  if (!result.ok) {
    const error = new Error(`報價資料驗證失敗：${result.errors.join(' ')}`);
    error.issues = result.errors;
    throw error;
  }
  return result.data;
}

function templateData(overrides) {
  return normalizeQuoteData({ ...createEmptyQuote(), ...overrides });
}

export const TEMPLATES = Object.freeze({
  blank: {
    label: '空白報價',
    description: '從零開始填寫，不帶入示例資料。',
    data: createEmptyQuote(),
  },
  general: {
    label: '一般接案',
    description: '虛構的品牌顧問與專案服務示例。',
    data: templateData({
      template: 'general',
      issuer: { name: '示例工作室', company: '示例創意工作室', email: '', phone: '', address: '', logoData: '' },
      client: { name: '示例客戶 A', company: '示例品牌 A', email: '', phone: '', address: '' },
      quoteNumber: 'DEMO-001',
      items: [
        { name: '品牌策略工作坊', description: '半日工作坊與會後重點整理', quantity: 1, unitPrice: 18000, note: '' },
        { name: '執行建議書', description: '簡報格式，含一次修訂', quantity: 1, unitPrice: 12000, note: '' },
      ],
      taxRate: 5,
      discountValue: 0,
    }),
  },
  design: {
    label: '設計製作',
    description: '虛構的視覺設計與製作示例。',
    data: templateData({
      template: 'design',
      issuer: { name: '示例設計', company: '範例設計社', email: '', phone: '', address: '', logoData: '' },
      client: { name: '示例客戶 B', company: '示例品牌 B', email: '', phone: '', address: '' },
      quoteNumber: 'DEMO-002',
      items: [
        { name: '主視覺設計', description: '社群與網站橫幅延伸一組', quantity: 1, unitPrice: 22000, note: '含兩款方向提案' },
        { name: '社群版型', description: '可編輯版型三款', quantity: 3, unitPrice: 4500, note: '' },
      ],
      taxRate: 5,
      discountValue: 5,
    }),
  },
  creator: {
    label: '網紅合作',
    description: '虛構的創作者合作執行示例。',
    data: templateData({
      template: 'creator',
      issuer: { name: '示例行銷團隊', company: '範例內容工作室', email: '', phone: '', address: '', logoData: '' },
      client: { name: '示例客戶 C', company: '示例品牌 C', email: '', phone: '', address: '' },
      quoteNumber: 'DEMO-003',
      items: [
        { name: '短影音創作者合作', description: '虛構示例：短影音一支，含一次修改', quantity: 2, unitPrice: 16000, note: '發布時間另行確認' },
        { name: '合作執行管理', description: '名單整理、溝通與交付追蹤', quantity: 1, unitPrice: 12000, note: '' },
      ],
      taxRate: 5,
      discountValue: 0,
    }),
  },
});

export function getTemplate(code) {
  return clone(TEMPLATES[TEMPLATE_CODES.has(code) ? code : 'blank'].data);
}

function dateValue(value) {
  return value && isDate(value) ? String(value) : '';
}

const safeImageData = imageData;

export function initQuotationTool() {
  const form = document.querySelector('#quotation-form');
  const host = form?.closest('.quotation-tool');
  if (!form || !host || host.dataset.ready === 'true') return;
  host.dataset.ready = 'true';

  const itemsHost = host.querySelector('#quotation-items');
  const itemTemplate = host.querySelector('#quotation-item-template') || document.querySelector('#quotation-item-template');
  const status = host.querySelector('#quotation-status');
  const draftList = host.querySelector('#quotation-drafts');
  const storage = (() => {
    try { return window.localStorage; } catch { return null; }
  })();
  let store = readDraftStore(storage?.getItem(STORAGE_KEY));
  let activeDraft = null;
  let logoData = '';

  function showStatus(message, kind = 'info') {
    status.textContent = message;
    status.hidden = !message;
    status.className = `notice${kind === 'error' ? ' is-error' : kind === 'success' ? ' is-success' : ''}`;
  }

  function field(name) {
    return form.elements[name];
  }

  function fieldValue(name) {
    return String(field(name)?.value ?? '').trim();
  }

  function numericField(name) {
    return field(name)?.value === '' ? '' : number(field(name)?.value);
  }

  function itemValues() {
    return [...itemsHost.querySelectorAll('.quotation-item')].map((item) => normalizeItem({
      name: item.querySelector('[data-field="name"]')?.value,
      description: item.querySelector('[data-field="description"]')?.value,
      quantity: item.querySelector('[data-field="quantity"]')?.value,
      unitPrice: item.querySelector('[data-field="unitPrice"]')?.value,
      note: item.querySelector('[data-field="note"]')?.value,
    }));
  }

  function readForm() {
    return normalizeQuoteData({
      template: fieldValue('template'),
      quoteNumber: fieldValue('quoteNumber'),
      quoteDate: dateValue(fieldValue('quoteDate')),
      validUntil: dateValue(fieldValue('validUntil')),
      currency: fieldValue('currency'),
      taxMode: fieldValue('taxMode'),
      taxRate: numericField('taxRate'),
      discountMode: fieldValue('discountMode'),
      discountValue: numericField('discountValue'),
      issuer: {
        name: fieldValue('issuerName'),
        company: fieldValue('issuerCompany'),
        email: fieldValue('issuerEmail'),
        phone: fieldValue('issuerPhone'),
        address: fieldValue('issuerAddress'),
        logoData,
      },
      client: {
        name: fieldValue('clientName'),
        company: fieldValue('clientCompany'),
        email: fieldValue('clientEmail'),
        phone: fieldValue('clientPhone'),
        address: fieldValue('clientAddress'),
      },
      items: itemValues(),
      notes: fieldValue('notes'),
    });
  }

  function setValue(name, value) {
    const input = field(name);
    if (input) input.value = value ?? '';
  }

  function addItem(item = createEmptyItem()) {
    const node = itemTemplate.content.firstElementChild.cloneNode(true);
    for (const key of ['name', 'description', 'quantity', 'unitPrice', 'note']) {
      const input = node.querySelector(`[data-field="${key}"]`);
      if (input) input.value = item[key] ?? '';
    }
    node.querySelector('[data-action="remove-item"]').addEventListener('click', () => {
      if (itemsHost.children.length === 1) {
        for (const input of node.querySelectorAll('input')) input.value = '';
        node.querySelector('[data-field="quantity"]').value = '1';
      } else node.remove();
      renderPreview();
    });
    node.addEventListener('input', renderPreview);
    itemsHost.append(node);
  }

  function setLogo(value) {
    logoData = safeImageData(value);
    const image = host.querySelector('#preview-logo');
    if (image) {
      image.hidden = !logoData;
      image.src = logoData;
    }
  }

  function applyData(source) {
    const data = normalizeQuoteData(source);
    setValue('template', data.template);
    setValue('quoteNumber', data.quoteNumber);
    setValue('quoteDate', data.quoteDate);
    setValue('validUntil', data.validUntil);
    setValue('currency', data.currency);
    setValue('taxMode', data.taxMode);
    setValue('taxRate', data.taxRate === 0 && data.taxRate !== source?.taxRate ? '' : data.taxRate);
    setValue('discountMode', data.discountMode);
    setValue('discountValue', data.discountValue === 0 && data.discountValue !== source?.discountValue ? '' : data.discountValue);
    setValue('issuerName', data.issuer.name);
    setValue('issuerCompany', data.issuer.company);
    setValue('issuerEmail', data.issuer.email);
    setValue('issuerPhone', data.issuer.phone);
    setValue('issuerAddress', data.issuer.address);
    setValue('clientName', data.client.name);
    setValue('clientCompany', data.client.company);
    setValue('clientEmail', data.client.email);
    setValue('clientPhone', data.client.phone);
    setValue('clientAddress', data.client.address);
    setValue('notes', data.notes);
    setLogo(data.issuer.logoData);
    itemsHost.replaceChildren();
    (data.items.length ? data.items : [createEmptyItem()]).forEach(addItem);
    host.querySelectorAll('[data-quotation-template]').forEach((button) => button.classList.toggle('is-selected', button.dataset.quotationTemplate === data.template));
    renderPreview();
  }

  function textInto(selector, value, fallback = '—') {
    const element = host.querySelector(selector);
    if (element) element.textContent = value || fallback;
  }

  function renderPreview() {
    const data = readForm();
    const result = calculateQuote(data);
    const preview = host.querySelector('#quotation-preview');
    if (!preview) return;
    textInto('#preview-issuer-name', data.issuer.name || data.issuer.company);
    textInto('#preview-issuer-company', data.issuer.company, '');
    textInto('#preview-client-name', data.client.name || data.client.company);
    textInto('#preview-client-company', data.client.company, '');
    textInto('#preview-quote-number', data.quoteNumber);
    textInto('#preview-quote-date', formatDate(data.quoteDate));
    textInto('#preview-valid-until', formatDate(data.validUntil));
    textInto('#preview-tax-mode', data.taxMode === 'inclusive' ? `含稅（${data.taxRate || 0}%）` : `未稅＋${data.taxRate || 0}%`);
    textInto('#preview-notes', data.notes, '—');
    const logo = preview.querySelector('#preview-logo');
    if (logo) {
      logo.hidden = !data.issuer.logoData;
      logo.src = data.issuer.logoData;
    }
    const rows = preview.querySelector('#preview-items');
    rows.replaceChildren();
    const visibleItems = result.lineItems.filter((item) => item.name || item.description || item.unitPrice > 0 || item.note);
    if (!visibleItems.length) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 5;
      cell.className = 'preview-empty';
      cell.textContent = '尚未填寫明細';
      row.append(cell);
      rows.append(row);
    } else {
      visibleItems.forEach((item) => {
        const row = document.createElement('tr');
        for (const value of [item.name || '—', item.description || '—', item.quantity || 0, formatMoney(item.unitPrice, data.currency), formatMoney(item.lineTotal, data.currency)]) {
          const cell = document.createElement('td');
          cell.textContent = value;
          row.append(cell);
        }
        if (item.note) {
          const note = document.createElement('div');
          note.className = 'preview-line-note';
          note.textContent = item.note;
          row.firstElementChild.append(note);
        }
        row.children[2].className = 'number';
        row.children[3].className = 'number';
        row.children[4].className = 'number';
        rows.append(row);
      });
    }
    textInto('#preview-subtotal', formatMoney(result.itemSubtotal, data.currency), '');
    textInto('#preview-discount', result.discountAmount ? `− ${formatMoney(result.discountAmount, data.currency)}` : formatMoney(0, data.currency), '');
    textInto('#preview-pretax', formatMoney(result.pretaxTotal, data.currency), '');
    textInto('#preview-tax', formatMoney(result.tax, data.currency), '');
    textInto('#preview-total', formatMoney(result.total, data.currency), '');
    const discountLabel = preview.querySelector('#preview-discount-label');
    if (discountLabel) discountLabel.textContent = data.discountMode === 'fixed' ? '折扣（固定）' : `折扣（${data.discountValue || 0}%）`;
    const currencyLabel = preview.querySelector('#preview-currency');
    if (currencyLabel) currencyLabel.textContent = data.currency;
    const modeHint = host.querySelector('#quotation-tax-hint');
    if (modeHint) modeHint.textContent = data.taxMode === 'inclusive' ? '總價已包含稅額，系統會拆出稅額供參考。' : '稅額會加在折扣後的小計上。';
  }

  function writeStore() {
    if (!storage) {
      showStatus('瀏覽器不允許本機草稿儲存；目前資料仍可預覽與列印。', 'error');
      return false;
    }
    try {
      storage.setItem(STORAGE_KEY, serializeDraftStore(store));
      return true;
    } catch {
      showStatus('草稿未儲存：瀏覽器空間不足或已禁止本機儲存。', 'error');
      return false;
    }
  }

  function stamp(value) {
    try { return new Intl.DateTimeFormat('zh-Hant-TW', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)); } catch { return ''; }
  }

  function renderDrafts() {
    draftList.replaceChildren();
    if (!store.drafts.length) {
      const empty = document.createElement('p');
      empty.className = 'draft-empty';
      empty.textContent = '尚無本機草稿。儲存後只會留在這個瀏覽器。';
      draftList.append(empty);
      return;
    }
    store.drafts.forEach((draft) => {
      const row = document.createElement('div');
      row.className = 'draft-row';
      const meta = document.createElement('span');
      meta.textContent = `${draft.name}｜${stamp(draft.updatedAt)}`;
      const actions = document.createElement('span');
      for (const [label, action] of [['載入', 'load-draft'], ['刪除', 'delete-draft']]) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'text-button';
        button.dataset.action = action;
        button.dataset.id = draft.id;
        button.textContent = label;
        actions.append(button);
      }
      row.append(meta, actions);
      draftList.append(row);
    });
  }

  function saveDraft(asNew = false) {
    const data = readForm();
    if (asNew || !activeDraft) {
      const name = window.prompt('草稿名稱（可留白）', draftName(data));
      if (name === null) return;
      activeDraft = createDraft(data, name || draftName(data));
      store.drafts.unshift(activeDraft);
    } else {
      activeDraft.data = data;
      activeDraft.updatedAt = new Date().toISOString();
    }
    store.activeDraftId = activeDraft.id;
    if (writeStore()) {
      renderDrafts();
      showStatus(`已儲存「${activeDraft.name}」。`, 'success');
    }
  }

  function clearForm() {
    if (activeDraft && !window.confirm('清空目前內容？已儲存草稿不會被刪除。')) return;
    activeDraft = null;
    store.activeDraftId = null;
    applyData(createEmptyQuote());
    showStatus('已清空目前報價；尚未儲存。', 'success');
  }

  function validateForOutput() {
    const data = readForm();
    const result = validateQuoteData(data);
    const hasNamedItem = data.items.some((item) => item.name && item.quantity > 0);
    if (!result.ok) {
      showStatus(result.errors.join(' '), 'error');
      return null;
    }
    if (!hasNamedItem) {
      showStatus('請至少填寫一筆明細名稱與數量，再產生報價單。', 'error');
      return null;
    }
    return data;
  }

  function generatePreview() {
    const data = validateForOutput();
    if (!data) return false;
    renderPreview();
    try { window.zgToolEvent?.('tool_complete', { format: 'preview' }); } catch {}
    showStatus('報價預覽已更新；資料仍只留在本機。', 'success');
    return true;
  }

  function startPrint() {
    if (!generatePreview()) return;
    try { window.zgToolEvent?.('tool_export', { format: 'pdf' }); } catch {}
    window.print();
  }

  function downloadJSON() {
    const data = readForm();
    let content;
    try { content = serializeQuote(data); } catch (error) { showStatus(error.message, 'error'); return; }
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.quoteNumber || 'quotation'}.json`;
    link.click();
    URL.revokeObjectURL(url);
    try { window.zgToolEvent?.('tool_export', { format: 'json' }); } catch {}
    showStatus('JSON 草稿已匯出。', 'success');
  }

  async function importJSON(file) {
    if (!file) return;
    try {
      const data = parseQuoteJSON(await file.text());
      activeDraft = null;
      applyData(data);
      showStatus('JSON 草稿已匯入，請確認內容後再儲存。', 'success');
    } catch (error) {
      showStatus(error.message || 'JSON 草稿匯入失敗。', 'error');
    }
  }

  host.querySelectorAll('[data-quotation-template]').forEach((button) => button.addEventListener('click', () => {
    const template = getTemplate(button.dataset.quotationTemplate);
    if (readForm().items.some((item) => item.name || item.description || item.unitPrice) && !window.confirm('套用模板會取代目前欄位內容，確定繼續嗎？')) return;
    applyData(template);
    showStatus(`${TEMPLATES[button.dataset.quotationTemplate].label}模板已套用；資料為虛構示例。`, 'success');
  }));
  host.querySelector('[data-action="add-item"]').addEventListener('click', () => {
    if (itemsHost.children.length >= MAX_ITEMS) return showStatus(`明細最多 ${MAX_ITEMS} 筆。`, 'error');
    addItem();
    renderPreview();
  });
  host.querySelector('[data-action="generate"]').addEventListener('click', generatePreview);
  host.querySelector('[data-action="print"]').addEventListener('click', startPrint);
  host.querySelector('[data-action="save-draft"]').addEventListener('click', () => saveDraft(false));
  host.querySelector('[data-action="save-as-draft"]').addEventListener('click', () => saveDraft(true));
  host.querySelector('[data-action="clear-form"]').addEventListener('click', clearForm);
  host.querySelector('[data-action="export-json"]').addEventListener('click', downloadJSON);
  host.querySelector('[data-action="clear-drafts"]').addEventListener('click', () => {
    if (!store.drafts.length || !window.confirm('刪除所有本機草稿？此操作無法復原。')) return;
    store = createStore();
    activeDraft = null;
    try { storage?.removeItem(STORAGE_KEY); } catch {}
    renderDrafts();
    showStatus('本機草稿已清除。', 'success');
  });
  host.querySelector('[data-action="import-json"]').addEventListener('change', (event) => {
    importJSON(event.target.files?.[0]);
    event.target.value = '';
  });
  host.querySelector('[data-action="logo-file"]').addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return showStatus('Logo 必須是圖片檔。', 'error');
    if (file.size > 650 * 1024) return showStatus('Logo 檔案請控制在 650 KB 以內。', 'error');
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setLogo(reader.result);
      renderPreview();
      showStatus('Logo 已載入本機預覽。', 'success');
    });
    reader.addEventListener('error', () => showStatus('Logo 無法讀取。', 'error'));
    reader.readAsDataURL(file);
  });
  host.querySelector('[data-action="clear-logo"]').addEventListener('click', () => {
    setLogo('');
    const input = host.querySelector('[data-action="logo-file"]');
    if (input) input.value = '';
    renderPreview();
  });
  draftList.addEventListener('click', (eventTarget) => {
    const button = eventTarget.target.closest('[data-action]');
    if (!button) return;
    const draft = store.drafts.find((item) => item.id === button.dataset.id);
    if (!draft) return;
    if (button.dataset.action === 'load-draft') {
      activeDraft = draft;
      store.activeDraftId = draft.id;
      applyData(draft.data);
      showStatus(`已載入「${draft.name}」。`, 'success');
    }
    if (button.dataset.action === 'delete-draft' && window.confirm(`刪除「${draft.name}」？`)) {
      store.drafts = store.drafts.filter((item) => item.id !== draft.id);
      if (activeDraft?.id === draft.id) activeDraft = null;
      store.activeDraftId = activeDraft?.id || null;
      writeStore();
      renderDrafts();
      showStatus('草稿已刪除。', 'success');
    }
  });
  form.addEventListener('input', renderPreview);
  form.addEventListener('change', renderPreview);

  applyData(createEmptyQuote());
  if (store.error) showStatus(store.error, 'error');
  renderDrafts();
  if (store.activeDraftId) {
    const draft = store.drafts.find((item) => item.id === store.activeDraftId);
    if (draft) {
      activeDraft = draft;
      applyData(draft.data);
    }
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initQuotationTool, { once: true });
  else initQuotationTool();
}
