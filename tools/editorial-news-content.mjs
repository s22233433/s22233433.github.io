export const newsPosts = [
  {
    slug: 'youtube-auto-dubbing-review',
    title: 'YouTube 自動配音更新後：發布前，先做一次語音檢查',
    description: '從 YouTube 2026 年的自動配音更新出發，用一段短口播練習核對專名、數字、否定句與語氣，替發布前留下一份聽校清單。',
    number: '04',
    published: '2026-09-06',
    category: '工具筆記',
    categoryId: 'tools',
    coverAlt: '桌面上的麥克風、耳機、空白筆記與鉛筆，呈現發布前核對語音的虛構工作情境。',
    caption: 'AI 生成虛構場景配圖｜把每一句先聽清楚，再決定是否發布；非真實 YouTube Studio 畫面或帳號資料。',
    toc: [
      ['why-review', '先把「能翻譯」和「可發布」分開'],
      ['workflow', '建立一次可重複的聽校流程'],
      ['practice', '用一段虛構介紹測試關鍵字']
    ],
    related: ['creator-view-distribution-notes', 'edits-mobile-video-workflow'],
    body: [
      '<p class="lead">自動配音讓同一支影片多一條聽見內容的路徑，卻不會替創作者判斷專有名詞、數字和語氣是否正確。發布前多做一次人工聽校，目的不是追求完美口音，而是避免一句小錯讓資訊變形。</p>',
      '<p>2026 年 5 月 15 日的 YouTube Blog 介紹自動翻譯音軌與更自然的語音表現；這是當時的官方公告，不是對所有頻道、影片或語言的可用性保證。YouTube 說明頁也提醒，功能只提供給符合資格的創作者，可用情況會因頻道、影片與語言不同而改變。</p>',
      '<section id="why-review" class="chapter"><h2>01 / 先把「能翻譯」和「可發布」分開</h2><p>自動配音是生成結果，不是逐字人工翻譯。官方建議上傳時確認原始影片或頻道語言；若判錯，整段配音可能跟著錯。自動配音不能直接編輯，看到問題時先不發布，確認原始語言與官方提供的處理選項；若需要自製配音，請另參閱 <a href="https://support.google.com/youtube/answer/13338784?hl=en">官方多語音軌說明</a>；這與自動配音是不同的工作流程。中文原聲也不代表一定能配到每一種語言，請把影片實際顯示的清單當作當下範圍。</p><aside class="margin-note"><strong>本文的判斷邊界</strong><p>「通過」只代表本次人工聽校找不到明顯錯誤，不代表翻譯完整、觀眾一定喜歡，或影片會帶來銷售提升。</p></aside></section>',
      '<section id="workflow" class="chapter"><h2>02 / 建立一次可重複的聽校流程</h2><p>先在頻道設定打開人工審核，讓音軌在發布前停下來。桌面版路徑可從 Settings、Channel、Advanced settings 找到 Allow automatic dubbing，再選 Manually review dubs before publishing；依頁面提供的全部語言或實驗性語言範圍設定後儲存。針對單支影片，從 Content 選取影片，進入 Languages，選一個語言預覽。以下是編輯部整理的判斷順序：</p>',
      '<figure class="explainer"><ol class="steps"><li><span>01</span><h3>先聽原聲</h3><p>確認人名、品牌名、數字與否定句在原片就說清楚。</p></li><li><span>02</span><h3>再聽配音</h3><p>同一段落來回播放，記下發音、停頓和語氣變化。</p></li><li><span>03</span><h3>對照文字</h3><p>把可疑句子寫回逐字稿，不靠「大概聽懂」放行。</p></li><li><span>04</span><h3>做出決定</h3><p>標成 pass、pending 或 redo，留下原因與日期。</p></li></ol><figcaption>圖 1｜原創教學示意，不是 YouTube Studio UI 截圖；pass、pending、redo 是本文的編輯標籤，不是平台成效分數。</figcaption></figure>',
      '<p>如果頁面沒有顯示某個語言，先記成「目前未提供」，不要推定是帳號故障，也不要把一次成功預覽寫成永久支援。預覽時可把耳機音量調到能聽清子音的程度，但不要用自己的口音偏好代替資訊核對。</p></section>',
      '<section id="practice" class="chapter"><h2>03 / 用一段虛構介紹測試關鍵字</h2><p>拿一段約 30 秒的虛構產品介紹來練習，例如「晨霧杯容量 350 毫升，不是 500 毫升；不含吸管，建議手洗。」先把原聲逐字寫下，再比較配音是否保留數字、單位、不是、不含與建議等關鍵字。接著再聽語氣：提醒是否被說成命令，個人感受是否被說成保證。</p>',
      '<figure class="explainer"><div class="table-scroll" tabindex="0" role="region" aria-label="虛構產品介紹的自動配音核對表，可橫向捲動"><table><caption>示例核對表／虛構內容，僅供編輯練習</caption><thead><tr><th scope="col">原句焦點</th><th scope="col">要聽什麼</th><th scope="col">發現問題時</th></tr></thead><tbody><tr><th scope="row">晨霧杯</th><td>專名是否被拆開或換成相似音</td><td>pending，回看原始語言</td></tr><tr><th scope="row">350 毫升</th><td>數字與單位是否都出現</td><td>redo，不用猜測修正</td></tr><tr><th scope="row">不是 500 毫升</th><td>否定詞是否消失</td><td>redo，先保留不發布</td></tr><tr><th scope="row">不含吸管／建議</th><td>限制與語氣是否仍清楚</td><td>記下時間點，再請人複聽</td></tr></tbody></table></div><figcaption>圖 2｜原創教學示意，不是 YouTube Languages 頁面的 UI 截圖；表內台詞與標籤皆為虛構。</figcaption></figure>',
      '<p>完成後把結果分成三類：pass 是目前可理解且沒有明顯關鍵錯誤；pending 是需要第二個人或原作者確認；redo 是關鍵字、數字或否定句已改變意思。三類不代表成效。</p><p class="source-note"><strong>官方事實與編輯建議（查核：2026-09-06）</strong><br>官方事實：<a href="https://blog.youtube/creator-and-artist-stories/youtube-auto-dubbing-explained/">YouTube Blog，2026-05-15</a> 說明自動配音的背景；<a href="https://support.google.com/youtube/answer/15569972?hl=en-EN">YouTube Help</a> 說明資格、語言可用性、原始語言、不能直接編輯，以及發布前人工審核路徑。編輯建議：聽校順序、30 秒台詞、pass／pending／redo 與核對表均為原創；未測試真實帳號，不保證中文涵蓋所有語言或帶來銷售提升。</p>'
    ].join('')
  },
  {
    slug: 'edits-mobile-video-workflow',
    title: 'Edits 一週年更新：把一段口播，拆成好剪的素材',
    description: 'Edits 一週年帶來哪些創作思路？從提詞器與素材整理出發，用三個鏡頭練習拍口播，再用一張清單檢查字幕、聲音與剪接。',
    number: '05',
    published: '2026-09-06',
    category: '內容拆解',
    categoryId: 'storytelling',
    coverAlt: '手機、腳架、陶杯與空白分鏡卡排在桌面，呈現把口播拆成鏡頭素材的虛構拍攝情境。',
    caption: 'AI 生成虛構場景配圖｜先把一句話拍成一個可剪的片段；非真實 Edits 專案、介面或帳號截圖。',
    toc: [
      ['official-update', '公告裡有什麼，還有哪些是未來'],
      ['three-shots', '用一句話一鏡頭拍三次'],
      ['edit-check', '剪輯前後都做一次可觀看檢查']
    ],
    related: ['beverage-content-storytelling', 'youtube-auto-dubbing-review'],
    body: [
      '<p class="lead">口播不好剪，不一定是軟體功能不足，也可能是拍攝時把好幾個意思塞在同一個長鏡頭裡。把一段 30 秒介紹拆成幾個有明確任務的片段，重拍、刪停頓和補畫面都會更容易。</p>',
      '<p>Meta 2026 年 4 月 22 日的 Edits 一週年公告提到，App 內有可調整文字大小與速度的提詞器；Ideas 分頁可放入已儲存的 Instagram reels、音訊與便利貼；模板也能開啟專案結構。公告同時把雙語字幕、進階色彩調整、速度曲線，以及含疊加與關鍵影格的更複雜模板列為持續開發方向，本篇不把它們當成目前每個帳號都已上線的功能。</p>',
      '<section id="official-update" class="chapter"><h2>01 / 公告裡有什麼，還有哪些是未來</h2><p>這次練習不需要登入，也沒有做真實帳號測試。把公告當作背景就好：提詞器能幫你保持一句話的順序，Ideas 能把靈感與備註放在同一個地方，模板結構則可能讓你先看見可編輯的骨架。真正決定素材是否好剪的，仍是每個鏡頭是否只負責一個清楚動作。</p><aside class="margin-note"><strong>先保留版本差異</strong><p>如果你的畫面沒有某項功能，不代表你操作錯誤；公告中的「coming」也不等於今天已在你的地區、版本或帳號可用。</p></aside></section>',
      '<section id="three-shots" class="chapter"><h2>02 / 用一句話一鏡頭拍三次</h2><p>假設要介紹一台虛構的桌面小風扇。把口播改成三句：「它放得進小桌角。」「我用近拍示範三段風量。」「關掉聲音，也看得到手勢。」每句單獨錄三次，句子前後各留一小段安靜空白；不要為了省時間把三句連成一鏡。</p>',
      '<figure class="explainer"><div class="frame"><div class="signal-grid"><div class="note-panel"><span class="number">01</span><h3>0–08 秒｜A-roll</h3><p>正面說明小風扇放在桌角；一個主張，一個動作。</p></div><div class="note-panel"><span class="number">02</span><h3>08–20 秒｜B-roll</h3><p>近拍按鍵與手勢，讓畫面補足口播看不到的細節。</p></div><div class="note-panel"><span class="number">03</span><h3>20–30 秒｜收尾</h3><p>回到人物與物件，留出剪掉重複句的空間。</p></div></div><p><b>概念時間線：</b>一句話 → 一個鏡頭 → 一段可替換素材。時間僅為拍攝練習分配，不是平台規則。</p></div><figcaption>圖 1｜原創教學示意，不是 Edits 時間軸或任何 App UI 截圖；A-roll、B-roll 與秒數只是本篇虛構拍攝腳本。</figcaption></figure>',
      '<p>拍攝時把 A-roll 當作主要說明，把 B-roll 當作證據或節奏轉換。三次 take 不必追求完全一樣，標記「字清楚」「手勢完整」「停頓自然」即可；剪輯時先選能聽懂的一次，再用另外兩次補局部，不要先被濾鏡或模板牽著走。</p></section>',
      '<section id="edit-check" class="chapter"><h2>03 / 剪輯前後都做一次可觀看檢查</h2><p>把素材放進時間線前，先做小清單：A-roll 的每句話是否能獨立理解、B-roll 是否真的補充畫面、字幕是否逐字人工核對。輸出後先靜音看一次，確認動作和字幕仍能帶你走完，再開聲音聽一次，檢查剪接是否切斷字尾、環境聲是否蓋住重點。</p>',
      '<figure class="explainer"><div class="table-scroll" tabindex="0" role="region" aria-label="口播素材剪輯前後檢查與比較表，可橫向捲動"><table><caption>虛構小風扇短片／拍攝清單與驗收方式</caption><thead><tr><th scope="col">素材</th><th scope="col">剪輯前要留</th><th scope="col">輸出後要看</th></tr></thead><tbody><tr><th scope="row">A-roll 口播</th><td>三次 take、句首句尾空白</td><td>靜音看字幕，開聲聽字尾</td></tr><tr><th scope="row">B-roll 手勢</th><td>按鍵、風量與物件關係</td><td>畫面是否真的對上敘述</td></tr><tr><th scope="row">字幕</th><td>先用草稿，再逐句人工核對</td><td>不讓字幕替錯誤音訊背書</td></tr><tr><th scope="row">版本</th><td>保留原始素材與備用 take</td><td>記下輸出日期，不覆蓋母檔</td></tr></tbody></table></div><figcaption>圖 2｜原創教學示意，不是 Edits 專案檢查介面；表中物件、台詞與流程為編輯部虛構示例。</figcaption></figure>',
      '<p>這樣做的價值，是讓「好剪」變成可以檢查的素材條件，而不是猜某個模板會不會救回混亂的口播。你可以再把鏡頭順序換掉，看看故事是否仍然成立；若換了就聽不懂，表示資訊還綁在單一長鏡頭裡。</p><p class="source-note"><strong>官方事實與編輯建議（查核：2026-09-06）</strong><br>官方事實：<a href="https://about.fb.com/news/2026/04/one-year-of-edits-built-for-and-with-creators/">Meta Newsroom，2026-04-22</a> 公告了提詞器、Ideas 分頁、便利貼與模板結構，也把雙語字幕、進階色彩、速度曲線及更複雜模板描述為後續方向。編輯建議：本文的虛構小風扇、三鏡頭時間線、三次 take、A-roll／B-roll 清單與靜音／開聲檢查都是原創練習；未測試真實帳號、未使用 App 截圖，也不宣稱任何功能已在所有地區上線或能帶來觀看、銷售提升。</p>'
    ].join('')
  },
  {
    slug: 'tiktok-search-topic-workshop',
    title: '從 TikTok 2026 趨勢看選題：把熱門搜尋變成可回答的問題',
    description: '從 TikTok Next 2026 的搜尋探索觀察出發，以通勤包為例，把模糊的熱門題目拆成具體問題、證據鏡頭與一張可反覆使用的選題表。',
    number: '06',
    published: '2026-09-06',
    category: '社群觀察',
    categoryId: 'observation',
    coverAlt: '通勤肩包、雨傘與筆記本放在窗邊木桌上，呈現把搜尋疑問整理成短片選題的虛構場景。',
    caption: 'AI 生成虛構場景配圖｜從一個生活疑問開始找證據；非真實 TikTok 搜尋資料、帳號或貼文截圖。',
    toc: [
      ['trend-context', '先知道趨勢報告能說什麼'],
      ['question-map', '把通勤包需求改寫成問題'],
      ['small-plan', '沒有工具時也能做的小型工作表']
    ],
    related: ['reading-social-comment-signals', 'edits-mobile-video-workflow'],
    body: [
      '<p class="lead">熱門搜尋可以提示人們正在找什麼字，卻不能直接回答「他為什麼找」「他是否相信這個答案」，更不能代替需求訪談或銷售資料。選題的第一步，是把熱度退一步，改問一個你真的能用畫面回答的問題。</p>',
      '<p>TikTok 2026 年 1 月 14 日發布的 TikTok Next 趨勢預測，把 Curiosity Detours 描述成更主動探索、繞路發現答案的行為方向。這是 TikTok 對平台文化的預測報告，不是台灣使用者的獨立調查；本篇不引用報告中的調查數字，也不把它當成台灣受眾已被證明的需求。</p>',
      '<section id="trend-context" class="chapter"><h2>01 / 先知道趨勢報告能說什麼</h2><p>趨勢報告只適合提出「觀眾可能想看問題如何解開」的假設，不是題目必紅的證明。TikTok 2024 年 3 月 13 日介紹 Creator Search Insights，說明部分地區可看到搜尋主題、分類、For You、content gap；可在 App 搜尋欄輸入名稱找入口，實際可用性依 App 與官方說明而定。</p><aside class="margin-note"><strong>兩個詞不要混用</strong><p>「搜尋很多」是平台上可見的行為訊號；「有需求」需要更多脈絡；「會購買」更是另一個尚未被這篇練習證明的命題。</p></aside></section>',
      '<section id="question-map" class="chapter"><h2>02 / 把通勤包需求改寫成問題</h2><p>下面用虛構的「通勤包」作練習，不抓取任何真實貼文，也不填入平台數據。每個問題都要能被一個有限的鏡頭回答，並把標題範圍說清楚；如果只能用「超好用」「必買」形容，就代表還沒有可驗證的證據。</p>',
      '<figure class="explainer"><div class="table-scroll" tabindex="0" role="region" aria-label="從通勤包需求到可拍證據的選題表，可橫向捲動"><table><caption>原創選題示意／虛構通勤包，不是 TikTok 搜尋結果</caption><thead><tr><th scope="col">模糊需求</th><th scope="col">可回答問題</th><th scope="col">證據鏡頭</th><th scope="col">有界標題</th></tr></thead><tbody><tr><th scope="row">怕東西受潮</th><td>少量滴水後，內層哪裡可見水痕？</td><td>空袋、不放電子物品，記錄滴水量與觀察時間</td><td>通勤包內層：少量滴水的觀察記錄</td></tr><tr><th scope="row">怕筆電難放</th><td>筆電怎麼放才不壓到線材？</td><td>放入、關袋、取出的連續動作</td><td>通勤包收納：一台筆電的放入順序</td></tr><tr><th scope="row">想找小物</th><td>鑰匙放哪裡比較快拿？</td><td>固定口袋與一次取放示範</td><td>三十秒看懂一個小物袋位置</td></tr></tbody></table></div><figcaption>圖 1｜原創教學示意，不是 TikTok 搜尋資料、真實貼文或 UI 截圖；問題、鏡頭與標題皆為編輯部虛構。滴水僅是有限觀察，不代表一般防水。</figcaption></figure>',
      '<p>拍攝時不要順手複製別人的句子或畫面。先寫自己的問題，再決定要展示哪個可見條件；如果不能在鏡頭裡回答，就把標題改窄，或把它列成待研究，而不是用熱度填補證據空白。</p></section>',
      '<section id="small-plan" class="chapter"><h2>03 / 沒有工具時也能做的小型工作表</h2><p>Creator Search Insights 不保證每個台灣帳號都看得到；實際可用性依 App 與官方說明而定，Help 頁可作延伸參考，本文不把未逐帳號確認的門檻當通則。若找不到入口，不要繞過限制，也不要把搜尋欄結果當完整市場資料；先用自己的問題工作表做一輪。</p>',
      '<figure class="explainer"><ol class="steps"><li><span>01</span><h3>收集自己的問題</h3><p>從通勤、收納或使用卡點寫下原句，不抄貼文標題。</p></li><li><span>02</span><h3>縮小可回答範圍</h3><p>一支短片只回答一問，先寫不能證明什麼。</p></li><li><span>03</span><h3>安排證據鏡頭</h3><p>拍一個動作、一個限制與一個可回看的結果。</p></li></ol><figcaption>圖 2｜原創教學示意，不是 TikTok 工具流程或 UI 截圖；三步是本文的手動選題工作法。</figcaption></figure>',
      '<p>發布後也不要只看題目是否有觀看。回看留言是在追問同一個問題、質疑哪個條件，還是只回應剪輯風格；把新問題放回下一張工作表。這樣，搜尋訊號只是起點，畫面證據與讀者追問才會讓選題逐步變得更具體。</p><p class="source-note"><strong>官方事實與編輯建議（查核：2026-09-06）</strong><br>官方事實：<a href="https://newsroom.tiktok.com/introducing-tiktok-next-2026-our-trend-forecast-for-marketers-for-the-year-ahead-ca?lang=en-CA">TikTok Newsroom，2026-01-14</a> 是平台對 2026 的趨勢預測；<a href="https://newsroom.tiktok.com/creator-search-insights?lang=en">TikTok Newsroom，2024-03-13</a> 說明 Creator Search Insights 曾在部分地區推出，並提到分類、For You 與 content gap。<a href="https://support.tiktok.com/en/using-tiktok/growing-your-audience/creator-search-insights">TikTok Help</a> 可作延伸參考；可用性依 App 與官方說明而定，本文不宣稱台灣可用、不把未逐帳號確認的門檻當通則。編輯建議：通勤包表格、三步工作法與判斷「搜尋／需求／銷售」的分界均為原創練習，沒有資料蒐集或銷售預測。</p>'
    ].join('')
  }
];
