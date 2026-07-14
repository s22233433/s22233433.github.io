# 報價單 V1 本機多草稿 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `/mytools/quote-generator/V1/` 提供不影響正式版的手動本機多草稿報價單。

**Architecture:** V1 複用現有原生表單、預覽與列印流程。草稿資料工具放在 V1 的 `quote.mjs`，頁面以 `localStorage` 儲存 versioned store；只有按下儲存、另存或複製時才寫入資料。

**Tech Stack:** 靜態 HTML、原生 JavaScript、`localStorage`、Node assert。

---

### Task 1: 可測試的草稿資料模型

**Files:**
- Create: `mytools/quote-generator/V1/quote.mjs`
- Create: `mytools/quote-generator/V1/quote.test.mjs`

- [x] **Step 1: 寫入會失敗的草稿工具測試**

```js
import { createStore, createDraft, readStore } from './quote.mjs';
assert.equal(createStore().version, 1);
assert.equal(createDraft({ clientName: '客戶 A' }).name, '客戶 A - 報價草稿');
assert.deepEqual(readStore('{bad json}').drafts, []);
```

- [x] **Step 2: 執行測試確認失敗**

Run: `node mytools/quote-generator/V1/quote.test.mjs`

Expected: FAIL because V1 module does not exist.

- [x] **Step 3: 寫入最小資料工具**

```js
export const STORAGE_KEY = 'zhenguocool_quote_generator_drafts';
export const STORAGE_VERSION = 1;
```

工具必須建立 UUID、預設名稱、版本化 store、損壞資料 fallback、複製與重新命名資料。

- [x] **Step 4: 執行草稿資料測試**

Run: `node mytools/quote-generator/V1/quote.test.mjs`

Expected: PASS.

### Task 2: V1 草稿 UI 與表單還原

**Files:**
- Create: `mytools/quote-generator/V1/index.html`
- Modify: `mytools/quote-generator/V1/quote.test.mjs`

- [x] **Step 1: 加入會失敗的 V1 UI 檢查**

```js
const page = await readFile(new URL('./index.html', import.meta.url), 'utf8');
assert.match(page, /id="save-draft"/);
assert.match(page, /id="draft-list"/);
assert.match(page, /beforeunload/);
```

- [x] **Step 2: 執行測試確認失敗**

Run: `node mytools/quote-generator/V1/quote.test.mjs`

Expected: FAIL because V1 page does not exist.

- [x] **Step 3: 建立 V1 頁面與手動草稿操作**

新增收合的草稿管理區塊，提供新增、儲存、另存、重新命名與草稿列表。列表的每一列提供載入、複製、刪除；表單快照由具 `name` 的欄位與合作明細組成，載入時回填後呼叫既有 `render()`。

- [x] **Step 4: 實作未保存與儲存錯誤保護**

切換、載入、新增與刪除前檢查 dirty snapshot；`beforeunload` 只有 dirty 時提醒。`localStorage` parse、格式、ID 與 quota 錯誤都顯示訊息且不清空表單。

- [x] **Step 5: 執行完整靜態檢查**

Run: `node mytools/quote-generator/V1/quote.test.mjs && node --check mytools/quote-generator/V1/quote.mjs && git diff --check`

Expected: all checks exit 0.

### Task 3: 瀏覽器驗證與發布 V1

**Files:**
- Modify: `mytools/quote-generator/V1/index.html`

- [x] **Step 1: 驗證手動草稿流程**

建立兩份草稿、儲存、另存、重新命名、複製、載入與刪除；確認列表客戶名稱與時間正確。

- [x] **Step 2: 驗證韌性流程**

在本機測試頁寫入損壞 JSON，確認頁面可開啟並顯示訊息；修改表單後確認切換與重新載入會要求確認。

- [x] **Step 3: 提交並發布 V1**

```bash
git add mytools/quote-generator/V1 docs/superpowers/plans/2026-07-14-quote-v1-local-drafts.md
git commit -m "feat: add quote generator V1 drafts"
git push origin main
```

Expected: `https://zhenguocool.com/mytools/quote-generator/V1/` opens while `/mytools/quote-generator/` is unchanged.
