export const PRESETS = {
  food: {group:'food', label:'今天吃什麼', items:'滷肉飯|牛肉麵|水餃|炒飯|便當|咖哩飯|烏龍麵|拉麵|壽司|義大利麵|披薩|漢堡|越南河粉|韓式拌飯|火鍋|粥|鍋貼|飯糰|三明治|自煮一餐'.split('|')},
  light: {group:'food', label:'清爽一餐', items:'蔬菜湯與麵包|烤蔬菜飯碗|豆腐蔬菜鍋|涼麵|蒸蛋與白飯|雞肉沙拉|飯糰與湯|菇菇燉飯|番茄義大利麵|蔬食三明治'.split('|')},
  taipei: {group:'metro', label:'臺北捷運・板南線', items:'頂埔|永寧|土城|海山|亞東醫院|府中|板橋|新埔|江子翠|龍山寺|西門|台北車站|善導寺|忠孝新生|忠孝復興|忠孝敦化|國父紀念館|市政府|永春|後山埤|昆陽|南港|南港展覽館'.split('|')},
  taichung: {group:'metro', label:'臺中捷運・綠線', items:'北屯總站|舊社|松竹|四維國小|文心崇德|文心中清|文華高中|文心櫻花|市政府|水安宮|文心森林公園|南屯|豐樂公園|大慶|九張犁|九德|烏日|高鐵臺中站'.split('|')},
  inside: {group:'activity', label:'待在室內也很好', items:'整理一個抽屜|讀二十分鐘的書|做一頓沒試過的料理|看一部收藏已久的電影|寫一頁日記|整理手機相簿|畫一張小卡|聽完一張專輯|做十分鐘伸展|拼圖或桌遊|打電話問候朋友|什麼也不安排，休息一下'.split('|')},
  outside: {group:'activity', label:'出門走走', items:'到公園散步|逛一間獨立書店|走訪市場|找一條沒走過的街道|去河岸看風景|帶相機記錄街景|看一場展覽|找個地方寫明信片|和朋友喝杯茶|坐一段平常不搭的捷運|野餐|散步找五種不同的顏色'.split('|')},
  video: {group:'creator', label:'今天拍什麼', items:'用三個鏡頭記錄早晨|拍一段工作前後的對比|介紹最近反覆使用的小物|用第一人稱記錄一段路|拍一個常被忽略的細節|做一個一分鐘教學|用聲音記錄今天|挑戰只用固定鏡位說故事|分享一次失敗和學到的事|訪問朋友一個有趣問題|重拍一個舊作品看看差異|用一個顏色串起三個場景'.split('|')},
  post: {group:'creator', label:'今天分享什麼', items:'新手最常問你的三個問題|你改變看法的一件事|一份實際使用的工作清單|最近讀到的一句話與想法|一個前後對照案例|介紹你所在城市的小細節|一個省時間的小方法|工作桌上的五件物品|做這件事以前希望有人提醒你什麼|本週的小發現|拆解一個你喜歡的作品|用一張照片寫一段故事'.split('|')},
  custom: {group:'custom', label:'自訂名單', items:[]}
};
export const GROUP_LABELS = {food:'吃什麼', metro:'去哪一站', activity:'做什麼', creator:'創作靈感', custom:'自訂名單'};
export function parseOptions(raw) {
  if (typeof raw !== 'string' || raw.length > 30000) throw Error('名單過長，請控制在 30,000 字元以內。');
  const items=[], seen=new Set(); let duplicates=0;
  for (const line of raw.split(/\r?\n/)) {
    const value=line.normalize('NFKC').trim(); if (!value) continue;
    if ([...value].length>100) throw Error('每個選項最多 100 個字元，請縮短較長的項目。');
    const key=value.toLowerCase(); if (seen.has(key)) { duplicates++; continue; }
    seen.add(key); items.push(value);
    if (items.length>200) throw Error('最多 200 個不同選項，請減少名單。');
  }
  return {items,duplicates};
}
export function randomInt(max, fill=values=>globalThis.crypto.getRandomValues(values)) {
  if (!Number.isInteger(max)||max<1||max>200) throw Error('隨機範圍無效。');
  const limit=Math.floor(4294967296/max)*max, value=new Uint32Array(1);
  do { fill(value); } while (value[0]>=limit);
  return value[0]%max;
}
export function shuffled(items, random=randomInt) {
  const copy=[...items];
  for(let i=copy.length-1;i>0;i--){const j=random(i+1);[copy[i],copy[j]]=[copy[j],copy[i]];}
  return copy;
}
export function selectItems(items,count,used=[],random=randomInt) {
  const excluded=new Set(used),pool=items.filter(item=>!excluded.has(item));
  if(!Number.isInteger(count)||count<1||count>10)throw Error('每次請抽 1–10 個。');
  if(count>pool.length)throw Error(pool.length?'剩餘選項不足，請減少抽選數或重設抽籤池。':'選項已抽完，請先重設抽籤池。');
  return shuffled(pool,random).slice(0,count);
}
export function splitGroups(items,count,random=randomInt) {
  if(!Number.isInteger(count)||count<2||count>10||count>items.length)throw Error('請設定 2–10 組，且組數不可超過名單人數。');
  const groups=Array.from({length:count},()=>[]);
  shuffled(items,random).forEach((item,i)=>groups[i%count].push(item));return groups;
}
export function summaryText(result) {
  return `${result.title}｜第 ${result.round} 次\n`+result.groups.map((g,i)=>(result.mode==='groups'?`第 ${i+1} 組\n`:'')+g.join('\n')).join('\n\n');
}
const track=(name,format)=>{try{window.zgToolEvent?.(name,{format});}catch{}};
function wrapText(ctx,text,width) {
  const units=typeof Intl.Segmenter==='function'?[...new Intl.Segmenter('zh-TW',{granularity:'grapheme'}).segment(text)].map(x=>x.segment):[...text];
  const lines=[];let line='';for(const char of units){if(line&&ctx.measureText(line+char).width>width){lines.push(line);line='';}line+=char;}lines.push(line);return lines;
}
export async function resultPng(result) {
  const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
  if(!ctx)throw Error('此瀏覽器無法產生圖片，請改用複製結果。');
  const single=result.mode==='pick'&&result.groups[0].length===1,textFont=`${single?'600 72px':'32px'} "PingFang TC","Microsoft JhengHei",sans-serif`,lineHeight=single?96:48;
  canvas.width=1080;ctx.font=textFont;
  const lines=result.groups.flatMap((group,i)=>[...(result.mode==='groups'?[`第 ${i+1} 組`]:[]),...group.flatMap(value=>wrapText(ctx,(single?'':'• ')+value,880)),'']);
  const height=Math.max(760,400+lines.length*lineHeight);if(height>8000)throw Error('結果太長，請改用複製文字，或減少名單後下載圖片。');
  canvas.height=height;ctx.fillStyle='#f5f0e5';ctx.fillRect(0,0,1080,height);ctx.fillStyle='#244a3a';ctx.fillRect(0,0,1080,18);
  ctx.fillStyle='#a53e2d';ctx.font='22px sans-serif';ctx.fillText('A LITTLE CHANCE / 日常抽籤',80,86);
  ctx.fillStyle='#20352d';ctx.font='bold 40px "PingFang TC","Microsoft JhengHei",sans-serif';ctx.fillText(result.title,80,165);
  ctx.font='24px sans-serif';ctx.fillText(`第 ${result.round} 次 · ${result.mode==='groups'?'隨機分組':'隨機抽選'}`,80,218);
  ctx.fillStyle='#fffdf8';ctx.fillRect(56,256,968,height-356);ctx.fillStyle='#a53e2d';ctx.fillRect(56,256,968,6);
  ctx.fillStyle='#20352d';ctx.font=textFont;lines.forEach((line,i)=>ctx.fillText(line,80,350+i*lineHeight));
  ctx.fillStyle='#66716b';ctx.font='20px sans-serif';ctx.fillText('zhenguocool.com/tools/daily-draw/ · 日常選擇輔助，非抽獎公證',80,height-48);
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('圖片產生失敗，請改用複製結果。')),'image/png'));
}
export function initDailyDraw(root=document.querySelector('#draw-app')) {
  if(!root||root.dataset.ready)return;root.dataset.ready='true';
  const $=s=>root.querySelector(s),form=$('#draw-form'),list=$('#draw-options'),preset=$('#draw-preset'),mode=$('#draw-mode'),count=$('#draw-count'),groupCount=$('#draw-group-count'),noRepeat=$('#draw-no-repeat'),notice=$('#draw-notice'),stage=$('#draw-stage'),output=$('#draw-output'),history=$('#draw-history'),copy=$('#draw-copy'),png=$('#draw-png');
  let items=[],used=[],round=0,latest=null,records=[],busy=false,loadedPreset='food';
  const again=$('#draw-again'),stageReset=$('#draw-reset-stage');
  const setNotice=message=>{notice.textContent=message;$('#draw-status-copy').textContent=message;};
  const clearResults=()=>{used=[];round=0;latest=null;records=[];output.replaceChildren();history.replaceChildren();copy.disabled=true;png.disabled=true;$('#draw-result-title').textContent='把一點選擇，交給偶然。';};
  const updateCount=()=>{$('#draw-count-note').textContent=`${items.length} 個選項 · 本輪剩餘 ${noRepeat.checked?items.length-used.length:items.length} 個`;stageReset.hidden=round===0;};
  const syncMode=()=>{const grouping=mode.value==='groups';$('#draw-pick-controls').hidden=grouping;$('#draw-group-controls').hidden=!grouping;count.disabled=grouping;noRepeat.disabled=grouping;groupCount.disabled=!grouping;$('#draw-submit').textContent=again.textContent=grouping?'幫我分組':'抽一張籤';};
  const readList=()=>{clearResults();try{const parsed=parseOptions(list.value);items=parsed.items;setNotice(parsed.duplicates?`已合併 ${parsed.duplicates} 個重複選項，每個選項只有一份機會。`:items.length?'修改名單會重設抽籤池與紀錄；資料只留在目前分頁。':'每行填一個選項，就可以開始。');}catch(error){items=[];setNotice(error.message);}updateCount();};
  const setPreset=(key,initial=false)=>{
    if(!PRESETS[key])return;
    const edited=list.value!==PRESETS[loadedPreset].items.join('\n');
    if(!initial&&edited&&!window.confirm('切換範本會取代目前編輯的名單與結果，確定切換嗎？')){preset.value=loadedPreset;return;}
    loadedPreset=key;preset.value=key;list.value=PRESETS[key].items.join('\n');readList();
    root.querySelectorAll('[data-scenario]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scenario===PRESETS[key].group)));
    $('#draw-preset-note').textContent=PRESETS[key].group==='metro'?'站名清單核對於 2026-09-09，僅含所選路線；出發前請另查官方營運資訊。':'範本只是起點，刪掉不適合的選項，再加上你的想法。';
  };
  const renderResult=result=>{
    latest=result;$('#draw-result-title').textContent=result.mode==='groups'?'這次的組合，出爐了。':'今天，就選這個吧。';output.replaceChildren();output.dataset.mode=result.mode;
    result.groups.forEach((group,i)=>{const card=document.createElement('article');card.className='draw-result-card';const label=document.createElement('small');label.textContent=result.title+' · '+(result.mode==='groups'?`第 ${i+1} 組`:`第 ${result.round} 張決定籤`);card.append(label);for(const item of group){const p=document.createElement('p');p.textContent=item;card.append(p);}output.append(card);});
    records.unshift(result);records=records.slice(0,10);history.replaceChildren();
    records.forEach(record=>{const details=document.createElement('details'),summary=document.createElement('summary'),p=document.createElement('p');summary.textContent=`第 ${record.round} 次 · ${record.mode==='groups'?'分組':'抽籤'} · ${record.groups.flat().length} 個選項`;p.textContent=summaryText(record);details.append(summary,p);history.append(details);});
    copy.disabled=false;png.disabled=false;again.textContent=result.mode==='groups'?'再分一次':'再抽一次';updateCount();setNotice(result.mode==='groups'?`已分成 ${result.groups.length} 組，每人只出現一次。`:`已抽出 ${result.groups[0].length} 個：${result.groups[0].join('、')}`);
    if(window.innerWidth<=760)stage.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  };
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(busy)return;
    try{
      if(!items.length)throw Error('請先填入有效選項。');
      const grouping=mode.value==='groups',groups=grouping?splitGroups(items,Number(groupCount.value)):[selectItems(items,Number(count.value),noRepeat.checked?used:[])];
      busy=true;again.disabled=true;form.querySelector('fieldset').disabled=true;root.querySelectorAll('[data-scenario]').forEach(b=>b.disabled=true);copy.disabled=true;png.disabled=true;stage.classList.add('is-drawing');stage.setAttribute('aria-busy','true');setNotice('正在抽籤…');
      if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)await new Promise(resolve=>setTimeout(resolve,550));
      if(!grouping&&noRepeat.checked)used.push(...groups[0]);
      renderResult({title:PRESETS[loadedPreset].label+(list.value!==PRESETS[loadedPreset].items.join('\n')?'（已編輯）':''),mode:grouping?'groups':'pick',groups,round:++round});
      track('tool_complete','preview');
    }catch(error){setNotice(error.message);}
    finally{busy=false;again.disabled=false;form.querySelector('fieldset').disabled=false;root.querySelectorAll('[data-scenario]').forEach(b=>b.disabled=false);stage.classList.remove('is-drawing');stage.setAttribute('aria-busy','false');}
  });
  list.addEventListener('input',readList);preset.addEventListener('change',()=>setPreset(preset.value));
  root.querySelectorAll('[data-scenario]').forEach(button=>button.addEventListener('click',()=>setPreset(Object.keys(PRESETS).find(k=>PRESETS[k].group===button.dataset.scenario))));
  mode.addEventListener('change',()=>{clearResults();syncMode();updateCount();setNotice('已切換模式，使用目前完整名單重新開始。');});
  noRepeat.addEventListener('change',()=>{clearResults();updateCount();setNotice('已套用新規則並重設抽籤池。');});
  const reset=()=>{if(busy)return;clearResults();updateCount();setNotice('抽籤池與紀錄已重設，名單保留。');};
  $('#draw-reset').addEventListener('click',reset);stageReset.addEventListener('click',reset);
  copy.addEventListener('click',async()=>{if(!latest||busy)return;try{await navigator.clipboard.writeText(summaryText(latest));setNotice('已複製本次結果。');track('tool_export','text');}catch{setNotice('瀏覽器未允許複製，請選取結果文字後手動複製。');}});
  png.addEventListener('click',async()=>{if(!latest||busy)return;const result=latest;png.disabled=true;try{const blob=await resultPng(result),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='daily-draw.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setNotice('結果圖片已建立，請查看瀏覽器下載項目。');track('tool_export','png');}catch(error){setNotice(error.message);}finally{png.disabled=!latest;}});
  setPreset('food',true);syncMode();return {getState:()=>({items:[...items],used:[...used],round,busy,latest})};
}
if(typeof document!=='undefined'){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>initDailyDraw(),{once:true});else initDailyDraw();
}
