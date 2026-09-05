# 榛菓筆記：混合配圖正式套用

日期：2026-09-06。由使用者確認的三張系列樣稿套用到既有三篇繁中文章與 `/insights/` 入口，未增加語言頁或修改四個官網首頁。

## 網站呈現

- AI 情境照片＋程序化紙感＋Shader 光影：於本地瀏覽器完成合成，移除所有文字與線稿後匯出，存為 `web-assets/blog/*-v3-background.webp`（1600×840）。
- 標題、副標與小標：`tools/editorial-blog.mjs` 的 `coverCopy` 資料，輸出為真正 HTML 文字；以 CSS container units 隨配圖尺寸縮放。
- SVG：同一資料物件中的原創閱讀註記、杯體及觀看分布線稿；網站內嵌，無額外 JS。
- 分享預覽：將已確認的繁中合成樣稿匯出為 `web-assets/blog/*-v3-social.webp`（1200×630）；三篇的 OG／Twitter／BlogPosting image 各指向對應圖。
- 正式網站不執行 Canvas、WebGL 或 Shader，也不部署本地工作台。既有 GA 仍是唯一頁面腳本來源組，沒有重複追蹤標籤。

原始素材、生成提示詞、AI 配圖聲明沿用 `editorial-blog-visual-refresh.md`。三張背景與社群圖的 slug 依序為 `reading-social-comment-signals`、`beverage-content-storytelling`、`creator-view-distribution-notes`。

## 多語邊界

本次只發布目前三篇繁中內容。未自動產生簡中或英文翻譯。未來語言版可共用三張無字底圖與 SVG，翻譯 `coverCopy` 的文字後獨立檢查斷行。社群分享圖若需該語言文字，再從同一套合成版型匯出；不是每個語言重新生照片。

## 驗證

```sh
node tools/build-locales.mjs
node tests/editorial-blog-contract.mjs
node tests/taiwan-market-contract.mjs
node tests/seo-phase-one-contract.mjs
node tests/site-conversion-contract.mjs
GA4_BLOG=1 GA4_TARGETS='Blog ' GA4_TIMEOUT_MS=20000 node tools/verify-ga4.mjs
```

GA 在乾淨副本執行，保存目標式報告，不覆蓋既有全量證據。四首頁與 GA 腳本由 contract 檢查 byte-for-byte 保持一致；第二次生成不得出現新 diff。舊 v2 圖片保留，避免先前 HTML 快取引用失效。
