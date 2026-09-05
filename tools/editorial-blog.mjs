import fs from 'node:fs';
import path from 'node:path';
import { newsPosts } from './editorial-news-content.mjs';
import { blogLocales, translatePost } from './editorial-locales.mjs';
export { blogLocales } from './editorial-locales.mjs';

export const published = '2026-09-05';
const base = 'https://zhenguocool.com';
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const views = [1200, 1500, 1800, 2000, 2200, 2400, 2600, 3000, 3300, 30000];
export const mean = views.reduce((a,b) => a+b,0) / views.length;
export const median = (views[4]+views[5])/2;
const num = n => n.toLocaleString('en-US');
const figure = (content, caption) => `<figure class="explainer">${content}<figcaption>${caption}</figcaption></figure>`;
const panel = (n,title,body) => `<div class="note-panel"><span class="number">${n}</span><h3>${title}</h3>${body}</div>`;
const section = (id,title,body) => `<section id="${id}" class="chapter"><h2>${title}</h2>${body}</section>`;

const originalPosts = [
  {
    slug: 'reading-social-comment-signals', category:'社群觀察', categoryId:'observation', number:'01',
    title:'留言很多，就代表內容有效嗎？讀懂互動裡的不同訊號',
    description:'從抽獎口令、一般稱讚、產品提問到使用經驗，練習看懂留言的上下文；不把互動數直接當成購買意願。',
    coverAlt:'自然窗光下的手機、筆記本、紙張與鉛筆，呈現停下來閱讀和整理的情境。',
    caption:'AI 生成情境配圖｜停下來，把看見的訊號整理清楚。非真實私人訊息或工作紀錄。',
    toc:[['signals','先看大家在回應什麼'],['context','把留言放回原來的情境'],['practice','留下一個可驗證的問題']],
    body:`<p class="lead">想像兩支影片都收到一百則留言。一邊反覆出現「已追蹤、已分享」，另一邊有人問甜度、保存方式，還有人描述自己的使用經驗。它們的留言數一樣，但你能從中讀到的事情，並不一樣。</p>
    <p>這是假設情境，不是榛菓的客戶成效。這篇筆記想做的，是把「好多互動」拆成比較具體的觀察。留言不是購買紀錄，也不是觀眾內心的直接讀數；它比較像一扇小窗，讓我們看見部分願意開口的人，正在回應內容的哪一部分。</p>
    ${section('signals','01 / 先看大家在回應什麼',`<p>先不要把每則留言分成好或壞。可以從留言本身出發，做一個方便整理的分類；以下四類不是平台官方規則，也不是成效由低到高的排行榜。</p>
    ${figure(`<div class="signal-grid">${panel('A','任務回覆','<blockquote>「已標記朋友，想參加！」</blockquote><p>可看見：有人回應活動要求。</p><p class="limit">不能證明：對產品有購買意願。</p>')}${panel('B','一般稱讚','<blockquote>「這個畫面好好看。」</blockquote><p>可看見：畫面或表達引起回應。</p><p class="limit">不能證明：對方記得品牌。</p>')}${panel('C','產品提問','<blockquote>「不加糖也能點嗎？」</blockquote><p>可看見：出現具體資訊需求。</p><p class="limit">不能證明：提問者一定會購買。</p>')}${panel('D','使用經驗','<blockquote>「我上週買的那杯茶味更重。」</blockquote><p>可看見：有人自述使用經驗。</p><p class="limit">不能證明：經驗已獲查證或具有代表性。</p>')}</div>`,'圖 1｜以上留言皆為虛構示意。四類可以重疊；無法判斷時保留「其他／不確定」。')}
    <p>同一個人也可能先稱讚畫面，再問產品規格，不需要硬塞進互斥的格子。若留言在抱怨到貨、質疑說法，或討論與產品無關的笑點，可以另外記下，不必為了讓結果漂亮而刪掉它。</p>`) }
    ${section('context','02 / 把留言放回原來的情境',`<p>「想買」可能是真實需求，也可能是接梗；「這真的有用嗎？」可能是詢問，也可能在反諷。只抽出幾個字，會把原本的語氣與對話弄丟。閱讀時應一起看貼文內容、留言串、創作者回覆，以及是否有抽獎或提問引導。</p>
    <p>挑樣本的方法也要記錄。只看置頂或排序最前面的留言，不能代表全部討論；只挑你喜歡的句子，更容易得到原本就想相信的答案。如果只是快速閱讀，就坦白寫「抽看前二十則可見留言」，不要寫成整體受眾調查。</p>
    ${figure(`<ol class="steps"><li><span>01</span><h3>先分類</h3><p>記錄在談畫面、產品、活動，還是其他事情。</p></li><li><span>02</span><h3>補上下文</h3><p>回看原文與對話，保留抽獎、疑問或反諷的可能。</p></li><li><span>03</span><h3>留待驗證</h3><p>把推測改寫成下一個需要補資料的問題。</p></li></ol>`,'圖 2｜整理流程示意：從看見的內容走到待確認的問題，而不是直接跳到成效結論。')}
    <p>如果想比較兩篇內容，觀察時間也應盡量一致。剛發布的影片和已經累積數週討論的影片，本來就處於不同階段。記下抽看日期、可見範圍與選取方式，往後才知道你比較的是什麼。</p>`) }
    ${section('practice','03 / 留下一個可驗證的問題',`<p>比起寫「這篇很有效」，試著寫「抽看的留言裡，多次出現甜度問題；影片是否漏講選項？」這句話沒有假裝知道成交結果，卻能幫助下一次內容補上資訊。接著可以查看是否已有清楚回覆，或在下一篇用不同方式說明，再觀察問題是否改變。</p>
    <aside class="margin-note"><strong>今天可以做的小練習</strong><p>選一篇公開貼文，讀十則你能看到的留言。每則記下「原話摘要」「上下文」「目前不能確定什麼」。最後只寫一個值得繼續查的問題。</p></aside>
    <p>真正重要的不是把留言做成一個看似精密的分數，而是讓判斷慢半步：知道自己看到了什麼，也知道哪些事還沒有證據。沒有留言的人同樣是觀眾，只是這個方法聽不到他們的聲音；更不能用少數留言推論所有受眾的想法。</p>`) }
    <div class="source-note"><h2>編輯與素材說明</h2><p>本文是榛菓編輯部提出的閱讀練習，不是平台指標定義或成效研究。分類、留言與情境皆為原創示意，未引用客戶資料、真實帳號或私人對話。</p></div>`
  },
  {
    slug:'beverage-content-storytelling', category:'內容拆解', categoryId:'storytelling', number:'02',
    title:'同一杯飲料，為什麼有人拍成廣告，有人拍成生活？',
    description:'用一杯虛構飲品與六格分鏡，比較產品導向和情境導向的敘事起點，觀察鏡頭、字幕與資訊如何合作。',
    coverAlt:'窗邊木桌上一杯透光的琥珀色冰茶，背景是模糊街景，呈現生活敘事的情境。',
    caption:'AI 生成情境配圖｜同一杯飲料，換一個故事起點。非真實商品、拍攝現場或合作案例。',
    toc:[['opening','先決定從哪裡開始說'],['frames','六格分鏡看兩種路徑'],['information','把畫面和資訊分工']],
    body:`<p class="lead">同一杯飲料，可以從杯身的近拍開始，也可以從一個人走完很熱的路、坐下來休息開始。前者先讓我們看見產品，後者先讓我們進入情境。差別不只在畫面漂不漂亮，而在第一個被提出的問題是什麼。</p>
    <p>下面用一杯沒有品牌、沒有真實成效資料的虛構茶飲練習拆解。不是說生活化一定比廣告式有效，也不是鼓勵把商業合作偽裝成日常。我們只是把敘事拆開，看每個鏡頭正在負責哪一件事。</p>
    ${section('opening','01 / 先決定從哪裡開始說',`<p>產品導向的起點可以是「這是什麼？有什麼特色？」畫面先交代杯子、配料或製作方式，再補喝起來的描述。資訊集中，適合需要清楚展示細節的內容；代價是如果每個畫面都只重複賣點，觀眾可能不知道它與自己的生活有什麼關係。</p>
    <p>情境導向則先問「我在什麼時候會遇到這杯飲料？」例如工作告一段落、與朋友散步，或者替午餐找一個搭配。產品是情境的一部分，但如果故事一路講完卻沒有交代飲品，觀眾也可能只記得散步和風景。</p>
    <p>兩者不是對立的風格。一支內容可以先從生活情境進入，再切到產品細節。要避免的不是某一種形式，而是鏡頭很多、資訊很多，卻找不到它們彼此之間的關係。</p>`) }
    ${section('frames','02 / 六格分鏡，看兩種路徑',`<p>試著替同一杯虛構茶飲安排三個鏡頭。先看畫面順序，再讀每格下面的文字；這份分鏡只表示敘事功能，不代表特定平台的最佳秒數或成功公式。</p>
    ${figure(`<div class="story-columns"><div><h3>路徑 A / 產品先出場</h3>${storyFrame('01','cup','看見飲品','杯子置於乾淨桌面，交代主角。')}${storyFrame('02','detail','靠近細節','近拍茶色與冰塊，說清楚看得到的特色。')}${storyFrame('03','sip','補上感受','描述個人口感，不代替所有人下結論。')}</div><div><h3>路徑 B / 情境先出場</h3>${storyFrame('01','walk','進入日常','從散步後坐下的片刻開始。')}${storyFrame('02','window','飲品加入','窗邊放下杯子，把產品接進故事。')}${storyFrame('03','cup','留下記憶','回到產品與情境的關係，不只剩風景。')}</div></div>`,'圖 1｜六格原創分鏡示意。並非真實拍攝現場、商品效果或客戶作品。')}
    <p>如果把兩條路徑的第二格互換，故事也會變：一段生活片刻可能突然進入密集介紹，一支規格展示也可能多出停頓與氣氛。這不是對錯題，而是提醒我們，轉場不只是剪接技巧，也會改變讀者接收資訊的順序。</p>
    <p>分鏡寫得具體，才知道還缺什麼。例如「拍得自然一點」很難執行；「先把杯子放到窗邊，再用一個近鏡交代內容物」就有明確的畫面任務。先能說清楚，再決定是否需要複雜的拍攝。</p>`) }
    ${section('information','03 / 把畫面和資訊分工',`
    ${figure(`<div class="table-scroll" tabindex="0" role="region" aria-label="鏡頭字幕與資訊分工表，可橫向捲動"><table><caption>同一件事，不必每一層都重複說</caption><thead><tr><th scope="col">層次</th><th scope="col">可以負責</th><th scope="col">要避免</th></tr></thead><tbody><tr><th scope="row">鏡頭</th><td>呈現外觀、動作與使用情境</td><td>用氣氛畫面假裝證明產品效果</td></tr><tr><th scope="row">字幕</th><td>補畫面看不出的名稱或條件</td><td>一口氣塞進所有資訊，來不及讀</td></tr><tr><th scope="row">敘述</th><td>交代個人感受與選擇理由</td><td>把個人口味說成每個人都會喜歡</td></tr></tbody></table></div>`,'圖 2｜敘事分工表：保留可選取文字，方便邊看內容邊對照。')}
    <p>想像畫面已清楚拍到冰塊，字幕就不一定還要寫「裡面有冰塊」。字幕可以補充這個畫面無法交代的條件；反過來，只有「清爽」兩個字，也不能取代對口感的具體描述。把重複的部分刪掉，內容可能更容易理解。</p>
    <aside class="margin-note"><strong>換一個方法看影片</strong><p>先靜音看一次，記下你理解了什麼；再只聽聲音，看看哪些資訊才被補上。最後完整看一次，問自己：兩者是在互相補充，還是一直重複？</p></aside>
    <p>這個練習能幫助拆解敘事，不能證明哪支影片更會賣。實際表現還會受到受眾、發布情境、價格與許多其他因素影響。生活化也不是隱藏商業關係的理由；拍攝方式與合作資訊是否清楚，是兩件需要分別處理的事。</p>`) }
    <div class="source-note"><h2>編輯與素材說明</h2><p>本文與所有分鏡為原創敘事練習，飲品、場景均為示意。未使用真實品牌包裝、客戶拍攝素材或成效數據，也未宣稱任何拍法具有必然的銷售優勢。</p></div>`
  },
  {
    slug:'creator-view-distribution-notes', category:'工具筆記', categoryId:'tools', number:'03',
    title:'平均觀看之外：用一張表看懂創作者近期內容的起伏',
    description:'用十篇合成貼文資料，實際計算平均觀看與中位數，再用長條圖觀察高觀看值如何影響摘要數字。',
    coverAlt:'紙張上排列長短不一的橄欖色紙條和一條較長的磚紅紙條，作為數值起伏的視覺比喻。',
    caption:'AI 生成概念配圖｜紙條只是分布的視覺比喻，不代表實際數值；精確資料見下方表格與圖表。',
    toc:[['sample','先把十篇資料攤開'],['distribution','平均值和中位數各在說什麼'],['record','替每個數字留下觀察條件']],
    body:`<p class="lead">看到「平均觀看五千」，你可能想像每篇內容大概都落在五千附近。但也可能是九篇在一千到三千之間，只有一篇三萬。兩種印象差很多，一個平均值卻未必能把差異說清楚。</p>
    <p>下面不用真實帳號，而用十筆公開列出的合成資料，練習把摘要數字拆開。它們不是市場基準、合作成效或預測模型，只是一組人人都能重算的例子。目的不是找出更漂亮的數字，而是知道摘要遺漏了什麼。</p>
    ${section('sample','01 / 先把十篇資料攤開',`<p>假設我們在同一個觀察時間，記下十篇同格式貼文的觀看數：${views.map(num).join('、')}。為了方便教學，下表依數值由小到大排列，不是實際發布順序。</p>
    ${figure(`<div class="table-scroll" tabindex="0" role="region" aria-label="十篇合成貼文資料，可橫向捲動"><table><caption>合成資料／非真實帳號，數值單位：次</caption><thead><tr><th scope="col">貼文</th><th scope="col">發布日期</th><th scope="col">格式</th><th scope="col">觀看數</th><th scope="col">觀察時間</th></tr></thead><tbody>${views.map((v,i)=>`<tr><th scope="row">示例 ${String(i+1).padStart(2,'0')}</th><td>未指定</td><td>同格式短片（假設）</td><td>${num(v)}</td><td>同一時點（假設）</td></tr>`).join('')}</tbody></table></div>`,'圖 1｜合成資料記錄表。「未指定」提醒我們：本例不能用來比較發布後相同天數的表現。')}
    <p>資料本身有缺口，最好直接標出。若實際紀錄沒有發布日期，就不能把「近期十篇」當成相同成熟度的樣本；如果其中混有不同內容格式，也應先分開整理。先確認比較條件，再做計算，往往比多加一個分數更重要。</p>`) }
    ${section('distribution','02 / 平均值和中位數，各在說什麼',`<p>平均值是總和除以筆數。本例總觀看為 ${num(views.reduce((a,b)=>a+b,0))}，除以 10，得到 <strong>${num(mean)}</strong>。中位數則先排序；因為有十筆，取中間第 5、6 筆的平均，也就是（2,200＋2,400）÷ 2＝<strong>${num(median)}</strong>。</p>
    ${figure(`<div class="chart" role="img" aria-label="十筆合成觀看數長條圖，最後一筆三萬明顯高於其他九筆。平均 ${mean}，中位數 ${median}。"><div class="chart-summary"><span>平均 <b>${num(mean)}</b></span><span>中位數 <b>${num(median)}</b></span></div><div class="plot">${[0,10000,20000,30000].map(v=>`<div class="gridline" style="bottom:${v/30000*100}%"><span>${v/1000}k</span></div>`).join('')}<div class="reference mean" style="bottom:${mean/30000*100}%"></div><div class="reference median" style="bottom:${median/30000*100}%"></div><div class="bars">${views.map((v,i)=>`<div class="bar" style="height:${v/30000*100}%" title="示例 ${i+1}：${num(v)} 次"><span>${String(i+1).padStart(2,'0')}</span></div>`).join('')}</div></div><p class="chart-key">實線：平均 ${num(mean)}　／　虛線：中位數 ${num(median)}<br>橫軸：示例貼文編號；縱軸：觀看次數（k＝千次）。精確數值見上表。</p></div>`,'圖 2｜圖表與表格共用同一組合成資料，縱軸由零開始；不截斷高值來美化分布。')}
    <p>這裡平均值高於中位數，是因為三萬這一筆把平均拉高。若為了理解影響，暫時只算前九筆，平均約為 2,222；這只是敏感度練習，不能拿它替換完整結果，也不代表那一篇應該被刪除。高值可能是有意義的內容，不是資料錯誤的證據。</p>
    <p>中位數比較不受單一高值的幅度影響，但它同樣省略資訊：只看中位數，你也看不到那一篇三萬。平均、中位數和逐篇分布應該一起讀，而不是選一個最符合期待的數字。計算概念可參考 <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda351.htm">NIST 的集中位置指標說明</a>。</p>`) }
    ${section('record','03 / 替每個數字留下觀察條件',`<p>實際整理時，至少記下發布日期、內容格式、觀看數和觀察時間。如果知道有推廣、合作或特殊發布情境，可以另寫註記；不知道就保留未知。不要用觀看起伏猜測假粉、買流量或平台懲罰，這張表無法證明那些原因。</p>
    <aside class="margin-note"><strong>試著做一次兩層摘要</strong><p>第一層寫樣本範圍與觀察時間；第二層列平均、中位數、最高與最低，再附逐篇資料。讓讀者能從結論回到原始數字，而不必相信一個孤立的平均。</p></aside>
    <p>十篇只是練習用的筆數，不是任何平台的標準樣本量。同樣地，不同平台上的「觀看」不應在未確認定義前直接合併。如果你的問題是受眾是否適合某個內容，數字之外仍要回看主題、語言與表達方式；觀看量並不能單獨回答這些問題。</p>`) }
    <div class="source-note"><h2>資料與來源</h2><p>十筆資料由榛菓編輯部為教學建立，沒有對應的真實帳號或客戶。平均與中位數按標準定義計算；其他段落為編輯整理方法。參考：<a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda351.htm">NIST/SEMATECH e-Handbook：Measures of Location</a>（查閱：2026-09-05）。</p></div>`
  }
];

