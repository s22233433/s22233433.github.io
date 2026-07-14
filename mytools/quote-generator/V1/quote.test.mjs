import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { calculateQuote, createDraft, createStore, readStore } from './quote.mjs';

assert.equal(createStore().version, 1);
assert.equal(createDraft({ clientName: '客戶 A' }).name, '客戶 A - 報價草稿');
assert.deepEqual(readStore('{bad json}').drafts, []);
const legacyDraft = createDraft({ fields: { clientName: '舊客戶' }, items: [] });
assert.equal(readStore(JSON.stringify({ activeDraftId: legacyDraft.id, drafts: [legacyDraft] })).activeDraftId, legacyDraft.id);
assert.equal(readStore(JSON.stringify({ version: 1, activeDraftId: 'missing', drafts: [legacyDraft] })).activeDraftId, null);
assert.equal(calculateQuote({ items: [{ unitPrice: 100, quantity: 1 }], serviceRate: 0, payments: [1] }).total, 105);
console.log('quote V1 draft data helpers pass');

const page = await readFile(new URL('./index.html', import.meta.url), 'utf8');
assert.match(page, /id="save-draft"/);
assert.match(page, /id="draft-list"/);
assert.match(page, /beforeunload/);
assert.match(page, /瀏覽器無法讀取本機草稿/);
console.log('quote V1 draft UI is present');
