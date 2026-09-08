export const tool = {
  id: 'qr-code',
  slug: 'qr-code-generator',
  title: 'QR Code 產生器｜靜態 PNG／SVG',
  description: '在瀏覽器本機產生 URL、純文字或 Wi-Fi 靜態 QR Code，支援 PNG／SVG 下載，不上傳內容。',
  body: `<section class="tool-grid qr-tool" aria-label="QR Code 產生器">
  <div class="panel">
    <div class="fields">
      <label for="qr-type">內容類型
        <select id="qr-type">
          <option value="url">網址 URL</option>
          <option value="text">純文字</option>
          <option value="wifi">Wi-Fi</option>
        </select>
      </label>
      <div id="qr-url-fields" class="qr-fields">
        <label for="qr-url">網址
          <input id="qr-url" type="url" inputmode="url" value="https://" autocomplete="off" spellcheck="false" placeholder="https://example.com/?q=中文#emoji">
        </label>
      </div>
      <div id="qr-text-fields" class="qr-fields" hidden>
        <label for="qr-text">文字
          <textarea id="qr-text" rows="5" maxlength="2953" placeholder="輸入要放進 QR Code 的文字（支援中文與 emoji）"></textarea>
        </label>
      </div>
      <div id="qr-wifi-fields" class="qr-fields" hidden>
        <label for="qr-wifi-ssid">Wi-Fi 名稱（SSID）
          <input id="qr-wifi-ssid" type="text" maxlength="255" autocomplete="off" spellcheck="false">
        </label>
        <label for="qr-wifi-password">Wi-Fi 密碼
          <input id="qr-wifi-password" type="password" maxlength="255" autocomplete="off" spellcheck="false">
        </label>
        <div class="fields">
          <label for="qr-wifi-security">安全性
            <select id="qr-wifi-security"><option value="WPA">WPA/WPA2/WPA3</option><option value="WEP">WEP</option><option value="nopass">無密碼</option></select>
          </label>
          <label class="qr-check"><input id="qr-wifi-hidden" type="checkbox"> 隱藏網路</label>
        </div>
        <p class="qr-field-note">Wi-Fi QR Code 會包含密碼；請只在可信任的場合分享。</p>
      </div>
    </div>
    <div class="fields qr-options">
      <label for="qr-level">錯誤更正
        <select id="qr-level"><option value="M">M｜一般</option><option value="L">L｜較大容量</option><option value="Q">Q｜較強</option><option value="H">H｜最強</option></select>
      </label>
      <label for="qr-size">輸出尺寸（px）
        <input id="qr-size" type="number" min="64" max="2048" step="1" value="512" inputmode="numeric">
      </label>
      <label for="qr-quiet">四周留白（格）
        <input id="qr-quiet" type="number" min="0" max="32" step="1" value="4" inputmode="numeric">
      </label>
      <label for="qr-dark">深色
        <input id="qr-dark" type="color" value="#111827">
      </label>
      <label for="qr-light">淺色
        <input id="qr-light" type="color" value="#ffffff">
      </label>
    </div>
    <div class="actions"><button id="qr-generate" class="primary" type="button">產生 QR Code</button></div>
    <p id="qr-notice" class="notice" role="status" aria-live="polite"></p>
  </div>
  <div class="panel preview qr-result">
    <div id="qr-preview" class="qr-preview" aria-label="QR Code 預覽"></div>
    <div class="actions"><button id="qr-download-png" type="button" disabled>下載 PNG</button><button id="qr-download-svg" type="button" disabled>下載 SVG</button></div>
    <dl class="metric qr-metrics"><div><dt>模組</dt><dd id="qr-module-count">—</dd></div><div><dt>內容</dt><dd id="qr-encoded-length">—</dd></div></dl>
    <details class="qr-encoded-details"><summary>查看實際編碼內容</summary><pre id="qr-encoded" tabindex="0">—</pre></details>
  </div>
</section>`,
  styles: `.qr-tool{--qr-ink:#111827}.qr-tool .qr-fields{margin-top:12px}.qr-tool .qr-options{margin-top:18px}.qr-tool .qr-check{align-self:end;display:flex;gap:8px;align-items:center}.qr-tool .qr-field-note{margin:8px 0 0;color:var(--muted,#667085);font-size:.86rem}.qr-tool .qr-preview{display:grid;place-items:center;min-height:300px;padding:18px;background:#f5f7fa;border-radius:12px}.qr-tool .qr-preview svg{display:block;width:min(100%,360px);height:auto;image-rendering:pixelated}.qr-tool .qr-metrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:18px 0 0}.qr-tool .qr-metrics>div{padding:10px 12px;border:1px solid var(--line,#d9e0ea);border-radius:8px}.qr-tool .qr-metrics dt{color:var(--muted,#667085);font-size:.8rem}.qr-tool .qr-metrics dd{margin:4px 0 0;font-weight:700}.qr-tool .qr-encoded-details{margin-top:16px}.qr-tool .qr-encoded-details pre{max-height:150px;margin:10px 0 0;padding:10px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;border-radius:8px;background:#f5f7fa;font:inherit;font-size:.86rem}.qr-tool input[type=color]{width:100%;min-height:42px;padding:3px}.qr-tool .notice:empty{display:none}`,
  help: [
    ['怎麼使用', '選擇內容類型並填入資料，QR Code 會在本機產生；確認實際編碼內容後下載 PNG 或 SVG。'],
    ['錯誤更正與留白', 'M 適合一般使用；若可能有輕微髒污可選 Q 或 H。四周至少保留 4 格白邊，印刷或遠距掃描時不要裁掉。'],
    ['隱私提醒', '工具不會上傳輸入內容，也不會把 Wi-Fi 密碼送到分析或回報服務。Wi-Fi QR Code 本身包含密碼，請妥善保存。']
  ],
  faqs: [
    ['這是動態 QR Code 嗎？', '不是。這是靜態 QR Code；產生後不依賴本工具的訂閱或轉址服務，但目標網站或 Wi-Fi 設定失效仍會影響使用。'],
    ['中文和 emoji 可以正確掃描嗎？', '可以，文字會以 UTF-8 編碼。下載前請先查看實際編碼內容，並用你的手機或掃描器測試成品。'],
    ['為什麼改顏色後顯示可讀性提醒？', 'QR Code 需要深色模組和淺色背景有足夠對比。提醒不是把檔案送出或替你掃描；請以實際手機掃描和印刷尺寸確認。']
  ],
  releaseNotes: ['初版：支援 URL、純文字與 Wi-Fi 靜態 QR Code，提供 PNG／SVG 匯出與對比度提醒。'],
  script: '/web-assets/public-tools/qr-code.mjs'
};