export const posts = [...originalPosts, ...newsPosts];

function storyFrame(n,type,title,description) {
  const id = `story-${type}-${n}`;
  const cup = (x,y,k=1) => `<g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="85" cy="240" rx="100" ry="16" fill="#4c503d" opacity=".09"/><path d="M20 26Q85 40 150 26L134 225Q85 242 36 225Z" fill="url(#${id}-glass)" stroke="#676458" stroke-width="2"/><path d="M27 85Q85 97 143 85L132 220Q85 235 38 220Z" fill="url(#${id}-tea)"/><ellipse cx="85" cy="85" rx="58" ry="10" fill="#c79152" opacity=".8"/><g fill="#f4ebd2" fill-opacity=".58" stroke="#efe6d3" stroke-width="1"><path d="M47 75L80 70L86 102L53 108Z"/><path d="M87 108L123 96L133 123L102 138Z"/><path d="M47 141L78 133L86 164L53 169Z"/></g><path d="M43 43L53 213M126 43L118 211" fill="none" stroke="#fffdf4" stroke-opacity=".55" stroke-width="5"/><ellipse cx="85" cy="25" rx="68" ry="14" fill="#efeee4" fill-opacity=".72" stroke="#676458" stroke-width="2"/><ellipse cx="85" cy="22" rx="61" ry="9" fill="none" stroke="#a8a393"/><g fill="#fffdf4" opacity=".6"><circle cx="113" cy="151" r="2"/><circle cx="102" cy="180" r="3"/><circle cx="65" cy="185" r="2"/><circle cx="125" cy="76" r="2"/></g></g>`;
  const window = '<path d="M35 20H605V270H35Z" fill="#dce2d3"/><path d="M42 214L220 112L342 181L474 91L600 161V267H42Z" fill="#bfcdbb" opacity=".65"/><path d="M35 270H605M319 20V270" fill="none" stroke="#8d9383" stroke-width="9"/><path d="M34 272H608L640 308H0Z" fill="#c6b49a"/><path d="M0 320H640M0 342H640M0 373H640" stroke="#baa98e" stroke-width="1"/>';
  const street = '<path d="M0 0H640V400H0Z" fill="#e7e9df"/><path d="M0 60L260 123V262L0 368ZM640 22L399 120V262L640 388Z" fill="#d1d6ca" stroke="#858e80" stroke-width="2"/><path d="M260 262L0 400M399 262L640 400M0 338L640 350M156 303L528 308M232 279L437 281" fill="none" stroke="#acb29f"/><path d="M46 85V303M104 99V288M169 113V278M220 125V265M590 61V323M527 85V300M466 108V279" stroke="#8f998a" stroke-width="2"/><path d="M0 153L260 177M0 226L260 218M640 145L399 178M640 238L399 221" stroke="#8f998a" stroke-width="2"/><path d="M333 81V261" stroke="#7c8678" stroke-width="5"/><path d="M330 99Q255 80 280 45Q336 8 370 64Q418 114 335 121Z" fill="#99ae91"/><path d="M311 113L333 179L362 97" fill="none" stroke="#7c8678" stroke-width="3"/><path d="M70 312H217V329H70ZM89 329V364M200 329V352" fill="#b39475" stroke="#6f7162" stroke-width="3"/>';
  let scene;
  if(type==='walk') scene=street;
  else if(type==='window') scene=window+cup(358,150,.72);
  else if(type==='detail') scene='<path d="M0 295L640 235V400H0Z" fill="#d8c7a9"/>'+cup(140,-85,2);
  else if(type==='sip') scene='<path d="M0 320H640M40 334H570" stroke="#c9bc9f" stroke-width="2"/>'+cup(174,55,1.12)+'<path d="M423 178Q483 202 464 240M444 172Q504 204 481 251" fill="none" stroke="#9fae96" stroke-width="2"/>';
  else scene='<path d="M0 284L640 251V400H0Z" fill="#e2d5bd"/><path d="M75 371L532 300M125 397L606 321" stroke="#c9b998" stroke-width="1"/>'+cup(type==='cup'&&n==='03'?324:215,55,1.12);
  return `<div class="frame"><svg viewBox="0 0 640 400" role="img" aria-label="${esc(title)}分鏡示意"><defs><linearGradient id="${id}-glass" x2="1" y2=".2"><stop stop-color="#f4f0de" stop-opacity=".85"/><stop offset=".45" stop-color="#fffdf8" stop-opacity=".2"/><stop offset="1" stop-color="#d1d5c5" stop-opacity=".7"/></linearGradient><linearGradient id="${id}-tea" x2=".7" y2="1"><stop stop-color="#bc8945"/><stop offset=".55" stop-color="#ad7136"/><stop offset="1" stop-color="#cb9451"/></linearGradient></defs><rect width="640" height="400" fill="#f1ede2"/>${scene}<path d="M16 35V16H35M605 16H624V35M16 365V384H35M605 384H624V365" stroke="#9c9b87" stroke-width="1" fill="none"/></svg><p><b>${n} ${title}</b><br>${description}</p></div>`;
}
export const indexHref = locale => `/${locale.prefix}insights/`;
export const href = (post,locale=blogLocales[0]) => `${indexHref(locale)}${post.slug}/`;
export const newestFirst = (a,b) => (b.published||published).localeCompare(a.published||published) || Number(b.number)-Number(a.number);
export const asset = post => `/web-assets/blog/${post.slug}-v3-background.webp`;
export const shareAsset = (post,locale=blogLocales[0]) => `/web-assets/blog/${post.slug}-v3-social${locale.key==='zh-TW'?'':'-'+locale.key}.webp`;

