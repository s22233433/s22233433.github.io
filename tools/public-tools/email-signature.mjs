export const tool = {
  id: 'email-signature',
  slug: 'email-signature-generator',
  title: 'Email 簽名檔產生器',
  description: '用三種輕量模板製作可貼到 Gmail、Outlook 或 Apple Mail 的 Email 簽名檔；內容只在目前瀏覽器處理。',
  body: `
    <div class="tool-grid signature-tool" data-tool="email-signature">
      <section class="panel signature-editor-panel" aria-labelledby="signature-editor-title">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">EMAIL SIGNATURE</p>
            <h2 id="signature-editor-title">先整理資訊，再貼進郵件設定</h2>
            <p class="panel-intro">選擇版型、填入需要的欄位，右側會同步產生排版與純文字版本。沒有填寫的欄位不會留下多餘分隔線。</p>
          </div>
        </div>
        <form id="email-signature-form" class="signature-form" novalidate>
          <div class="fields signature-fields">
            <label>版型
              <select name="template" id="signature-template">
                <option value="plain">純文字商務</option>
                <option value="logo">Logo 商務</option>
                <option value="bilingual">中英雙語</option>
              </select>
            </label>
            <label>主色
              <input name="color" type="color" value="#315b9d" aria-describedby="signature-color-help">
            </label>
            <label>字級（px）
              <input name="fontSize" type="number" min="10" max="22" step="1" value="14" inputmode="numeric">
            </label>
          </div>
          <p class="field-help" id="signature-color-help">主色只會套用在產生的文字與分隔線，郵件客戶端可能有自己的顯示差異。</p>
          <div class="fields signature-fields">
            <label>姓名
              <input name="name" autocomplete="name" placeholder="例：王小明">
            </label>
            <label>職稱
              <input name="title" autocomplete="organization-title" placeholder="例：專案經理">
            </label>
            <label>公司／品牌
              <input name="company" autocomplete="organization" placeholder="例：榛菓行銷">
            </label>
            <label>電話
              <input name="phone" type="tel" autocomplete="tel" placeholder="例：02-1234-5678">
            </label>
            <label>Email
              <input name="email" type="email" autocomplete="email" placeholder="例：hello@example.com">
            </label>
            <label>網站（選填）
              <input name="website" type="url" inputmode="url" placeholder="https://example.com">
            </label>
            <label>LINE／WeChat 顯示文字（選填）
              <input name="chatLabel" placeholder="例：LINE：@example">
            </label>
            <label>LINE／WeChat 連結（選填）
              <input name="chatUrl" type="url" inputmode="url" placeholder="https://line.me/...">
            </label>
          </div>
          <div class="fields signature-fields signature-bilingual-fields">
            <label>英文姓名（雙語版選填）
              <input name="nameEn" autocomplete="name" placeholder="例：Ming Wang">
            </label>
            <label>英文職稱（雙語版選填）
              <input name="titleEn" autocomplete="organization-title" placeholder="例：Project Manager">
            </label>
            <label>英文公司／品牌（雙語版選填）
              <input name="companyEn" autocomplete="organization" placeholder="例：ZhenguoCool">
            </label>
          </div>
          <div class="fields signature-logo-field">
            <label>Logo 公開 HTTPS 圖片網址（Logo 版選填）
              <input name="logoUrl" type="url" inputmode="url" placeholder="https://example.com/logo.png" aria-describedby="signature-logo-help">
            </label>
          </div>
          <p class="field-help" id="signature-logo-help">只接受你已公開且可直接讀取的 HTTPS 圖片網址；不會上傳或代管圖片。網址含帳密、Script 或事件內容時會被略過。</p>
          <div class="actions">
            <button class="primary" type="button" id="copy-signature-html">複製排版 HTML</button>
            <button type="button" id="copy-signature-text">複製純文字</button>
            <button type="reset" id="reset-signature">清除欄位</button>
          </div>
        </form>
        <p class="notice" id="signature-notice" role="status" aria-live="polite">尚未填寫內容；先填姓名或公司即可預覽。</p>
      </section>
      <section class="panel signature-output-panel" aria-labelledby="signature-preview-title">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">PREVIEW</p>
            <h2 id="signature-preview-title">排版預覽</h2>
          </div>
          <span class="signature-output-label">不會寄出郵件 · 預覽連結不開啟，複製後可使用</span>
        </div>
        <div class="signature-preview-grid">
          <div class="preview signature-preview-card">
            <span class="preview-label">桌機寬版</span>
            <div class="signature-preview-canvas signature-preview-wide" id="signature-preview-wide"></div>
          </div>
          <div class="preview signature-preview-card signature-preview-narrow-card">
            <span class="preview-label">窄版／手機</span>
            <div class="signature-preview-canvas signature-preview-narrow" id="signature-preview-narrow"></div>
          </div>
        </div>
        <label class="signature-source-label">HTML 原始碼（可檢查後自行貼上）
          <textarea id="signature-html-source" rows="7" readonly spellcheck="false"></textarea>
        </label>
        <details class="signature-install">
          <summary>Gmail、Outlook、Apple Mail 怎麼安裝？</summary>
          <ol>
            <li>按「複製排版 HTML」，在郵件客戶端的簽名設定區貼上；若只出現純文字，改用「複製純文字」或直接貼到支援格式的編輯器。</li>
            <li>Gmail：設定 → 查看所有設定 → 一般 → 簽名；Outlook：設定 → 郵件 → 撰寫與回覆；Apple Mail：Mail → 設定 → 簽名。</li>
            <li>寄一封測試信給自己，確認圖片載入、手機換行與連結，再決定是否套用到正式帳號。</li>
          </ol>
          <p>不同郵件客戶端對外部圖片、字型與 CSS 的支援不同；本工具不保證未測試的客戶端顯示完全一致。</p>
        </details>
      </section>
    </div>
  `,
  styles: `
    .signature-tool{--signature-ink:#172033;--signature-muted:#647087;--signature-line:#d9e0eb;--signature-accent:#315b9d;align-items:start}
    .signature-tool .panel{min-width:0}
    .signature-tool .panel-heading{display:flex;justify-content:space-between;gap:16px;align-items:start;margin-bottom:20px}
    .signature-tool .panel-heading h2{margin:0;color:var(--signature-ink);font-size:clamp(22px,3vw,32px);line-height:1.12}
    .signature-tool .panel-intro{max-width:600px;margin:10px 0 0;color:var(--signature-muted);line-height:1.7}
    .signature-tool .signature-fields{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
    .signature-tool .signature-fields label:first-child:last-child,.signature-tool .signature-logo-field label{grid-column:1/-1}
    .signature-tool .signature-bilingual-fields{padding-top:14px;border-top:1px solid var(--signature-line)}
    .signature-tool .field-help{margin:8px 0 0;color:var(--signature-muted);font-size:12px;line-height:1.6}
    .signature-tool input[type=color]{min-height:42px;padding:4px}
    .signature-tool .actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}
    .signature-tool .actions button{min-height:42px;padding:10px 14px;border:1px solid var(--signature-line);border-radius:999px;background:#fff;color:var(--signature-ink);cursor:pointer}
    .signature-tool .actions .primary{border-color:var(--signature-accent);background:var(--signature-accent);color:#fff}
    .signature-tool .actions button:focus-visible{outline:3px solid #315b9d44;outline-offset:2px}
    .signature-tool .notice{min-height:24px;margin:16px 0 0;color:var(--signature-muted);font-size:13px}
    .signature-tool .notice[data-tone=error]{color:#a33d52}
    .signature-tool .signature-output-label{color:var(--signature-muted);font-size:12px}
    .signature-tool .signature-preview-grid{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(220px,.75fr);gap:14px;align-items:start}
    .signature-tool .signature-preview-card{min-width:0;padding:14px;background:#f6f8fb;border:1px solid var(--signature-line);border-radius:14px}
    .signature-tool .preview-label{display:block;margin-bottom:12px;color:var(--signature-muted);font-size:11px;letter-spacing:.08em;text-transform:uppercase}
    .signature-tool .signature-preview-canvas{min-height:138px;padding:18px;background:#fff;border-radius:9px;overflow:auto}
    .signature-tool .signature-preview-narrow{max-width:260px;margin:0 auto}
    .signature-tool .signature-source-label{display:grid;gap:8px;margin-top:16px;color:var(--signature-muted);font-size:12px}
    .signature-tool #signature-html-source{width:100%;resize:vertical;border:1px solid var(--signature-line);border-radius:8px;background:#fbfcfe;color:var(--signature-ink);font:12px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace}
    .signature-tool .signature-install{margin-top:18px;padding-top:16px;border-top:1px solid var(--signature-line);color:var(--signature-muted);font-size:13px;line-height:1.7}
    .signature-tool .signature-install summary{color:var(--signature-ink);font-weight:700;cursor:pointer}
    .signature-tool .signature-install ol{padding-left:20px}
    @media (max-width:760px){.signature-tool .signature-fields{grid-template-columns:1fr}.signature-tool .signature-fields label:first-child:last-child,.signature-tool .signature-logo-field label{grid-column:auto}.signature-tool .signature-preview-grid{grid-template-columns:1fr}.signature-tool .signature-preview-narrow{max-width:100%}.signature-tool .panel-heading{display:block}.signature-tool .signature-output-label{display:block;margin-top:8px}}
  `,
  help: [
    ['安全輸出', '文字會先做 HTML escape；網站、LINE／WeChat 與 Logo 圖片只接受不含帳密的 HTTPS 網址，不接受 javascript:、事件屬性或上傳檔案。'],
    ['圖片限制', 'Logo 由你提供公開圖片網址，郵件客戶端可能預設阻擋外部圖片；本工具不代管圖片，也不會追蹤開信。'],
    ['相容性', 'Gmail、Outlook、Apple Mail 的貼上與外部圖片支援不同。請寄測試信確認；未實測的客戶端不作完全一致承諾。'],
    ['資料範圍', '輸入只在目前分頁記憶體中處理，不會自動保存、寄信或送到回報系統。']
  ],
  faqs: [
    ['為什麼 Logo 沒有出現在簽名檔？', '請確認使用 Logo 商務版，且圖片網址是可直接讀取、沒有帳密的 HTTPS 公開網址。部分郵件客戶端仍可能預設阻擋外部圖片。'],
    ['可以直接貼到 Gmail 或 Outlook 嗎？', '可以先複製排版 HTML，再到郵件客戶端的簽名設定區貼上；貼上後請寄測試信確認換行、圖片與連結。'],
    ['這個工具會上傳我的聯絡資料嗎？', '不會。產生、預覽與複製都在目前瀏覽器處理，不會自動保存或寄出郵件。']
  ],
  releaseNotes: [
    '初版：提供純文字商務、Logo 商務與中英雙語三種模板。',
    '初版：加入 HTML／純文字複製、安全 HTTPS 網址檢查與郵件客戶端安裝說明。'
  ],
  script: '/web-assets/public-tools/email-signature.mjs'
};
