# 榛菓筆記第二批：2026 資訊與教學

發布日期：2026-09-06。新增三篇繁中資訊／教學文章，無新增語系頁、無首頁修改。

## 官方事實來源

- YouTube Blog，2026-05-15：https://blog.youtube/creator-and-artist-stories/youtube-auto-dubbing-explained/
- YouTube Help（查核 2026-09-06）：https://support.google.com/youtube/answer/15569972?hl=en-EN
- Meta Newsroom，2026-04-22：https://about.fb.com/news/2026/04/one-year-of-edits-built-for-and-with-creators/
- TikTok Next，2026-01-14：https://newsroom.tiktok.com/introducing-tiktok-next-2026-our-trend-forecast-for-marketers-for-the-year-ahead-ca?lang=en-CA
- Creator Search Insights 公告，2024-03-13：https://newsroom.tiktok.com/creator-search-insights?lang=en

公告已提供與預告功能分開描述；不把 Edits 的未來規劃當成所有帳號已上線，也不把 TikTok 全球平台預測等同台灣研究。TikTok Help 的動態正文未能由工具取得，故不採用未核實的門檻與新功能；文中只引用可讀官方公告與原創編輯練習。YouTube 配音語言支援須看實際頻道與影片，不保證任意兩種語言互轉。

## 內容與圖片

- youtube-auto-dubbing-review：發布前人工聽校流程＋虛構詞句核對表。
- edits-mobile-video-workflow：三鏡頭口播時間線＋素材／輸出檢查表。
- tiktok-search-topic-workshop：問題到鏡頭的選題表＋手動選題流程。

三張情境照片由內建 image_gen 逐張生成，沒有使用真實客戶、帳號、介面、錄音或私人資料。圖片明示 AI 情境配圖；教學視覺皆是原創 HTML 表格／流程，不冒充平台 UI 截圖。

照片經既有本地混合合成工作台加上紙感與輕量 Shader，分別輸出無字底圖（1600×840）及繁中分享圖（1200×630）。最終路徑：

```
web-assets/blog/youtube-auto-dubbing-review-v3-background.webp
web-assets/blog/youtube-auto-dubbing-review-v3-social.webp
web-assets/blog/edits-mobile-video-workflow-v3-background.webp
web-assets/blog/edits-mobile-video-workflow-v3-social.webp
web-assets/blog/tiktok-search-topic-workshop-v3-background.webp
web-assets/blog/tiktok-search-topic-workshop-v3-social.webp
```

配圖文字和 SVG 沿用 coverCopy／renderCover，不新增前端 Canvas/WebGL。原有三篇正文、日期及相關閱讀維持不變；列表改為新文優先，數量與分類錨點由資料生成。新文只保留兩篇相關閱讀，不堆滿連結。

## 生成 Prompt set

### dubbing

Use case photorealistic-natural. Landscape 1.9:1 editorial still-life photograph for a Taiwanese creative-industry journal story about reviewing multilingual voice dubbing. An unbranded compact silver studio microphone and worn over-ear headphones resting on a warm pale wooden desk beside a small open ivory notebook, blank paper notes, no readable writing. A calm real home recording corner in natural side window light, tactile metal mesh and fabric, slight everyday imperfections, close and asymmetrical framing for a print magazine. Subject occupying center/right, natural warm ivory charcoal muted olive palette, subtle film grain, realistic lens, crisp but not oversharpened. No people, hands, logos, UI, screens, letters, flags, cartoon speech bubbles, robot/AI icon, glossy 3D, neon or excessive blur. Fictional editorial concept, not real client studio.

### edits

Use case photorealistic-natural. Landscape 1.9:1 sophisticated natural editorial photograph for a Taiwanese journal tutorial about filming a short talking-head video with a phone. A matte black unbranded smartphone mounted vertically on a small tabletop tripod, seen from back/side so no screen UI visible. On nearby pale wooden desk an everyday unbranded ceramic cup, several blank small storyboard index cards and pencil. Morning light through a sheer window, simple lived-in home creator workspace, restrained crop and balanced visual rhythm, authentic tactile paper wood and fabric, realistic camera optics, subtle analog grain. Main equipment central/right with quiet surroundings; ivory muted olive charcoal small rust accent. No people, hands, logos, legible text, app mockups, glowing overlays, floating objects, cartoon, plastic 3D or corporate stock cliches. This is fictional conceptual photography not an actual software screenshot.

### search

Use case photorealistic-natural. Create a landscape 1.9:1 editorial photograph for a Taiwanese creator journal tutorial turning search questions into useful video topics. A dark olive everyday canvas commuter bag partly open on a plain pale wooden bench next to a small notebook and folded umbrella, soft reflected daylight after rain through a large station-like window, tiny water beads on window only. Close tactile observation of the bag's fabric seams, pocket and plain shoulder strap; enough surroundings for a quiet lived-in urban moment. Rich natural textures, cream olive graphite palette, fine film grain, authentic editorial magazine composition, simple not staged-perfect. Objects central/right and visually legible. No brands, humans, hands, readable signs, text, logos, magnifying glass icon, fake charts, neon, floating UI, glossy AI 3D or oversaturated colors. Original fictional scenario, not a real product test or proof of waterproof performance.
