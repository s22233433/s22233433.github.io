export function calculateQuote({ items, serviceRate, payments }) {
  const itemSubtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const serviceFee = Math.round(itemSubtotal * serviceRate);
  const pretaxTotal = itemSubtotal + serviceFee;
  const tax = Math.round(pretaxTotal * 0.05);
  return {
    itemSubtotal,
    serviceFee,
    pretaxTotal,
    tax,
    total: pretaxTotal + tax,
    paymentRate: payments.reduce((sum, rate) => sum + rate, 0),
  };
}

export function createDraft(name, data = {}) {
  return { id: crypto.randomUUID(), name: name.trim() || '未命名報價', data, updatedAt: Date.now() };
}

export function normalizeDrafts(drafts) {
  return Array.isArray(drafts) ? drafts.filter(draft => draft && typeof draft.id === 'string' && typeof draft.name === 'string' && draft.data && typeof draft.data === 'object') : [];
}

export function uniquifyDraftNames(drafts) {
  const names = new Set();
  return normalizeDrafts(drafts).map(draft => {
    const base = draft.name.trim() || '未命名報價'; let name = base; let index = 2;
    while (names.has(name)) name = `${base} ${index++}`;
    names.add(name);
    return { ...draft, name };
  });
}
