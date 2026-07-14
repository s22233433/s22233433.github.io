import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { calculateQuote, createDraft, normalizeDrafts } from './quote.mjs';

const quote = calculateQuote({
  items: [{ unitPrice: 30000, quantity: 1 }, { unitPrice: 4000, quantity: 4 }],
  serviceRate: 0.15,
  payments: [0.1, 0.48, 0.42],
});

assert.deepEqual(quote, {
  itemSubtotal: 46000,
  serviceFee: 6900,
  pretaxTotal: 52900,
  tax: 2645,
  total: 55545,
  paymentRate: 1,
});
console.log('quote calculations pass');

const draft = createDraft('草稿 A', { clientName: '客戶 A' });
assert.equal(draft.name, '草稿 A');
assert.equal(draft.data.clientName, '客戶 A');
assert.equal(normalizeDrafts([draft])[0].id, draft.id);
console.log('draft data helpers pass');

const page = await readFile(new URL('./index.html', import.meta.url), 'utf8');
assert.match(page, /name="showPayments"[^>]*>/);
assert.match(page, /id="preview-payments-section" hidden/);
console.log('payment visibility defaults to hidden');

assert.match(page, /戶名：榛菓行銷有限公司/);
assert.match(page, /台北富邦銀行012 和平分行 82120000080572/);
assert.match(page, /id="preview-our-contact">Sandy/);
console.log('payment owner and default company contact are present');

assert.match(page, /<h2>費用<\/h2>/);
assert.match(page, /class="payment-divider"/);
assert.match(page, /<h2>付款安排<\/h2>/);
console.log('fees and payments are visually separated');

assert.match(page, /name="ourContact"[^>]*value="Sandy"/);
assert.match(page, /name="ourContactMethod"/);
assert.match(page, /id="preview-our-contact-method"/);
console.log('company contact inputs are present');

assert.ok(page.indexOf('<h2>輸出</h2>') < page.indexOf('<h2>草稿</h2>'));
console.log('draft controls follow the PDF output');

assert.match(page, /structuredClone\(defaultDraftData\)/);
console.log('new drafts start from blank defaults');

assert.match(page, /id="load-draft"/);
assert.match(page, /function uniqueDraftName/);
console.log('draft loading and duplicate-name guards are present');
