import fs from 'node:fs';
import path from 'node:path';

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

export const posts = [
  {
    slug: 'reading-social-comment-signals', category:'社群觀察', categoryId:'observation', number:'01',
    title:'留言很多，就代表內容有效嗎？讀懂互動裡的不同訊號',
    description:'從抽獎口令、一般稱讚、產品提問到使用經驗，練習看懂留言的上下文；不把互動數直接當成購買意願。',
    coverAlt:'四種不同形狀的對話泡泡圍繞一個觀察圓點，象徵留言有不同語意。',
    caption:'原創圖像｜同樣是留言，留下來的理由可能完全不同。',
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
    coverAlt:'一杯無品牌飲料分別出現在幾何攝影台和窗邊生活場景中的原創插畫。',
    caption:'原創場景示意｜同一杯飲料，換一個故事起點。非真實商品或合作案例。',
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
    coverAlt:'十條不同高度的長條與兩條參考線，象徵平均值和中位數需要搭配分布閱讀。',
    caption:'原創資料視覺｜數字是一個入口，不是整個故事。',
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

function cup(x,y,scale=1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})"><ellipse cx="65" cy="185" rx="77" ry="13" fill="#18283c" opacity=".12"/><path d="M10 10H120L104 180H28Z" fill="#faf5e8" stroke="#233546" stroke-width="3"/><path d="M17 64H113L103 172H29Z" fill="#cc793e"/><path d="M30 84L56 73L65 98L40 109ZM76 112L100 101L108 127L83 136Z" fill="#fff9e9" opacity=".72"/><path d="M78 70L97 -25" stroke="#b24530" stroke-width="8"/><ellipse cx="65" cy="10" rx="57" ry="11" fill="#fff9eb" stroke="#233546" stroke-width="3"/></g>`;
}
function storyFrame(n,type,title,description) {
  const scene = type==='walk' ? '<path d="M0 110L320 75M0 155L320 120" stroke="#c6b898" stroke-width="2"/><circle cx="160" cy="35" r="15" fill="#233546"/><path d="M160 52L150 100L125 140M150 100L185 140M155 66L190 85" fill="none" stroke="#233546" stroke-width="11" stroke-linecap="round"/>' : `${type==='window'?'<path d="M40 10H280V125H40ZM160 10V125M40 65H280" fill="#dce7de" stroke="#b8cabc" stroke-width="5"/>':''}${type==='detail'?cup(69,-25,1.5):cup(115,18,.66)}`;
  return `<div class="frame"><svg viewBox="0 0 320 175" role="img" aria-label="${esc(title)}分鏡示意"><rect width="320" height="175" fill="${type==='walk'||type==='window'?'#e8eddf':'#f3e7d1'}"/>${scene}</svg><p><b>${n} ${title}</b><br>${description}</p></div>`;
}
function cover(post) {
  let art;
  if(post.number==='01') art = `<circle cx="830" cy="306" r="210" fill="#e0e8dc"/><g stroke="#243748" stroke-width="3"><path d="M485 110H765V245H620L560 280V245H485Z" fill="#fffdf5"/><path d="M795 170H1090V310H1060V350L1000 310H795Z" fill="#cc593f"/><path d="M530 340H770V485H580L545 520V485H530Z" fill="#d8bb80"/><path d="M805 410H1110V545H900L865 577V545H805Z" fill="#fffdf5"/></g><g fill="#243748"><circle cx="560" cy="173" r="11"/><circle cx="605" cy="173" r="11"/><circle cx="650" cy="173" r="11"/><path d="M587 382H714V392H587ZM587 410H691V420H587Z"/></g><text x="920" y="272" font-family="Georgia,serif" font-size="88" fill="#fffdf5">?</text><path d="M860 470H1050M860 499H992" stroke="#243748" stroke-width="8"/>`;
  else if(post.number==='02') art = `<path d="M600 65V565" stroke="#bdad8d" stroke-width="2"/><rect x="660" y="78" width="475" height="370" fill="#dce7de"/><path d="M898 78V448M660 263H1135" stroke="#faf5e8" stroke-width="12"/><ellipse cx="845" cy="535" rx="245" ry="24" fill="#d8bb80"/><path d="M340 540H640V510H340Z" fill="#cfaf7b"/>${cup(395,219,1.55)}${cup(820,295,1.15)}<path d="M1060 535Q1010 390 1120 320Q1170 410 1080 472" fill="#718675"/>`;
  else art = `<rect x="450" y="92" width="680" height="452" rx="10" fill="#fffdf5"/><path d="M490 466H1090M490 145V466" fill="none" stroke="#bdad8d" stroke-width="2"/>${views.map((v,i)=>`<rect x="${511+i*56}" y="${466-v/30000*290}" width="29" height="${v/30000*290}" rx="3" fill="${i===9?'#b24530':'#648273'}"/>`).join('')}<path d="M490 ${466-mean/30000*290}H1090" stroke="#b24530" stroke-width="3"/><path d="M490 ${466-median/30000*290}H1090" stroke="#243748" stroke-width="3" stroke-dasharray="7 6"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><title>${esc(post.coverAlt)}</title><rect width="1200" height="630" fill="#f0e8d8"/><path d="M34 36H1166V594H34Z" fill="none" stroke="#cbbd9f"/><text x="70" y="125" font-family="Georgia,serif" font-size="23" letter-spacing="4" fill="#243748">ZHENGUOCOOL</text><text x="70" y="265" font-family="Georgia,serif" font-size="100" fill="#b24530">${post.number}</text><text x="75" y="323" font-family="Georgia,serif" font-size="24" letter-spacing="5" fill="#243748">FIELD NOTES</text><path d="M75 364H310" stroke="#b24530" stroke-width="3"/><text x="75" y="555" font-family="Georgia,serif" font-size="19" letter-spacing="3" fill="#526455">LOOK CLOSER.</text>${art}</svg>`;
}
const href = post => `/insights/${post.slug}/`;
const asset = post => `/web-assets/blog/${post.slug}.svg`;
const readLink = (url,text,location='blog-related') => `<a href="${esc(url)}" data-track-event="article_index_click" data-track-location="${location}">${text}<span aria-hidden="true"> ↗</span></a>`;
function shell({title,description,url,image,body,schema,analyticsVersion}) {
  return `<!DOCTYPE html>
<html lang="zh-TW"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${esc(description)}"><meta name="robots" content="index, follow"><link rel="canonical" href="${url}"><title>${esc(title)}｜榛菓筆記</title><link rel="icon" href="/web-assets/icons/favicon-32x32.png"><link rel="stylesheet" href="/web-assets/blog/editorial.css"><meta property="og:type" content="${schema['@type']==='BlogPosting'?'article':'website'}"><meta property="og:locale" content="zh_TW"><meta property="og:site_name" content="榛菓筆記"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${base}/web-assets/og-zhenguocool-campaign-plan.webp"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${base}/web-assets/og-zhenguocool-campaign-plan.webp"><script src="/web-assets/analytics-config.js?v=${analyticsVersion}" defer></script><script src="/web-assets/analytics.js?v=${analyticsVersion}" defer></script><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':[schema,{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'榛菓行銷',item:base+'/'},{'@type':'ListItem',position:2,name:'榛菓筆記',item:base+'/insights/'},...(schema['@type']==='BlogPosting'?[{'@type':'ListItem',position:3,name:title,item:url}]:[])]}]}).replace(/</g,'\u003c')}</script></head>
<body><a class="skip" href="#main">跳至內容</a><header class="site-header"><a class="wordmark" href="/insights/">榛菓<span>筆記</span><small>ZHENGUOCOOL JOURNAL</small></a><nav aria-label="網站導覽"><a href="/insights/">全部文章</a><a href="/">榛菓官網 ↗</a></nav></header><main id="main">${body}</main><footer class="site-footer"><div><strong>榛菓筆記</strong><p>把社群與內容工作，看得更仔細一點。</p></div><nav aria-label="頁尾導覽"><a href="/insights/">全部文章</a><a href="/">榛菓行銷</a></nav><small>© 2026 ZhenguoCool · 原創觀察與圖文筆記</small></footer></body></html>
`;
}
export function buildEditorialBlog(root, oldPages, analyticsVersion) {
  const guides = oldPages.filter(p=>p.kind==='article');
  const dir=path.join(root,'web-assets/blog'); fs.mkdirSync(dir,{recursive:true});
  for(const post of posts) {
    fs.writeFileSync(path.join(root,asset(post)),cover(post));
    const url=base+href(post);
    const body=`<article><header class="article-heading"><p class="eyebrow">FIELD NOTES / ${post.number} <span>${post.category}</span></p><h1>${post.title}</h1><p class="dek">${post.description}</p><p class="byline">榛菓編輯部 <span>·</span> <time datetime="${published}">${published.replaceAll('-','.')}</time></p></header><figure class="cover"><img src="${asset(post)}" width="1200" height="630" alt="${esc(post.coverAlt)}" fetchpriority="high"><figcaption>${post.caption}</figcaption></figure><div class="reading"><nav class="contents" aria-label="本文目錄"><span>這篇筆記</span>${post.toc.map(([id,title])=>`<a href="#${id}">${title}</a>`).join('')}</nav>${post.body}<section class="related"><p class="eyebrow">KEEP READING</p><h2>換個角度，繼續看</h2>${posts.filter(p=>p!==post).map(p=>readLink(href(p),esc(p.title))).join('')}${readLink('/insights/','回到全部文章')}</section></div></article>`;
    const html=shell({title:post.title,description:post.description,url,body,analyticsVersion,schema:{'@type':'BlogPosting',headline:post.title,description:post.description,url,mainEntityOfPage:url,image:base+asset(post),datePublished:published,dateModified:published,inLanguage:'zh-TW',author:{'@type':'Organization',name:'榛菓編輯部',url:base+'/insights/'},publisher:{'@type':'Organization',name:'榛菓行銷',url:base+'/'}}});
    const pageDir=path.join(root,'insights',post.slug);fs.mkdirSync(pageDir,{recursive:true});fs.writeFileSync(path.join(pageDir,'index.html'),html);
  }
  const cards=posts.map(post=>`<article class="post-card" id="${post.categoryId}"><a class="cover-link" href="${href(post)}" data-track-event="article_index_click" data-track-location="blog-index" aria-label="閱讀：${esc(post.title)}"><img src="${asset(post)}" width="1200" height="630" alt="${esc(post.coverAlt)}" loading="lazy"></a><p class="eyebrow">${post.category} <span>NO. ${post.number}</span></p><h2>${readLink(href(post),esc(post.title),'blog-index')}</h2><p>${post.description}</p><time datetime="${published}">${published.replaceAll('-','.')}</time></article>`).join('');
  const body=`<div class="journal-intro"><p class="eyebrow">OBSERVATIONS, STORIES &amp; PRACTICE</p><h1>把日常滑過的，<br><em>再看仔細一點。</em></h1><div class="intro-bottom"><p>關於社群、創作者與內容工作的觀察。<br>有時拆解一則留言，有時只是換個角度看一杯茶。</p><span class="edition">榛菓筆記<br>VOL. 01 / 2026</span></div></div><nav class="categories" aria-label="文章分類"><a href="#observation">社群觀察</a><a href="#storytelling">內容拆解</a><a href="#tools">工具筆記</a><a href="#guides">決策指南</a></nav><section class="latest" aria-label="最新圖文文章"><div class="section-label"><h2>新筆記</h2><span>03 STORIES</span></div><div class="post-grid">${cards}</div></section><section class="guide-index" id="guides"><div class="section-label"><h2>決策指南</h2><span>07 GUIDES</span></div><p>需要更完整的市場與合作整理？既有指南都在這裡。</p><ol>${guides.map((p,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span>${readLink('/insights/'+p.slug+'/',esc(p.copy['zh-Hant'].h1),'blog-guide-index')}</li>`).join('')}</ol></section>`;
  fs.writeFileSync(path.join(root,'insights/index.html'),shell({title:'榛菓筆記：社群觀察、內容拆解與工具分享',description:'分享社群、創作者與內容工作的原創觀察、圖文拆解與工具筆記，也整理榛菓既有市場決策指南。',url:base+'/insights/',body,analyticsVersion,schema:{'@type':'CollectionPage',name:'榛菓筆記',url:base+'/insights/',inLanguage:'zh-TW',hasPart:posts.map(p=>({'@type':'BlogPosting',headline:p.title,url:base+href(p)}))}}));
  return ['insights/',...posts.map(p=>'insights/'+p.slug+'/')];
}
