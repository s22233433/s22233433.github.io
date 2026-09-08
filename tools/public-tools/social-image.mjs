export const tool = {
  id: 'social-image',
  slug: 'social-image-tool',
  title: '社群圖片尺寸與壓縮工具',
  description: '在瀏覽器本機調整 JPEG、PNG、WebP 圖片尺寸、裁切、留白、壓縮與浮水印，支援批次處理與 ZIP。',
  body: `<section class="tool-grid social-image-tool" aria-label="社群圖片處理工具">
  <div class="panel">
    <div class="fields">
      <label id="social-image-drop-zone" class="social-drop-zone" for="social-image-files">選擇圖片（最多 10 張）
        <input id="social-image-files" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" multiple>
      </label>
      <p class="social-field-note">只接受 JPEG、PNG、WebP；單檔最多 15 MB，單張解碼最多 24 MP。</p>
      <div id="social-image-file-list" class="social-file-list" aria-live="polite"></div>
    </div>
    <div class="fields social-image-options">
      <label for="social-image-preset">輸出尺寸
        <select id="social-image-preset"><option value="square">1:1｜1080 × 1080</option><option value="portrait">4:5｜1080 × 1350</option><option value="story">9:16｜1080 × 1920</option><option value="landscape">16:9｜1920 × 1080</option><option value="custom">自訂尺寸</option></select>
      </label>
      <div id="social-image-custom-fields" class="fields" hidden>
        <label for="social-image-width">寬度（px）<input id="social-image-width" type="number" min="1" max="8000" value="1080" inputmode="numeric"></label>
        <label for="social-image-height">高度（px）<input id="social-image-height" type="number" min="1" max="8000" value="1080" inputmode="numeric"></label>
      </div>
      <label for="social-image-fit">比例處理
        <select id="social-image-fit"><option value="contain">留白｜保留完整圖片</option><option value="cover">裁切｜填滿輸出尺寸</option></select>
      </label>
      <label for="social-image-format">輸出格式
        <select id="social-image-format"><option value="image/jpeg">JPEG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select>
      </label>
      <label for="social-image-quality">品質 <output id="social-image-quality-value" for="social-image-quality">85</output>
        <input id="social-image-quality" type="range" min="10" max="100" value="85">
      </label>
      <label for="social-image-background">留白背景色
        <input id="social-image-background" type="color" value="#ffffff">
      </label>
      <label class="social-check"><input id="social-image-transparent" type="checkbox"> PNG／WebP 使用透明留白</label>
    </div>
    <div class="fields social-watermark-fields">
      <label for="social-image-watermark">文字浮水印（選填）
        <input id="social-image-watermark" type="text" maxlength="120" placeholder="例如：@yourbrand" autocomplete="off">
      </label>
      <label for="social-image-opacity">浮水印不透明度 <output id="social-image-opacity-value" for="social-image-opacity">55</output>
        <input id="social-image-opacity" type="range" min="5" max="100" value="55">
      </label>
      <label for="social-image-logo">本機 Logo（選填）
        <input id="social-image-logo" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp">
      </label>
    </div>
    <div class="actions"><button id="social-image-process" class="primary" type="button">開始處理</button><button id="social-image-cancel" type="button" disabled>取消</button></div>
    <p id="social-image-notice" class="notice" role="status" aria-live="polite"></p>
    <div id="social-image-errors" class="social-error-list" role="alert" aria-live="polite"></div>
    <progress id="social-image-progress" max="1" value="0" hidden></progress>
  </div>
  <div class="panel preview social-image-results">
    <div id="social-image-output-grid" class="social-output-grid" aria-live="polite"><p class="social-empty">處理後的圖片會顯示在這裡。</p></div>
    <div class="actions"><button id="social-image-download-zip" type="button" disabled>下載全部 ZIP</button></div>
  </div>
</section>`,
  styles: `.social-image-tool .social-field-note{margin:8px 0;color:var(--muted,#667085);font-size:.86rem}.social-image-tool .social-drop-zone{display:grid;gap:8px;padding:16px;border:1px dashed var(--line,#b8c2d0);border-radius:10px;background:#fbfcfe;cursor:pointer}.social-image-tool .social-drop-zone.is-dragging{border-color:#315b9d;background:#eef3fb}.social-image-tool .social-image-options,.social-image-tool .social-watermark-fields{margin-top:18px}.social-image-tool .social-check{align-self:end;display:flex;gap:8px;align-items:center}.social-image-tool output{font-variant-numeric:tabular-nums}.social-image-tool progress{width:100%;margin-top:14px}.social-image-tool .social-file-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px;margin-top:12px}.social-image-tool .social-file-card{overflow:hidden;border:1px solid var(--line,#d9e0ea);border-radius:8px;background:#f5f7fa}.social-image-tool .social-file-card img{display:block;width:100%;aspect-ratio:1;object-fit:cover}.social-image-tool .social-file-card span{display:block;padding:6px;font-size:.75rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.social-image-tool .social-output-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:14px}.social-image-tool .social-output-card{display:grid;gap:8px;min-width:0}.social-image-tool .social-output-card img{display:block;width:100%;aspect-ratio:1;object-fit:contain;border:1px solid var(--line,#d9e0ea);border-radius:8px;background:#f5f7fa}.social-image-tool .social-output-card p{margin:0;font-size:.83rem;overflow-wrap:anywhere}.social-image-tool .social-empty{color:var(--muted,#667085)}.social-image-tool .social-error{color:#a32621}.social-image-tool .social-error-list{display:grid;gap:4px;margin-top:10px;color:#a32621;font-size:.83rem}.social-image-tool .social-error-list:empty{display:none}`,
  help: [
    ['比例怎麼選', '留白會保留完整圖片，裁切會填滿目標尺寸並從中心裁切；兩者都不會把圖片硬拉伸。先選常用比例，或改用自訂尺寸。'],
    ['批次限制', '每批最多 10 張、單檔 15 MB、單張解碼最多 24 MP。限制是瀏覽器記憶體保護值，不是 Cloudflare 限額。'],
    ['隱私與 EXIF', '圖片與 Logo 只在本機處理，不會上傳。所有輸出都重新編碼，因此不保留原始 EXIF／GPS metadata；JPEG 的透明留白會使用指定背景色。']
  ],
  faqs: [
    ['支援 HEIC、RAW 或動畫 GIF 嗎？', '不支援。初版只接受 JPEG、PNG、WebP，並且不處理動畫。'],
    ['手機照片方向會正確嗎？', '工具優先使用 createImageBitmap 的 from-image 或原生 Image 的 EXIF 方向處理。若瀏覽器不支援 EXIF 方向，輸出可能保留原始方向；請更新瀏覽器並檢查成品。'],
    ['取消一批處理會怎樣？', '已完成的圖片會保留並可下載，尚未開始或正在等待的圖片會停止；單張錯誤也不會丟掉其他成果。']
  ],
  releaseNotes: ['初版：支援 JPEG／PNG／WebP 的尺寸、留白、裁切、品質、文字／Logo 浮水印、批次進度、取消與 ZIP 匯出。'],
  script: '/web-assets/public-tools/social-image.mjs'
};
