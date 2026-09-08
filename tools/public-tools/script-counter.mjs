export const tool = {
  id: 'script-counter',
  slug: 'script-word-counter',
  title: '字數／口播時間計算器',
  description: '分開計算中文字符、英文詞、空白、標點與總字符，依自訂語速和段落停頓估算口播時間。',
  body: `
    <div class="tool-grid counter-tool" data-tool="script-counter">
      <section class="panel counter-editor-panel" aria-labelledby="counter-editor-title">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">SCRIPT COUNTER</p>
            <h2 id="counter-editor-title">把稿件長度換成可排程的秒數</h2>
            <p class="panel-intro">輸入只留在目前分頁記憶體。數字是估算，不等同真人錄音或剪輯後的實際長度。</p>
          </div>
        </div>
        <form id="script-counter-form" class="counter-form">
          <label class="counter-text-label">稿件內容
            <textarea id="script-counter-text" name="text" rows="15" placeholder="貼上口播稿；用換行分隔段落。"></textarea>
          </label>
          <div class="fields counter-settings">
            <label>中文字符／分鐘
              <input name="hanRate" type="number" min="1" step="1" value="300" inputmode="numeric">
              <span class="field-help">只計入 Han 字符。</span>
            </label>
            <label>英文詞／分鐘
              <input name="englishRate" type="number" min="1" step="1" value="150" inputmode="numeric">
              <span class="field-help">以英文詞計算，不把數字當英文詞。</span>
            </label>
            <label>段落間停頓（秒）
              <input name="paragraphPause" type="number" min="0" step="0.1" value="0.5" inputmode="decimal">
              <span class="field-help">只加在非空段落之間。</span>
            </label>
            <label>目標長度
              <select name="goalSeconds">
                <option value="30">30 秒</option>
                <option value="60" selected>60 秒</option>
                <option value="90">90 秒</option>
              </select>
              <span class="field-help">顯示與目標的秒數差距。</span>
            </label>
          </div>
          <div class="actions">
            <button class="primary" type="button" id="copy-counter-summary">複製摘要</button>
            <button type="reset" id="reset-counter">清除稿件</button>
          </div>
        </form>
        <p class="notice" id="counter-notice" role="status" aria-live="polite">貼上稿件後會即時更新統計；不會自動保存。</p>
      </section>
      <section class="panel counter-output-panel" aria-labelledby="counter-output-title">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">ESTIMATE</p>
            <h2 id="counter-output-title">統計與估算</h2>
          </div>
          <span class="counter-estimate-label">估算值</span>
        </div>
        <div class="metric-grid" aria-live="polite">
          <div class="metric"><span>中文字符</span><strong data-metric="han">0</strong><small>Han 字符；中文標點不列入</small></div>
          <div class="metric"><span>英文詞</span><strong data-metric="englishWords">0</strong><small>英文詞；縮寫依原生分詞器</small></div>
          <div class="metric"><span>數字組</span><strong data-metric="numberGroups">0</strong><small>連續數字視為一組</small></div>
          <div class="metric"><span>空白</span><strong data-metric="whitespace">0</strong><small>空格、換行、Tab 等</small></div>
          <div class="metric"><span>標點</span><strong data-metric="punctuation">0</strong><small>Unicode 標點字符</small></div>
          <div class="metric"><span>總字符</span><strong data-metric="graphemes">0</strong><small>以 grapheme cluster 計，emoji 組合算 1</small></div>
        </div>
        <div class="counter-total" id="counter-total" data-tone="neutral">
          <span>預估口播時間</span>
          <strong data-metric="duration">0 秒</strong>
          <small data-metric="durationDetail">內容 0 秒 · 段落停頓 0 秒</small>
        </div>
        <p class="notice counter-goal" id="counter-goal" role="status" aria-live="polite">尚未輸入稿件；與目標的差距會顯示在這裡。</p>
        <section class="counter-paragraphs" aria-labelledby="counter-paragraph-title">
          <div class="subheading"><h3 id="counter-paragraph-title">分段估算</h3><span id="counter-paragraph-count">0 段</span></div>
          <div class="counter-paragraph-list" id="counter-paragraph-list"><p class="counter-empty">輸入內容後顯示每段的字符與時間。</p></div>
        </section>
        <details class="counter-definitions">
          <summary>統計口徑與限制</summary>
          <ul>
            <li>中文字符是含 Han Script 的 grapheme；中文標點、空白、數字另計，不重複加到中文字符。</li>
            <li>英文詞由瀏覽器的 Intl.Segmenter 分詞；不支援時退回英文字母詞形。數字組另計，混合中英文字仍依各欄位規則統計。</li>
            <li>總字符是 grapheme cluster 數；組合 emoji 或字母加重音符號會視為一個可見字符。</li>
            <li>時間 = 中文字符 ÷ 中文語速 + 英文詞 ÷ 英文語速 + 段落間停頓；結果只作腳本排程參考。</li>
            <li>本工具不做 AI 改寫、語音合成、錄音上傳，也不宣稱任何平台的固定字數上限。</li>
          </ul>
        </details>
      </section>
    </div>
  `,
  styles: `
    .counter-tool{--counter-ink:#172033;--counter-muted:#647087;--counter-line:#d9e0eb;--counter-accent:#315b9d;align-items:start}
    .counter-tool .panel{min-width:0}
    .counter-tool .panel-heading{display:flex;justify-content:space-between;gap:16px;align-items:start;margin-bottom:20px}
    .counter-tool .panel-heading h2{margin:0;color:var(--counter-ink);font-size:clamp(22px,3vw,32px);line-height:1.12}
    .counter-tool .panel-intro{max-width:600px;margin:10px 0 0;color:var(--counter-muted);line-height:1.7}
    .counter-tool .counter-text-label{display:grid;gap:8px;color:var(--counter-muted);font-size:13px}
    .counter-tool textarea{width:100%;resize:vertical;min-height:260px;padding:14px;border:1px solid var(--counter-line);border-radius:12px;background:#fbfcfe;color:var(--counter-ink);font:16px/1.75 "Noto Sans TC","PingFang TC",sans-serif}
    .counter-tool textarea:focus,.counter-tool input:focus,.counter-tool select:focus{outline:3px solid #315b9d33;border-color:var(--counter-accent)}
    .counter-tool .counter-settings{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:18px}
    .counter-tool .counter-settings label{display:grid;gap:6px}
    .counter-tool .field-help{color:var(--counter-muted);font-size:11px;line-height:1.45}
    .counter-tool .actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}
    .counter-tool .actions button{min-height:42px;padding:10px 14px;border:1px solid var(--counter-line);border-radius:999px;background:#fff;color:var(--counter-ink);cursor:pointer}
    .counter-tool .actions .primary{border-color:var(--counter-accent);background:var(--counter-accent);color:#fff}
    .counter-tool .actions button:focus-visible{outline:3px solid #315b9d44;outline-offset:2px}
    .counter-tool .notice{min-height:24px;margin:16px 0 0;color:var(--counter-muted);font-size:13px}
    .counter-tool .notice[data-tone=error]{color:#a33d52}
    .counter-tool .counter-estimate-label{color:var(--counter-muted);font-size:12px}
    .counter-tool .metric-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
    .counter-tool .metric{display:grid;gap:5px;min-width:0;padding:14px;border:1px solid var(--counter-line);border-radius:12px;background:#f6f8fb}
    .counter-tool .metric span{color:var(--counter-muted);font-size:12px}
    .counter-tool .metric strong{color:var(--counter-ink);font-size:27px;line-height:1}
    .counter-tool .metric small{color:var(--counter-muted);font-size:10px;line-height:1.4}
    .counter-tool .counter-total{display:grid;gap:6px;margin-top:16px;padding:20px;border-radius:14px;background:var(--counter-ink);color:#fff}
    .counter-tool .counter-total span{font-size:12px;opacity:.75}
    .counter-tool .counter-total strong{font-size:clamp(28px,5vw,44px);line-height:1}
    .counter-tool .counter-total small{opacity:.76}
    .counter-tool .counter-total[data-tone=over]{background:#7d4651}
    .counter-tool .counter-total[data-tone=under]{background:#315b9d}
    .counter-tool .counter-goal{margin-bottom:0}
    .counter-tool .subheading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}
    .counter-tool .subheading h3{margin:0;color:var(--counter-ink);font-size:18px}
    .counter-tool .subheading span{color:var(--counter-muted);font-size:12px}
    .counter-tool .counter-paragraphs{margin-top:22px;padding-top:18px;border-top:1px solid var(--counter-line)}
    .counter-tool .counter-paragraph-list{display:grid;gap:8px}
    .counter-tool .counter-paragraph{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;padding:12px;border:1px solid var(--counter-line);border-radius:10px;background:#fbfcfe}
    .counter-tool .counter-paragraph p{overflow:hidden;margin:0;color:var(--counter-muted);font-size:12px;text-overflow:ellipsis;white-space:nowrap}
    .counter-tool .counter-paragraph strong{display:block;color:var(--counter-ink);font-size:14px}
    .counter-tool .counter-paragraph span{display:block;color:var(--counter-muted);font-size:11px}
    .counter-tool .counter-empty{margin:0;color:var(--counter-muted);font-size:13px}
    .counter-tool .counter-definitions{margin-top:18px;padding-top:16px;border-top:1px solid var(--counter-line);color:var(--counter-muted);font-size:13px;line-height:1.7}
    .counter-tool .counter-definitions summary{color:var(--counter-ink);font-weight:700;cursor:pointer}
    .counter-tool .counter-definitions ul{padding-left:20px}
    @media (max-width:760px){.counter-tool .counter-settings{grid-template-columns:1fr}.counter-tool .metric-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.counter-tool .panel-heading{display:block}.counter-tool .counter-estimate-label{display:block;margin-top:8px}}
  `,
  help: [
    ['中文字符', '只計入 Han Script 字符；中文標點、空白、數字另列，避免把不同口徑混成一個字數。'],
    ['英文詞與數字', '英文詞使用瀏覽器原生 Intl.Segmenter 分詞；連續數字視為一組，數字不算英文詞。'],
    ['時間估算', '可調整中文字符／分鐘、英文詞／分鐘與段落間停頓，30／60／90 秒目標只用來顯示差距。'],
    ['隱私', '稿件只在目前分頁記憶體中處理，不會自動保存或送出正文；複製摘要也不會把正文送到分析事件。']
  ],
  faqs: [
    ['為什麼總字符和中文字符不一樣？', '總字符以 grapheme cluster 計算，會包含英文、數字、標點、空白與 emoji；中文字符只計入 Han Script，兩者本來就是不同欄位。'],
    ['口播秒數是精準錄音長度嗎？', '不是。它依你設定的中文／英文語速與段落間停頓估算，真人語氣、換氣、重錄與剪輯都可能改變實際長度。'],
    ['我的稿件會被保存或上傳嗎？', '不會自動保存或上傳。頁面關閉後稿件不會由本工具恢復；只有你主動複製摘要時，摘要會留在你的剪貼簿。']
  ],
  releaseNotes: [
    '初版：分開統計中文字符、英文詞、數字組、空白、標點與 grapheme 總字符。',
    '初版：加入自訂語速、段落停頓、30／60／90 秒目標、逐段估算與摘要複製。'
  ],
  script: '/web-assets/public-tools/script-counter.mjs'
};
