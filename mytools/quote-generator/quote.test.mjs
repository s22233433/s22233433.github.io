import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { calculateQuote } from './quote.mjs';

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

const page = await readFile(new URL('./index.html', import.meta.url), 'utf8');
assert.match(page, /name="showPayments"[^>]*>/);
assert.match(page, /id="preview-payments-section" hidden/);
console.log('payment visibility defaults to hidden');

assert.match(page, /name="ourContact"[^>]*value="Sandy"/);
assert.match(page, /台北富邦銀行012 和平分行 82120000080572/);
console.log('payment contact defaults are present');