export const coverCopy = {
  "reading-social-comment-signals": {
    "label": "留言訊號",
    "category": "社群觀察 / 01",
    "headline": [
      "留言之外，",
      "看見訊號。"
    ],
    "sub": [
      "把熱鬧拆開，",
      "讀懂每一句的上下文。"
    ],
    "labels": [
      "OBSERVE",
      "CONTEXT"
    ],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"400\" height=\"250\" viewBox=\"0 0 400 250\"><g fill=\"none\" stroke=\"#6f775e\" stroke-width=\"1.5\"><path d=\"M58 41L182 33L197 198L68 205Z\"/><path d=\"M78 69L161 63M79 86L155 82M81 126L171 120M81 142L149 138M84 162L160 158\" stroke-width=\"1\"/><path d=\"M75 100L175 93\" stroke=\"#99583b\" stroke-width=\"3\"/><circle cx=\"184\" cy=\"97\" r=\"3\" fill=\"#6f775e\"/><path d=\"M188 97C219 95 207 42 247 43H349M196 168C222 169 223 199 250 199H349\"/><path d=\"M343 39L349 43L343 47M343 195L349 199L343 203\"/><path d=\"M63 207L202 201\" opacity=\".4\"/></g></svg>"
  },
  "beverage-content-storytelling": {
    "label": "飲料敘事",
    "category": "內容觀察 / 02",
    "headline": [
      "同一杯茶，",
      "兩種敘事。"
    ],
    "sub": [
      "先看見產品，",
      "或先走進一段生活。"
    ],
    "labels": [
      "PRODUCT",
      "MOMENT"
    ],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"400\" height=\"250\" viewBox=\"0 0 400 250\"><g fill=\"none\" stroke=\"#6f775e\" stroke-width=\"1.5\"><ellipse cx=\"112\" cy=\"52\" rx=\"46\" ry=\"9\"/><path d=\"M67 53L78 177Q112 189 146 177L158 53M75 93Q112 105 151 93\"/><ellipse cx=\"112\" cy=\"49\" rx=\"49\" ry=\"10\"/><path d=\"M83 69L92 167M140 68L133 166\" opacity=\".45\"/><path d=\"M161 95C211 94 193 42 245 43H349M148 154C213 154 204 199 250 199H349\"/><path d=\"M343 39L349 43L343 47M343 195L349 199L343 203\"/><circle cx=\"164\" cy=\"95\" r=\"3\" fill=\"#6f775e\"/><circle cx=\"149\" cy=\"154\" r=\"3\" fill=\"#6f775e\"/></g></svg>"
  },
  "creator-view-distribution-notes": {
    "label": "觀看起伏",
    "category": "工具筆記 / 03",
    "headline": [
      "平均之外，",
      "還有起伏。"
    ],
    "sub": [
      "一個數字，",
      "不等於整個故事。"
    ],
    "labels": [
      "MEAN",
      "MEDIAN"
    ],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"400\" height=\"250\" viewBox=\"0 0 400 250\"><g stroke=\"#6f775e\" stroke-width=\"1\" fill=\"none\"><path d=\"M45 38V198H220\"/></g><rect x=\"56\" y=\"191.76\" width=\"8\" height=\"6.24\" fill=\"#818c72\"/><rect x=\"71\" y=\"190.2\" width=\"8\" height=\"7.800000000000001\" fill=\"#818c72\"/><rect x=\"86\" y=\"188.64\" width=\"8\" height=\"9.36\" fill=\"#818c72\"/><rect x=\"101\" y=\"187.6\" width=\"8\" height=\"10.4\" fill=\"#818c72\"/><rect x=\"116\" y=\"186.56\" width=\"8\" height=\"11.44\" fill=\"#818c72\"/><rect x=\"131\" y=\"185.52\" width=\"8\" height=\"12.48\" fill=\"#818c72\"/><rect x=\"146\" y=\"184.48\" width=\"8\" height=\"13.52\" fill=\"#818c72\"/><rect x=\"161\" y=\"182.4\" width=\"8\" height=\"15.600000000000001\" fill=\"#818c72\"/><rect x=\"176\" y=\"180.84\" width=\"8\" height=\"17.16\" fill=\"#818c72\"/><rect x=\"191\" y=\"42\" width=\"8\" height=\"156\" fill=\"#99583b\"/><g fill=\"none\" stroke=\"#6f775e\" stroke-width=\"1.3\"><path d=\"M48 172H226C246 172 223 43 255 43H349\"/><path d=\"M48 186H226C245 187 235 199 255 199H349\" stroke-dasharray=\"3 3\"/><path d=\"M343 39L349 43L343 47M343 195L349 199L343 203\"/></g></svg>"
  },
  "youtube-auto-dubbing-review": {
    "label": "配音審核",
    "category": "工具筆記 / 04",
    "headline": [
      "換種語言，",
      "先聽仔細。"
    ],
    "sub": [
      "自動配音之後，",
      "留一道人工檢查。"
    ],
    "labels": [
      "SOURCE",
      "REVIEW"
    ],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"400\" height=\"250\" viewBox=\"0 0 400 250\"><g fill=\"none\" stroke=\"#6f775e\" stroke-width=\"1.5\"><path d=\"M45 96H60L67 84L75 114L84 62L93 133L104 77L113 118L124 91H190C220 90 211 43 252 43H349M45 165H60L70 154L80 179L90 144L100 188L111 151L124 177L137 165H190C220 166 219 199 252 199H349\"/><path d=\"M343 39L349 43L343 47M343 195L349 199L343 203\"/><path d=\"M42 52V207M195 58V197\" opacity=\".3\"/></g></svg>"
  },
  "edits-mobile-video-workflow": {
    "label": "手機剪輯",
    "category": "內容拆解 / 05",
    "headline": [
      "先拆素材，",
      "再談剪輯。"
    ],
    "sub": [
      "一句話一個任務，",
      "讓鏡頭接得起來。"
    ],
    "labels": [
      "SCRIPT",
      "SHOTS"
    ],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"400\" height=\"250\" viewBox=\"0 0 400 250\"><g fill=\"none\" stroke=\"#6f775e\" stroke-width=\"1.5\"><path d=\"M50 44H182V106H50ZM50 139H102V194H50ZM115 139H167V194H115ZM180 139H232V194H180Z\"/><path d=\"M68 64H161M68 80H146M185 77C220 76 221 43 251 43H349M235 171C254 171 248 199 277 199H349\"/><path d=\"M343 39L349 43L343 47M343 195L349 199L343 203\"/><path d=\"M69 157L87 168L69 179ZM132 155V179M145 155V179M197 156H216V178H197Z\" stroke-width=\"1\"/></g></svg>"
  },
  "tiktok-search-topic-workshop": {
    "label": "搜尋選題",
    "category": "社群觀察 / 06",
    "headline": [
      "跟著問題，",
      "找到題材。"
    ],
    "sub": [
      "不只追熱門，",
      "拍出可以回答的內容。"
    ],
    "labels": [
      "SEARCH",
      "ANSWER"
    ],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"400\" height=\"250\" viewBox=\"0 0 400 250\"><g fill=\"none\" stroke=\"#6f775e\" stroke-width=\"1.5\"><path d=\"M45 50H167V95H45ZM67 65H142M67 81H126M45 136H205V195H45ZM65 154H183M65 173H159\"/><path d=\"M169 73C210 72 212 43 251 43H349M208 165C245 164 238 199 276 199H349M105 98V132\"/><path d=\"M100 127L105 132L110 127M343 39L349 43L343 47M343 195L349 199L343 203\"/></g></svg>"
  }
};
export function localizedPost(post,locale){return translatePost(post,locale,coverCopy[post.slug]);}
export function renderCover(post,locale=blogLocales[0],eager=false) {
  const copy=post.cover||coverCopy[post.slug],ui=locale.ui;
  return `<div class="hybrid-cover"><img src="${asset(post)}" width="1600" height="840" alt="${esc(post.coverAlt)}" ${eager?'fetchpriority="high"':'loading="lazy"'}><div class="hybrid-wordmark" aria-hidden="true">${esc(ui.site)}<small>${esc(copy.category)}</small></div><p class="hybrid-headline">${copy.headline.map(line=>`<span>${esc(line)}</span>`).join('')}</p><p class="hybrid-sub">${copy.sub.map(esc).join('<br>')}</p><div class="hybrid-vector" aria-hidden="true">${copy.svg}</div><span class="hybrid-label first" aria-hidden="true">${esc(copy.labels[0])}</span><span class="hybrid-label second" aria-hidden="true">${esc(copy.labels[1])}</span><small class="hybrid-signature" aria-hidden="true">ZHENGUOCOOL</small><small class="hybrid-edition" aria-hidden="true">FIELD NOTES</small></div>`;
}
const readLink=(url,text,location='blog-related')=>`<a href="${esc(url)}" data-track-event="article_index_click" data-track-location="${location}">${text}<span aria-hidden="true"> ↗</span></a>`;
const alternates=slug=>[...blogLocales.map(l=>[l.key,base+indexHref(l)+(slug?slug+'/':'')]),['x-default',base+'/insights/'+(slug?slug+'/':'')]];
function shell({title,description,url,image='/web-assets/og-zhenguocool-campaign-plan.webp',body,schema,analyticsVersion,locale,slug=''}) {
  const ui=locale.ui,index=indexHref(locale),home='/'+locale.prefix;
  const languages=blogLocales.map(l=>l.key===locale.key?`<span aria-current="page" lang="${l.key}">${l.label}</span>`:`<a href="${indexHref(l)}${slug?slug+'/':''}" lang="${l.key}" data-lang-link="${l.key}" ${slug?'':'data-blog-language'}>${l.label}</a>`).join('');
  const graph=[schema,{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:ui.company,item:base+home},{'@type':'ListItem',position:2,name:ui.site,item:base+index},...(slug?[{'@type':'ListItem',position:3,name:title,item:url}]:[])]}];
  return `<!DOCTYPE html>
<html lang="${locale.key}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${esc(description)}"><meta name="robots" content="index, follow"><link rel="canonical" href="${url}">${alternates(slug).map(([lang,url])=>`<link rel="alternate" hreflang="${lang}" href="${url}">`).join('')}<title>${esc(title)}｜${esc(ui.site)}</title><link rel="icon" href="/web-assets/icons/favicon-32x32.png"><link rel="stylesheet" href="/web-assets/blog/editorial.css?v=20260906-5"><meta property="og:type" content="${slug?'article':'website'}"><meta property="og:locale" content="${locale.og}"><meta property="og:site_name" content="${esc(ui.site)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${base}${image}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${base}${image}"><script src="/web-assets/analytics-config.js?v=${analyticsVersion}" defer></script><script src="/web-assets/analytics.js?v=${analyticsVersion}" defer></script>${slug?'':'<script src="/web-assets/blog/filters.js?v=20260906-1" defer></script>'}<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c')}</script></head>
<body class="locale-${locale.key}"><a class="skip" href="#main">${esc(ui.skip)}</a><header class="site-header"><a class="wordmark" href="${index}">${esc(ui.brand)}<span>${esc(ui.brandSuffix)}</span><small>ZHENGUOCOOL JOURNAL</small></a><div class="header-links"><nav aria-label="${esc(ui.nav)}"><a href="${index}">${esc(ui.all)}</a><a href="${home}">${esc(ui.home)} ↗</a></nav><nav class="blog-language" aria-label="${esc(ui.languages)}">${languages}</nav></div></header><main id="main">${body}</main><footer class="site-footer"><div><strong>${esc(ui.site)}</strong><p>${esc(ui.footer)}</p></div><nav aria-label="${esc(ui.nav)}"><a href="${index}">${esc(ui.all)}</a><a href="${home}">${esc(ui.company)}</a></nav><small>© 2026 ZhenguoCool · ${esc(ui.rights)}</small></footer></body></html>
`;
}
export function buildEditorialBlog(root,oldPages,analyticsVersion) {
  const guides=oldPages.filter(p=>p.kind==='article'),entries=[];
  for(const locale of blogLocales) {
    const ui=locale.ui,index=indexHref(locale),translated=posts.map(p=>localizedPost(p,locale));
    for(const post of translated) {
      if(!fs.existsSync(path.join(root,asset(post))))throw Error(`Missing editorial cover: ${asset(post)}`);
      const original=posts.find(p=>p.slug===post.slug);
      const relatedSlugs=original.related||originalPosts.filter(p=>p.slug!==post.slug).slice(0,2).map(p=>p.slug);
      const related=relatedSlugs.map(slug=>translated.find(p=>p.slug===slug)).filter(Boolean);
      const url=base+href(post,locale),date=post.published||published;
      const body=`<article><header class="article-heading"><p class="eyebrow">FIELD NOTES / ${post.number} <span>${esc(post.category)}</span></p><h1>${esc(post.title)}</h1><p class="dek">${esc(post.description)}</p><p class="byline">${esc(ui.author)} <span>·</span> <time datetime="${date}">${date.replaceAll('-','.')}</time></p></header><figure class="cover">${renderCover(post,locale,true)}<figcaption>${esc(post.caption)}</figcaption></figure><div class="reading"><nav class="contents" aria-label="${esc(ui.contents)}"><span>${esc(ui.contents)}</span>${post.toc.map(([id,title])=>`<a href="#${id}">${esc(title)}</a>`).join('')}</nav>${post.body}<section class="related"><p class="eyebrow">KEEP READING</p><h2>${esc(ui.related)}</h2>${related.map(p=>readLink(href(p,locale),esc(p.title))).join('')}${readLink(index,esc(ui.back))}</section></div></article>`;
      const html=shell({title:post.title,description:post.description,url,image:shareAsset(post,locale),body,analyticsVersion,locale,slug:post.slug,schema:{'@type':'BlogPosting',headline:post.title,description:post.description,url,mainEntityOfPage:url,image:base+shareAsset(post,locale),datePublished:date,dateModified:post.modified||date,inLanguage:locale.key,author:{'@type':'Organization',name:ui.author,url:base+index},publisher:{'@type':'Organization',name:ui.company,url:base+'/'+locale.prefix}}});
      const dir=path.join(root,locale.prefix,'insights',post.slug);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),html);
      entries.push({loc:url,priority:'0.7',alternates:alternates(post.slug)});
    }
    const displayPosts=[...translated].sort(newestFirst);
    const cards=displayPosts.map(post=>`<article class="post-card" id="note-${post.number}" data-article-category="${post.categoryId}"><a class="cover-link" href="${href(post,locale)}" data-track-event="article_index_click" data-track-location="blog-index" aria-label="${esc(ui.read+': '+post.title)}">${renderCover(post,locale)}</a><p class="eyebrow">${esc(post.category)} <span>NO. ${post.number}</span></p><h2>${readLink(href(post,locale),esc(post.title),'blog-index')}</h2><p>${esc(post.description)}</p><time datetime="${post.published||published}">${(post.published||published).replaceAll('-','.')}</time></article>`).join('');
    const buttons=Object.entries(ui.categories).map(([key,label])=>`<button type="button" data-category="${key}" aria-pressed="${key==='all'}" data-track-event="article_filter_click" data-track-location="blog-filter-${key}">${esc(label)}</button>`).join('');
    const body=`<div data-blog-index data-articles-unit="${esc(ui.articlesUnit)}" data-guides-unit="${esc(ui.guidesUnit)}"><div class="journal-intro"><p class="eyebrow">OBSERVATIONS, STORIES &amp; PRACTICE</p><h1>${esc(ui.intro[0])}<br><em>${esc(ui.intro[1])}</em></h1><div class="intro-bottom"><p>${ui.subtitle.map(esc).join('<br>')}</p><span class="edition">${esc(ui.site)}<br>VOL. 01 / 2026</span></div></div><nav class="categories" aria-label="${esc(ui.categories.all)}">${buttons}</nav><p class="filter-status" data-filter-status aria-live="polite">${displayPosts.length} ${esc(ui.articlesUnit)} · ${guides.length} ${esc(ui.guidesUnit)}</p><noscript><p class="filter-status">${esc(ui.noJs)}</p></noscript><section class="latest" aria-label="${esc(ui.latest)}"><div class="section-label"><h2>${esc(ui.latest)}</h2><span><b data-visible-count>${String(posts.length).padStart(2,'0')}</b> / ${esc(ui.order)}</span></div><div class="post-grid">${cards}</div></section><section class="guide-index" id="guides"><div class="section-label"><h2>${esc(ui.guides)}</h2><span>${String(guides.length).padStart(2,'0')} GUIDES</span></div><p>${esc(ui.guideIntro)}</p><ol>${guides.map((p,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span>${readLink(index+p.slug+'/',esc(p.copy[locale.dataKey].h1),'blog-guide-index')}</li>`).join('')}</ol></section></div>`;
    const dir=path.join(root,locale.prefix,'insights');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),shell({title:ui.indexTitle,description:ui.indexDescription,url:base+index,body,analyticsVersion,locale,schema:{'@type':'CollectionPage',name:ui.site,url:base+index,inLanguage:locale.key,hasPart:displayPosts.map(p=>({'@type':'BlogPosting',headline:p.title,url:base+href(p,locale)}))}}));
    entries.push({loc:base+index,priority:'0.7',alternates:alternates('')});
  }
  return entries;
}
