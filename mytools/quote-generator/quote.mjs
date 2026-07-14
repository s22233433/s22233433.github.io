export const STORAGE_KEY = 'zhenguocool_quote_generator_drafts';
export const STORAGE_VERSION = 1;

export function calculateQuote({ items, serviceRate, serviceMode = 'percent', payments }) {
  const itemSubtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const serviceFee = Math.round(serviceMode === 'fixed' ? serviceRate : itemSubtotal * serviceRate);
  const pretaxTotal = itemSubtotal + serviceFee;
  const tax = Math.round(pretaxTotal * 0.05);
  return { itemSubtotal, serviceFee, pretaxTotal, tax, total: pretaxTotal + tax, paymentRate: payments.reduce((sum, rate) => sum + rate, 0) };
}

export function createStore() { return { version: STORAGE_VERSION, activeDraftId: null, drafts: [] }; }

export function draftName(data, fallback = '未命名草稿') {
  const project = String(data?.fields?.projectName || data?.projectName || '').trim();
  const client = String(data?.fields?.clientName || data?.clientName || '').trim();
  return project ? `${project} - 報價草稿` : client ? `${client} - 報價草稿` : fallback;
}

export function createDraft(data, name = draftName(data), now = new Date().toISOString()) {
  return { id: crypto.randomUUID(), name: String(name).trim() || '未命名草稿', createdAt: now, updatedAt: now, data };
}

export function copyDraft(draft, name, now = new Date().toISOString()) { return createDraft(structuredClone(draft.data), name || `${draft.name} 複本`, now); }

export function readStore(raw) {
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!parsed || !Array.isArray(parsed.drafts)) return { ...createStore(), error: '找不到可用的草稿資料。' };
    if (parsed.version !== undefined && parsed.version !== STORAGE_VERSION) return { ...createStore(), error: '草稿資料版本無法讀取。' };
    const drafts = parsed.drafts.filter(draft => draft && typeof draft.id === 'string' && typeof draft.name === 'string' && draft.data && typeof draft.data === 'object');
    const activeDraftId = drafts.some(draft => draft.id === parsed.activeDraftId) ? parsed.activeDraftId : null;
    return { version: STORAGE_VERSION, activeDraftId, drafts };
  } catch { return { ...createStore(), error: '草稿資料損壞，已略過舊資料。' }; }
}
