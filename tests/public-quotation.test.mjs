import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  MAX_ITEMS,
  STORAGE_VERSION,
  TEMPLATES,
  calculateQuote,
  createDraft,
  createEmptyQuote,
  createStore,
  draftName,
  formatMoney,
  getTemplate,
  parseQuoteJSON,
  readDraftStore,
  serializeQuote,
  validateQuoteData,
} from '../web-assets/public-tools/quotation.mjs';
import { tool } from '../tools/public-tools/quotation.mjs';

assert.equal(createEmptyQuote().issuer.company, '');
assert.equal(createEmptyQuote().client.name, '');
assert.equal(createEmptyQuote().taxRate, '');
assert.equal(Object.keys(TEMPLATES).sort().join(','), 'blank,creator,design,general');
assert.equal(getTemplate('creator').template, 'creator');
assert.equal(getTemplate('creator').issuer.email, '');

const exclusive = calculateQuote({
  items: [
    { name: '設計', quantity: 2, unitPrice: 100 },
    { name: '檔案', quantity: 1, unitPrice: 50 },
  ],
  discountMode: 'percent',
  discountValue: 10,
  taxMode: 'exclusive',
  taxRate: 5,
});
assert.equal(exclusive.itemSubtotal, 250);
assert.equal(exclusive.discountAmount, 25);
assert.equal(exclusive.pretaxTotal, 225);
assert.equal(exclusive.tax, 11.25);
assert.equal(exclusive.total, 236.25);

const inclusive = calculateQuote({
  items: [{ name: '含稅服務', quantity: 1, unitPrice: 105 }],
  taxMode: 'inclusive',
  taxRate: 5,
});
assert.equal(inclusive.total, 105);
assert.equal(inclusive.tax, 5);
assert.equal(inclusive.pretaxTotal, 100);

const bounded = calculateQuote({
  items: [{ name: '邊界', quantity: -2, unitPrice: -100 }],
  discountMode: 'fixed',
  discountValue: 999,
  taxRate: 999,
});
assert.equal(bounded.itemSubtotal, 0);
assert.equal(bounded.discountAmount, 0);
assert.equal(bounded.total, 0);

const fiftyLines = calculateQuote({
  items: Array.from({ length: 50 }, (_, index) => ({ name: `項目 ${index + 1}`, quantity: 3, unitPrice: 0.1 })),
  taxMode: 'exclusive',
  taxRate: 7.5,
});
assert.equal(fiftyLines.lineItems.length, 50);
assert.equal(fiftyLines.itemSubtotal, 15);
assert.equal(fiftyLines.tax, 1.13);
assert.equal(fiftyLines.total, 16.13);

assert.equal(formatMoney(100, 'TWD').includes('100'), true);
assert.equal(formatMoney(100, 'JPY').includes('100'), true);

const valid = {
  ...createEmptyQuote(),
  client: { ...createEmptyQuote().client, company: '測試客戶' },
  items: [{ name: '一項服務', description: '可換行的說明', quantity: 1, unitPrice: 100 }],
};
assert.equal(validateQuoteData(valid).ok, true);
assert.equal(parseQuoteJSON(serializeQuote(valid)).client.company, '測試客戶');
assert.throws(() => parseQuoteJSON(JSON.stringify({ ...valid, currency: 'BTC' })), /不支援的幣別/);
assert.throws(() => parseQuoteJSON(JSON.stringify({ ...valid, items: Array.from({ length: MAX_ITEMS + 1 }, () => ({ name: 'x' })) })), /最多/);
assert.equal(validateQuoteData({ ...valid, quoteDate: '2026-99-99' }).ok, false);

const draft = createDraft(valid, '測試草稿', '2026-09-08T00:00:00.000Z');
const store = { ...createStore(), activeDraftId: draft.id, drafts: [draft] };
assert.equal(readDraftStore(JSON.stringify(store)).activeDraftId, draft.id);
assert.equal(draftName(valid), '測試客戶 - 報價草稿');
assert.deepEqual(readDraftStore('{bad json}').drafts, []);
assert.equal(STORAGE_VERSION, 1);

assert.equal(tool.id, 'quotation');
assert.equal(tool.slug, 'quotation-generator');
assert.equal(tool.script, '/web-assets/public-tools/quotation.mjs');
assert.equal((tool.body.match(/<h1\b/gi) || []).length, 0);
assert.ok(tool.body.includes('data-action="print"'));
assert.ok(tool.body.includes('data-action="export-json"'));
assert.ok(tool.body.includes('data-action="clear-form"'));
assert.ok(tool.body.includes('data-quotation-template="general"'));
assert.ok(tool.styles.includes('#tool-workspace'));
assert.ok(tool.styles.includes('thead{display:table-header-group}'));
assert.ok(tool.styles.includes('page-break-inside:avoid'));
assert.ok(!tool.body.includes('82120000080572'));
assert.ok(!tool.body.includes('榛菓行銷有限公司'));

const clientSource = await readFile(new URL('../web-assets/public-tools/quotation.mjs', import.meta.url), 'utf8');
assert.match(clientSource, /typeof document !== 'undefined'/);
assert.match(clientSource, /window\.zgToolEvent\?\.\('tool_complete', \{ format: 'preview' \}\)/);
assert.match(clientSource, /window\.zgToolEvent\?\.\('tool_export', \{ format: 'pdf' \}\)/);
console.log('public quotation contract pass');
