# 榛菓筆記首期素材紀錄

> 更新：三張封面已於視覺改版 v2 改為 AI 生成攝影風格情境圖，頁面明確標示來源。下表保留首期歷史紀錄；現行來源、檔名與完整 prompts 見 `editorial-blog-visual-refresh.md`。內文圖表仍由程式繪製。

發布日期：2026-09-05。所有新圖文由本次網站製作產生；無外部照片、真實帳號、客戶資料、私人對話或品牌包裝。未使用生成式照片或虛構客戶成效。

| 文章 | 視覺 | 來源與製作 | 公開標示 |
| --- | --- | --- | --- |
| 留言訊號 | 封面：四類對話泡泡 | 原創 SVG，`web-assets/blog/reading-social-comment-signals.svg` | 原創圖像 |
| 留言訊號 | 四類留言對照卡 | 原創 HTML/CSS；文字為虛構留言 | 虛構示意，可重疊及不確定 |
| 留言訊號 | 三步閱讀流程 | 原創 HTML/CSS，有語意化步驟清單 | 整理流程示意 |
| 飲料敘事 | 封面：攝影台／窗邊的同一杯飲料 | 原創 SVG，`web-assets/blog/beverage-content-storytelling.svg` | 非真實商品或合作案例 |
| 飲料敘事 | 兩條路徑各三格的故事板 | 六個原創內嵌 SVG＋HTML 圖說 | 非真實拍攝現場或客戶作品 |
| 飲料敘事 | 鏡頭、字幕與敘述分工 | 原創 HTML 表格 | 敘事分工表 |
| 觀看分布 | 封面：長條與參考線 | 原創 SVG，`web-assets/blog/creator-view-distribution-notes.svg` | 原創資料視覺 |
| 觀看分布 | 十篇資料記錄表 | 合成資料，由生成器中的 `views` 陣列輸出 | 非真實帳號；日期未指定 |
| 觀看分布 | 平均／中位數與逐篇分布圖 | 同一資料陣列生成 HTML/CSS 長條圖，零基準縱軸 | 合成資料、非市場基準 |

圖像來源程式：`tools/editorial-blog.mjs`。視覺皆以程式精確繪製，中文標籤可選取且不由影像模型生成。

統計定義參考：[NIST/SEMATECH e-Handbook — Measures of Location](https://www.itl.nist.gov/div898/handbook/eda/section3/eda351.htm)，查閱日期 2026-09-05。文章採自行建立的十筆數據與計算，未複製 NIST 圖片或範例。

社群分享預覽沿用既有官網品牌 WebP，避免 SVG 在社群預覽端不支援；頁面內的三張新封面仍各自獨立。原始文章、圖表與指南的 URL 不相互替換。

驗證命令：

```sh
node tools/build-locales.mjs
node tests/editorial-blog-contract.mjs
GA4_BLOG=1 GA4_TARGETS='Blog ' GA4_TIMEOUT_MS=20000 node tools/verify-ga4.mjs
```

GA 驗證沿用既有分類：`/insights/` 為 `content_type=article, content_slug=article`；三篇文章使用各自 slug。此任務不修改 tracker 的分類模型。指標報告須以 page_path 區分列表與文章。

GA 指令會覆寫本地 targeted report，請在乾淨驗證副本執行，保留原始 collect、HTTP 回應、PII scan 與每次 retry；不要覆蓋既有已提交的全量報告。
