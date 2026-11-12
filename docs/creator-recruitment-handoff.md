# 台灣直播主合作意願登記

## 上線範圍（2026-11-12）

使用者指定由「榛菓行銷有限公司」收集合作意願。本次公開內容不包含合作方名稱、原始圖片、待遇及分潤。原始素材保留於本機，未列入發布檔案。

- 公開頁：`https://zhenguocool.com/tw-creator-recruitment/`
- 名單後台：`https://staff.zhenguocool.com/creator-recruitment/`
- 公開 API：`/api/creator-recruitment/config`、`/api/creator-recruitment/submit`
- 收件 Worker：`zhenguocool-creator-recruitment`，經 Pages service binding 呼叫。
- 既有 D1 `zhenguocool-website-forms` 新增獨立 `creator_applications`、`creator_rate_limits`、`creator_audit`；不修改既有客戶／人才資料。
- 後台沿用員工站 Cloudflare Access，另驗證 JWT 簽章、issuer、audience 與管理員 Email。CSV 匯出有相同權限與公式注入保護。
- 保存期限 180 天；每日 UTC 19:00（台北 03:00）清除到期資料與限流紀錄。復原備份依 Cloudflare 方案最多保留 30 天；若使用備份復原，須先清除已撤回與到期資料，再開放後台。
- 不向外部合作夥伴或 Google Sheet 同步，不發送報名通知郵件。管理者可由後台查看與匯出名單。
- 正式 Turnstile widget 限 `zhenguocool.com`。金鑰與限流 salt 只透過 Wrangler 寫入 Worker secret，不存在 repository 或公開檔案中。

## SEO 與追蹤

繁中獨立頁使用唯一 title／description、canonical、WebPage／BreadcrumbList／FAQPage 結構化資料；公開索引並加入 sitemap。首頁及人才頁提供內部連結。沒有套用不符合本次合作意願登記的 JobPosting，也不承諾 Google 收錄、排名或 FAQ rich result。

僅記錄頁面、CTA、開始填表及送件結果；不傳送姓名、Email、聯絡方式、表單正文或申請編號至 GA。進頁時移除 query 及非允許的 hash，避免它們出現在分析資料。

## 重跑檢查

```sh
node tools/build-locales.mjs
node tests/creator-recruitment.test.mjs
node tests/pages-functions-contract.mjs
node tests/site-conversion-contract.mjs
node tests/technical-seo-contract.mjs
node tests/internal-linking-contract.mjs
node tests/analytics-classification-contract.mjs
node tests/creator-recruitment-live.mjs
git diff --check
```

`tools/preview-recruitment.mjs` 只供本機測試：獨立暫存 SQLite、模擬 Turnstile 與 Access，不可當成正式驗收。正式發布後必須確認實際 CAPTCHA、收件回讀與管理登入。

## 發布狀態

2026-11-12：已發布至正式站。頁面版本 `17620ba`；Cloudflare Pages deployment `3de1af01-c51d-4415-b355-e4c30f8fbfa3`，Worker version `54497340-a994-4650-9c46-9a57b484d327`。

已確認正式 config 開啟收件、4 個前端資產與本機內容一致、首頁／人才頁／sitemap 有入口、SEO 可索引、無合作方素材，非法資料 HTTP 422、跨來源 HTTP 403，公開 gateway 不允許管理路徑；未登入名單 API 導向 Access（HTTP 302）。既有 contact／careers handler 與本機回歸通過。

尚未完成：真實 Turnstile 正向送件、登入後的名單與匯出操作。Access 驗證碼已交由使用者完成，勿把上述檢查視為完整正向驗收。Google 收錄與排名尚未驗證；sitemap 可供抓取不代表已收錄。
