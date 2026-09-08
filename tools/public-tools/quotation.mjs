export const tool = {
  id: 'quotation',
  slug: 'quotation-generator',
  title: '報價單產生器',
  description: '在瀏覽器內填寫明細、折扣與稅制，立即預覽並列印成 A4 PDF。資料只留在你的瀏覽器。',
  body: `
<section class="quotation-tool" data-tool="quotation" aria-labelledby="quotation-tool-title">
  <div class="quotation-toolbar panel">
    <div>
      <p class="quotation-eyebrow">PUBLIC QUOTATION · LOCAL FIRST</p>
      <h2 id="quotation-tool-title">把範圍寫清楚，再交給數字說話。</h2>
      <p class="quotation-lede">選一個起始方向，或從空白報價開始。模板中的人物、公司與金額都是虛構示例；正式文件不會帶入任何內部資料。</p>
    </div>
    <div class="quotation-templates" role="group" aria-label="選擇報價模板">
      <button type="button" class="template-button" data-quotation-template="blank"><span>01</span>空白報價</button>
      <button type="button" class="template-button" data-quotation-template="general"><span>02</span>一般接案</button>
      <button type="button" class="template-button" data-quotation-template="design"><span>03</span>設計製作</button>
      <button type="button" class="template-button" data-quotation-template="creator"><span>04</span>網紅合作</button>
    </div>
  </div>

  <p class="notice quotation-status" id="quotation-status" role="status" aria-live="polite" hidden></p>

  <div class="tool-grid quotation-grid">
    <form class="panel quotation-editor" id="quotation-form" novalidate>
      <input type="hidden" name="template" value="blank">

      <section class="quotation-section">
        <div class="section-kicker"><span>01</span><span>文件</span></div>
        <h3>先把這份報價辨識清楚</h3>
        <div class="fields">
          <label>報價編號<input name="quoteNumber" autocomplete="off" placeholder="例：Q-2026-001"></label>
          <label>幣別<select name="currency"><option value="TWD">新台幣（TWD）</option><option value="USD">美元（USD）</option><option value="JPY">日圓（JPY）</option><option value="EUR">歐元（EUR）</option><option value="CNY">人民幣（CNY）</option></select></label>
          <label>報價日期<input name="quoteDate" type="date"></label>
          <label>有效日期<input name="validUntil" type="date"></label>
        </div>
      </section>

      <section class="quotation-section">
        <div class="section-kicker"><span>02</span><span>雙方資訊</span></div>
        <h3>誰在提出、誰在確認</h3>
        <div class="party-grid">
          <fieldset>
            <legend>開立方</legend>
            <div class="fields">
              <label>姓名／聯絡人<input name="issuerName" autocomplete="name" placeholder="你的姓名或團隊名稱"></label>
              <label>公司／工作室<input name="issuerCompany" autocomplete="organization" placeholder="公司或工作室名稱"></label>
              <label>Email<input name="issuerEmail" type="email" autocomplete="email" placeholder="name@example.com"></label>
              <label>電話<input name="issuerPhone" autocomplete="tel" placeholder="可留白"></label>
              <label class="full">地址<input name="issuerAddress" autocomplete="street-address" placeholder="可留白"></label>
            </div>
          </fieldset>
          <fieldset>
            <legend>客戶</legend>
            <div class="fields">
              <label>姓名／聯絡人<input name="clientName" autocomplete="name" placeholder="客戶姓名或聯絡人"></label>
              <label>公司／品牌<input name="clientCompany" autocomplete="organization" placeholder="客戶公司或品牌"></label>
              <label>Email<input name="clientEmail" type="email" autocomplete="email" placeholder="可留白"></label>
              <label>電話<input name="clientPhone" autocomplete="tel" placeholder="可留白"></label>
              <label class="full">地址<input name="clientAddress" autocomplete="street-address" placeholder="可留白"></label>
            </div>
          </fieldset>
        </div>
        <div class="logo-row">
          <label class="file-label">Logo（選填，本機圖片）<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" data-action="logo-file"></label>
          <button type="button" class="text-button" data-action="clear-logo">移除 Logo</button>
          <small>不會上傳；建議使用 650 KB 以內的圖片。</small>
        </div>
      </section>

      <section class="quotation-section">
        <div class="section-kicker"><span>03</span><span>明細</span></div>
        <div class="section-title-row"><h3>每一筆交付都要有邊界</h3><button type="button" class="secondary-button" data-action="add-item">＋ 新增明細</button></div>
        <div id="quotation-items" class="quotation-items"></div>
        <p class="field-hint">可加入最多 50 筆；數量與單價不接受負值。</p>
      </section>

      <section class="quotation-section">
        <div class="section-kicker"><span>04</span><span>計算</span></div>
        <h3>把折扣與稅制寫在同一張紙上</h3>
        <div class="fields">
          <label>折扣方式<select name="discountMode"><option value="percent">百分比折扣</option><option value="fixed">固定金額折扣</option></select></label>
          <label>折扣值<input name="discountValue" type="number" min="0" step="0.01" placeholder="0"></label>
          <label>稅額方式<select name="taxMode"><option value="exclusive">未稅：稅額外加</option><option value="inclusive">含稅：從總價拆出</option></select></label>
          <label>稅率（%）<input name="taxRate" type="number" min="0" max="100" step="0.01" placeholder="例：5"></label>
        </div>
        <p class="field-hint" id="quotation-tax-hint">稅額會加在折扣後的小計上。</p>
      </section>

      <section class="quotation-section">
        <div class="section-kicker"><span>05</span><span>備註</span></div>
        <h3>留給雙方下一步看的話</h3>
        <label>報價備註<textarea name="notes" rows="5" placeholder="例如：交付格式、修改輪次、使用權或未包含的項目"></textarea></label>
      </section>

      <section class="quotation-section quotation-actions-section">
        <div class="actions quotation-actions">
          <button type="button" class="primary" data-action="generate">更新預覽</button>
          <button type="button" class="secondary-button" data-action="print">列印／儲存 PDF</button>
          <button type="button" class="secondary-button" data-action="clear-form">清空目前內容</button>
        </div>
        <p class="field-hint">PDF 使用瀏覽器原生列印功能；請在列印視窗選擇「儲存為 PDF」。</p>
      </section>

      <details class="quotation-section draft-panel">
        <summary>本機草稿與 JSON</summary>
        <p class="field-hint">草稿只留在這個瀏覽器，不會自動同步。匯入前會檢查檔案大小與欄位格式。</p>
        <div class="actions draft-actions">
          <button type="button" class="secondary-button" data-action="save-draft">儲存草稿</button>
          <button type="button" class="secondary-button" data-action="save-as-draft">另存新草稿</button>
          <button type="button" class="secondary-button" data-action="export-json">匯出 JSON</button>
          <label class="secondary-button file-button">匯入 JSON<input type="file" accept="application/json,.json" data-action="import-json"></label>
          <button type="button" class="text-button danger-button" data-action="clear-drafts">清除所有草稿</button>
        </div>
        <div class="draft-list" id="quotation-drafts"></div>
      </details>
    </form>

    <div class="quotation-preview-wrap">
      <article class="preview quotation-preview" id="quotation-preview" aria-label="報價單預覽">
        <header class="preview-header">
          <div class="preview-issuer">
            <img id="preview-logo" alt="開立方 Logo" hidden>
            <div>
              <p class="preview-kicker">QUOTATION / PREVIEW</p>
              <h2 id="preview-issuer-name">—</h2>
              <p id="preview-issuer-company" class="preview-muted"></p>
            </div>
          </div>
          <div class="preview-title-block"><span>報價單</span><small id="preview-currency">TWD</small></div>
        </header>
        <div class="preview-meta">
          <div><span>報價編號</span><strong id="preview-quote-number">—</strong></div>
          <div><span>報價日期</span><strong id="preview-quote-date">—</strong></div>
          <div><span>有效日期</span><strong id="preview-valid-until">—</strong></div>
          <div><span>客戶</span><strong id="preview-client-name">—</strong><small id="preview-client-company"></small></div>
          <div><span>稅額方式</span><strong id="preview-tax-mode">未稅＋0%</strong></div>
        </div>
        <section class="preview-section">
          <div class="preview-section-heading"><span>DELIVERABLES</span><b>合作明細</b></div>
          <table class="preview-table">
            <thead><tr><th>項目</th><th>說明</th><th class="number">數量</th><th class="number">單價</th><th class="number">小計</th></tr></thead>
            <tbody id="preview-items"></tbody>
          </table>
        </section>
        <section class="preview-totals" aria-label="報價總計">
          <div><span>明細小計</span><strong id="preview-subtotal">NT$0</strong></div>
          <div><span id="preview-discount-label">折扣（0%）</span><strong id="preview-discount">NT$0</strong></div>
          <div><span>未稅金額</span><strong id="preview-pretax">NT$0</strong></div>
          <div><span>稅額</span><strong id="preview-tax">NT$0</strong></div>
          <div class="preview-grand"><span>應付總計</span><strong id="preview-total">NT$0</strong></div>
        </section>
        <section class="preview-notes preview-section">
          <div class="preview-section-heading"><span>NOTES</span><b>備註</b></div>
          <p id="preview-notes">—</p>
        </section>
        <footer class="preview-footer">此文件由瀏覽器本機產生，正式合作條件仍請由雙方確認。<span>／</span>未提供法定電子發票或線上簽約功能。</footer>
      </article>
    </div>
  </div>
</section>
<template id="quotation-item-template">
  <div class="quotation-item">
    <div class="item-index" aria-hidden="true"></div>
    <div class="fields item-fields">
      <label>項目名稱<input data-field="name" placeholder="例：品牌短影音"></label>
      <label>交付說明<input data-field="description" placeholder="例：一支影片、一次修改"></label>
      <label>數量<input data-field="quantity" type="number" min="0" step="0.01" value="1"></label>
      <label>單價<input data-field="unitPrice" type="number" min="0" step="0.01" placeholder="0"></label>
      <label class="full">這筆備註<input data-field="note" placeholder="可留白"></label>
    </div>
    <button type="button" class="remove-item" data-action="remove-item" aria-label="移除明細">移除</button>
  </div>
</template>
`,
  styles: `
.quotation-tool{--q-ink:#1f292b;--q-muted:#69716e;--q-line:#d8ddd5;--q-paper:#fffefb;--q-ground:#eef1eb;--q-accent:#d2614b;--q-accent-dark:#a74436;--q-soft:#e8eee6;position:relative;color:var(--q-ink);font-family:"Avenir Next","PingFang TC",sans-serif}.quotation-tool:before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(circle at 7% 0%,#fff 0,transparent 34%),linear-gradient(135deg,var(--q-ground),#f7f6ef 54%,#e7ece7)}.quotation-toolbar{display:flex;justify-content:space-between;gap:32px;align-items:end;margin-bottom:14px;padding:clamp(24px,4vw,46px);background:linear-gradient(120deg,#fdfbf5,#eaf0e8);border:1px solid var(--q-line);border-radius:2px;box-shadow:0 20px 60px #344d4212}.quotation-eyebrow,.preview-kicker,.section-kicker{margin:0;color:var(--q-accent-dark);font-size:10px;letter-spacing:.16em;font-weight:800}.quotation-toolbar h2{max-width:650px;margin:12px 0 9px;font-family:"Iowan Old Style","Noto Serif TC",serif;font-size:clamp(28px,4vw,48px);font-weight:600;letter-spacing:-.03em;line-height:1.08}.quotation-lede{max-width:640px;margin:0;color:var(--q-muted);line-height:1.7;font-size:14px}.quotation-templates{display:grid;grid-template-columns:repeat(2,minmax(118px,1fr));gap:8px;min-width:250px}.template-button{display:flex;align-items:center;gap:8px;padding:11px 12px;border:1px solid var(--q-line);border-radius:1px;background:#fffdf7;color:var(--q-ink);font-size:12px;text-align:left;cursor:pointer;transition:.18s ease}.template-button span{color:var(--q-accent);font-size:10px;font-weight:800}.template-button:hover,.template-button.is-selected{border-color:var(--q-accent);background:#fff5ee;transform:translateY(-1px)}.quotation-status{margin:0 0 14px}.quotation-grid{gap:18px;align-items:start}.quotation-editor{padding:clamp(20px,3vw,32px);background:#fffefa;border:1px solid var(--q-line);border-radius:2px}.quotation-section{padding:25px 0;border-top:1px solid var(--q-line)}.quotation-section:first-of-type{padding-top:0;border-top:0}.section-kicker{display:flex;gap:8px;margin-bottom:8px}.section-kicker span:first-child{color:var(--q-ink);font-variant-numeric:tabular-nums}.quotation-section h3{margin:0 0 17px;font-family:"Iowan Old Style","Noto Serif TC",serif;font-size:23px;font-weight:600;letter-spacing:-.02em}.fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}.fields label,.logo-row label,.quotation-editor>label{display:grid;gap:6px;color:var(--q-muted);font-size:12px;line-height:1.3}.fields .full{grid-column:1/-1}.quotation-tool input,.quotation-tool select,.quotation-tool textarea{width:100%;min-width:0;border:1px solid var(--q-line);border-radius:1px;background:#fffefb;color:var(--q-ink);padding:10px 11px;font:inherit;font-size:13px;line-height:1.35}.quotation-tool textarea{resize:vertical;min-height:100px}.quotation-tool input:focus,.quotation-tool select:focus,.quotation-tool textarea:focus,.quotation-tool button:focus-visible{outline:3px solid #d2614b33;outline-offset:2px;border-color:var(--q-accent)}.quotation-tool fieldset{min-width:0;margin:0;padding:16px;border:1px solid var(--q-line);background:#fafbf6}.quotation-tool legend{padding:0 7px;color:var(--q-accent-dark);font-size:11px;font-weight:800;letter-spacing:.1em}.party-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.logo-row{display:flex;align-items:end;gap:12px;margin-top:14px;flex-wrap:wrap}.logo-row small{color:var(--q-muted);font-size:11px}.file-label{max-width:250px}.file-label input[type=file]{padding:7px;font-size:11px}.section-title-row{display:flex;align-items:center;justify-content:space-between;gap:12px}.section-title-row h3{margin-bottom:17px}.secondary-button,.primary,.text-button,.remove-item{border:1px solid var(--q-line);border-radius:1px;padding:10px 13px;background:#fffefb;color:var(--q-ink);font:inherit;font-size:12px;cursor:pointer}.primary{border-color:var(--q-accent);background:var(--q-accent);color:#fff;font-weight:800}.primary:hover{background:var(--q-accent-dark)}.secondary-button:hover,.text-button:hover{border-color:var(--q-accent);color:var(--q-accent-dark)}.text-button{padding:4px 0;border:0;background:transparent}.danger-button{color:var(--q-accent-dark)}.field-hint{margin:9px 0 0;color:var(--q-muted);font-size:11px;line-height:1.55}.quotation-items{display:grid;gap:10px}.quotation-item{position:relative;display:grid;grid-template-columns:25px 1fr auto;gap:10px;padding:14px 11px 11px;border:1px solid var(--q-line);background:#fafbf6}.item-index:before{content:"";display:block;width:21px;height:21px;border-radius:50%;background:var(--q-ink);color:#fff}.item-index:after{content:counter(quotation-item);counter-increment:quotation-item;position:absolute;top:17px;left:0;width:21px;color:#fff;font-size:10px;font-weight:800;text-align:center}.quotation-items{counter-reset:quotation-item}.item-fields{gap:9px}.item-fields label{font-size:11px}.item-fields input{padding:8px 9px;font-size:12px}.remove-item{align-self:start;padding:3px 0;border:0;background:transparent;color:var(--q-accent-dark);font-size:11px}.actions{display:flex;flex-wrap:wrap;align-items:center;gap:9px}.quotation-actions{padding-top:0}.quotation-actions-section{padding-bottom:0}.draft-panel{margin-top:10px;padding-top:18px}.draft-panel summary{cursor:pointer;font-weight:800;font-size:13px}.draft-actions{margin-top:14px}.file-button{display:inline-flex;align-items:center}.file-button input{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}.draft-list{margin-top:13px;border-top:1px solid var(--q-line)}.draft-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px solid var(--q-line);font-size:11px}.draft-row>span:first-child{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.draft-row>span:last-child{display:flex;gap:10px;flex:0 0 auto}.draft-empty{margin:12px 0;color:var(--q-muted);font-size:11px}.notice{padding:10px 13px;border:1px solid #bfcfc0;background:#eff7ed;color:#3d6044;font-size:12px;line-height:1.5}.notice.is-error{border-color:#e4b7b2;background:#fff1ee;color:#9d3e35}.notice.is-success{border-color:#bfcfc0}.quotation-preview-wrap{position:sticky;top:18px;min-width:0}.quotation-preview{width:100%;min-height:920px;padding:clamp(24px,4vw,50px);background:var(--q-paper);border:1px solid #e1ddd4;box-shadow:0 24px 60px #33433718}.preview-header{display:flex;justify-content:space-between;align-items:start;gap:24px;padding-bottom:24px;border-bottom:2px solid var(--q-ink)}.preview-issuer{display:flex;align-items:center;gap:13px;min-width:0}.preview-issuer img{width:44px;height:44px;object-fit:cover;border-radius:50%;border:1px solid var(--q-line)}.preview-kicker{font-size:9px}.preview-issuer h2{margin:6px 0 2px;font-family:"Iowan Old Style","Noto Serif TC",serif;font-size:25px;line-height:1.1;overflow-wrap:anywhere}.preview-muted,.preview-issuer p{margin:0;color:var(--q-muted);font-size:11px;overflow-wrap:anywhere}.preview-title-block{text-align:right}.preview-title-block span{display:block;font-family:"Iowan Old Style","Noto Serif TC",serif;font-size:28px;font-weight:600}.preview-title-block small{display:block;margin-top:4px;color:var(--q-accent-dark);font-size:10px;letter-spacing:.16em}.preview-meta{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px 22px;padding:22px 0}.preview-meta>div{min-width:0;padding-bottom:8px;border-bottom:1px solid var(--q-line)}.preview-meta span,.preview-meta strong,.preview-meta small{display:block}.preview-meta span{color:var(--q-muted);font-size:10px}.preview-meta strong{margin-top:4px;font-size:12px;overflow-wrap:anywhere}.preview-meta small{margin-top:2px;color:var(--q-muted);font-size:10px;overflow-wrap:anywhere}.preview-section{margin-top:22px}.preview-section-heading{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding-bottom:9px;border-bottom:1px solid var(--q-ink)}.preview-section-heading span{color:var(--q-accent-dark);font-size:9px;letter-spacing:.16em;font-weight:800}.preview-section-heading b{font-family:"Iowan Old Style","Noto Serif TC",serif;font-size:16px}.preview-table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:11px}.preview-table th,.preview-table td{padding:10px 6px;border-bottom:1px solid var(--q-line);text-align:left;vertical-align:top;overflow-wrap:anywhere}.preview-table th{color:var(--q-muted);font-size:10px;font-weight:600}.preview-table th:nth-child(1){width:23%}.preview-table th:nth-child(2){width:33%}.preview-table th:nth-child(3){width:11%}.preview-table th:nth-child(4){width:16%}.preview-table th:nth-child(5){width:17%}.preview-table .number{text-align:right;white-space:nowrap}.preview-line-note{margin-top:4px;color:var(--q-muted);font-size:9px;white-space:pre-wrap}.preview-empty{padding:20px 6px!important;color:var(--q-muted);text-align:center!important}.preview-totals{width:min(100%,330px);margin:22px 0 0 auto;font-size:12px}.preview-totals>div{display:flex;justify-content:space-between;gap:20px;padding:7px 0;border-bottom:1px solid var(--q-line)}.preview-totals strong{font-variant-numeric:tabular-nums;text-align:right}.preview-grand{margin-top:5px;padding-top:12px!important;border-bottom:0!important;color:var(--q-accent-dark);font-size:18px;font-weight:800}.preview-notes p{min-height:34px;margin:13px 0 0;color:var(--q-muted);font-size:11px;line-height:1.7;white-space:pre-wrap;overflow-wrap:anywhere}.preview-footer{margin-top:44px;padding-top:13px;border-top:1px solid var(--q-line);color:var(--q-muted);font-size:10px;line-height:1.6}.preview-footer span{padding:0 5px;color:var(--q-accent)}@media(max-width:1040px){.quotation-toolbar{display:block}.quotation-templates{max-width:540px;margin-top:24px}.quotation-preview-wrap{position:static}.quotation-grid{grid-template-columns:1fr}}@media(max-width:680px){.fields,.party-grid{grid-template-columns:1fr}.fields .full{grid-column:auto}.quotation-toolbar{padding:24px 20px}.quotation-toolbar h2{font-size:33px}.quotation-templates{grid-template-columns:1fr 1fr;min-width:0}.quotation-editor{padding:20px 16px}.quotation-preview{padding:25px 19px}.preview-header{display:block}.preview-title-block{margin-top:18px;text-align:left}.preview-meta{grid-template-columns:1fr}.quotation-item{grid-template-columns:22px 1fr}.remove-item{grid-column:2;justify-self:start}.draft-row{align-items:flex-start;flex-direction:column}.draft-row>span:last-child{gap:14px}.preview-table{font-size:10px}.preview-table th,.preview-table td{padding:8px 3px}.preview-table th:nth-child(1){width:22%}.preview-table th:nth-child(2){width:28%}.preview-table th:nth-child(3){width:12%}.preview-table th:nth-child(4){width:19%}.preview-table th:nth-child(5){width:19%}}@media print{body>*:not(.tool-shell){display:none!important}body>.tool-shell{display:block!important;max-width:none!important;margin:0!important;padding:0!important}.tool-shell>*:not(#tool-workspace){display:none!important}#tool-workspace{display:block!important;width:auto!important;max-width:none!important;margin:0!important;padding:0!important;background:#fff!important}#tool-workspace .quotation-tool{display:block!important;padding:0!important;background:#fff!important}#tool-workspace .quotation-toolbar,#tool-workspace .quotation-status,#tool-workspace .quotation-editor,#tool-workspace .draft-panel{display:none!important}#tool-workspace .quotation-grid{display:block!important;margin:0!important}#tool-workspace .quotation-preview-wrap{display:block!important;position:static!important;margin:0!important}#quotation-preview{display:block!important;width:210mm!important;max-width:none!important;min-height:0!important;margin:0!important;padding:14mm 13mm!important;border:0!important;box-shadow:none!important;background:#fff!important;color:#111!important}#quotation-preview .preview-section{break-inside:auto;page-break-inside:auto}#quotation-preview thead{display:table-header-group}#quotation-preview tr{break-inside:avoid;page-break-inside:avoid}#quotation-preview td,#quotation-preview th{overflow-wrap:anywhere}#quotation-preview .preview-footer{margin-top:28px}}@page{size:A4 portrait;margin:0}
@media print{#quotation-status{display:none!important}#quotation-preview{width:auto!important;padding:0!important}#quotation-preview,#quotation-preview *{font-family:"Songti TC","Noto Serif TC","Microsoft JhengHei",serif!important;color:#111!important}.preview-header,.preview-meta,.preview-totals,.preview-notes,.preview-footer{break-inside:avoid}}@page{size:A4 portrait;margin:12mm}
`,
  help: [
    ['怎麼開始？', '先選空白報價或三種虛構模板之一，再逐欄填寫。模板只在你主動點選時套用。'],
    ['資料會上傳嗎？', '不會。計算、預覽、Logo、草稿與 JSON 都在瀏覽器本機處理；頁面外框可能仍有官網自己的匿名分析，工具不把欄位內容送出。'],
    ['如何輸出 PDF？', '按「更新預覽」確認內容，再按「列印／儲存 PDF」，於瀏覽器列印視窗選擇儲存為 PDF。'],
  ],
  faqs: [
    ['含稅與未稅怎麼算？', '未稅模式會把稅額加在折扣後金額；含稅模式則把總價視為已含稅，拆出稅額供參考。'],
    ['可以保存多份報價嗎？', '可以。按「儲存草稿」後，草稿只存在目前瀏覽器；也可匯出 JSON 手動備份或換裝置。'],
    ['這個工具能開立電子發票或收款嗎？', '不能。它只產生可列印的報價文件，不連接發票、付款、簽約或寄送服務。'],
  ],
  releaseNotes: [
    'v1.0.0：新增三種虛構起始模板、可編輯明細／折扣／稅制、A4 原生列印、瀏覽器草稿與驗證過的 JSON 匯入／匯出。',
  ],
  script: '/web-assets/public-tools/quotation.mjs',
};

export default tool;
