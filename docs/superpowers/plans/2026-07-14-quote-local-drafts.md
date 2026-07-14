# 本機多草稿 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 讓報價單產生器在同一瀏覽器建立、切換、改名與刪除多份本機草稿。

**Architecture:** 在 `quote.mjs` 放入無 DOM 的草稿正規化工具，讓 Node 測試可驗證資料結構。頁面以 `localStorage` 保存所有草稿與目前草稿 ID；表單輸入、項目新增與刪除後都立即保存。

**Tech Stack:** 原生 HTML、JavaScript、瀏覽器 `localStorage`、Node assert。

---

### Task 1: 草稿資料與頁面操作

**Files:**
- Modify: `mytools/quote-generator/quote.mjs`
- Modify: `mytools/quote-generator/quote.test.mjs`
- Modify: `mytools/quote-generator/index.html`

- [x] **Step 1: 寫入會失敗的草稿資料測試**

```js
import { createDraft, normalizeDrafts } from './quote.mjs';

const draft = createDraft('草稿 A', { clientName: '客戶 A' });
assert.equal(draft.name, '草稿 A');
assert.equal(draft.data.clientName, '客戶 A');
assert.equal(normalizeDrafts([draft])[0].id, draft.id);
```

- [x] **Step 2: 執行測試確認失敗**

Run: `node mytools/quote-generator/quote.test.mjs`

Expected: FAIL with an error that `createDraft` is not exported.

- [x] **Step 3: 加入最小草稿工具與頁面介面**

```js
export function createDraft(name, data = {}) {
  return { id: crypto.randomUUID(), name: name.trim() || '未命名報價', data, updatedAt: Date.now() };
}
```

頁面加入草稿選單、名稱欄位、新增與刪除按鈕；保存時寫入 `localStorage`，載入時將目前草稿資料回填表單與合作項目。

- [x] **Step 4: 執行測試確認通過**

Run: `node mytools/quote-generator/quote.test.mjs && node --check mytools/quote-generator/quote.mjs && git diff --check`

Expected: all checks exit 0.

- [x] **Step 5: 以瀏覽器確認重新載入後可保留資料**

Run: 開啟 `/mytools/quote-generator/`，填入客戶名稱與一筆合作內容，新增草稿並重新載入。

Expected: 可選取兩份草稿，名稱與內容仍存在。

- [x] **Step 6: 提交並發布**

```bash
git add mytools/quote-generator/quote.mjs mytools/quote-generator/quote.test.mjs mytools/quote-generator/index.html
git commit -m "feat: add quote local drafts"
git push origin main
```
