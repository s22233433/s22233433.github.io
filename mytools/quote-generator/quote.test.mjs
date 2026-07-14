import assert from 'node:assert/strict';
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
