# 榛菓筆記視覺改版 v2

日期：2026-09-05。使用內建 image_gen 逐張生成三張新封面，非 CLI fallback。使用者要求改善原圖的套版與 AI 感，採自然光、紙張與木紋等攝影語言；公開圖說明示 AI 生成，不宣稱實拍。

## 最終資產

- `web-assets/blog/reading-social-comment-signals-v2.webp`
- `web-assets/blog/beverage-content-storytelling-v2.webp`
- `web-assets/blog/creator-view-distribution-notes-v2.webp`

全部 1200 × 630，WebP quality 84，單張約 45–71KB。原始生成 PNG 留在 Codex generated_images；網站引用只指向倉庫內 WebP，不依賴本機檔案。舊 SVG 封面保留以兼容尚未更新的快取 HTML，新頁不再引用。

## 內文圖解

六格飲料分鏡重新手繪為精細 SVG：透光杯體、冰塊、桌面、窗框與街道透視，不再使用簡筆人物。留言卡與流程採紙色、細線與小面積點綴；統計圖保留精確資料與零基準，只調整材質色彩。沒有改動文章正文、URL、title、首頁或追蹤程式。此紀錄更新首期 `editorial-blog-assets.md` 中三張封面的來源；內文仍是程式绘製，非生圖數據。

## 最終 Prompt set

### comments

Use case: photorealistic-natural. Create a refined landscape 1.9:1 editorial photograph for a Taiwanese independent journal article about carefully reading social-media comments. An intimate crop of a thoughtful reader's work table: one slim smartphone face down (absolutely no screen/UI), a small open ivory notebook with only faint pencil marks not readable writing, several casually stacked warm-white paper slips with their backs up, and a graphite pencil. Quiet lived-in desk of pale wood beside a large window, interesting but physically believable side light, gentle shadows, tactile paper grain and small ordinary imperfections. Composition like a contemporary print magazine still life, not a corporate stock photo: asymmetrical, beautifully restrained, objects comfortably filling the frame, overhead at a slight angle, subtle natural color, fine analog photographic grain, realistic camera optics. Warm ivory, charcoal, muted olive, tiny rust-red notebook binding accent; no extreme sepia. No text, typography, logos, graphs, cartoon shapes, speech bubbles, humans, hands, AI symbols, robot, neon, floating elements, glossy 3D render, overstyled decorative props, artificial blur. A new concept image, not depicting a real client or real private messages.

### beverage

Use case: photorealistic-natural. Create a beautiful landscape 1.9:1 editorial photograph for a Taiwanese journal article on beverage visual storytelling. ONE unbranded clear takeaway cup of amber iced tea on a worn pale wood cafe windowsill, translucent ice, believable light condensation, simple flat clear lid with no straw. Late afternoon window light shines naturally through the tea onto the wood; outside the window a softly out-of-focus ordinary Taipei street, architectural detail and leafy tree hint, no people or readable signage. Crop close enough that the drink is a tactile subject, slightly off-center, with the window frame and small patch of table setting up an intimate narrative. Sophisticated print-magazine photography, authentic everyday Taiwan cafe atmosphere, calm natural colors and subtle photographic grain, not advertising perfection. Natural ivory, tea amber, muted green, charcoal. No text, no logos, no visible brand, no collage or split screen, no floating fruit, splashes, glowing gradients, cartoon outlines, AI gloss, plastic-looking ice, fake lettering, or excessive background blur. Original fictional scene, not a documented customer campaign.

### data

Use case: photorealistic-natural. Create a restrained landscape 1.9:1 editorial still-life photograph for a design journal essay about why an average hides variation. A physical arrangement of TEN narrow matte paper strips in muted olive on a warm-white archival paper sheet, aligned naturally along a subtle edge: nine strips of modest varying lengths, and one considerably longer rust-red strip. Strips are real cut paper with minute irregular edges and tiny shadows, not computer graphics. A metal ruler without legible numbering partly cropped at frame edge and a graphite pencil resting off to one side, careful asymmetrical flat-lay composition. This is an abstract editorial metaphor, not a quantitative chart: no axis, no labels, no numbers, no text whatsoever. Soft real window light from upper left, tactile fiber paper, delicate controlled shadow, quiet cream/olive/rust palette, high-end magazine photography with natural grain. Objects stay flat on desk, no floating, no synthetic 3D, no glossy blocks, no business dashboard, no laptop, no dramatic glow. Artistic composition with natural imperfections and elegant negative space.
