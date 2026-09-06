import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import vm from 'node:vm';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const baseline='a4edbe2531c183658a1d7f45dca8a6274745a232';
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const old=f=>execFileSync('git',['show',`${baseline}:${f}`],{cwd:root,encoding:'utf8'});
const cases=['camay-curling-iron','liming-weiquan-cheer','korea-kol-goodme'];
const targets=[...['','zh-tw/','zh-cn/','en/'].flatMap(p=>cases.map(s=>`${p}cases/${s}/index.html`)),...['','zh-cn/','en/'].flatMap(p=>[`${p}services/taiwan-influencer-marketing/index.html`,`${p}insights/taiwan-influencer-marketing-costs-2026/index.html`])];
const meta=html=>[...html.matchAll(/<(?:title|h1)\b[^>]*>[\s\S]*?<\/(?:title|h1)>|<meta\s[^>]+>|<link\s[^>]*(?:canonical|alternate)[^>]*>/g)].map(m=>m[0]);
for(const f of targets){
 const html=read(f),before=old(f);
 assert.deepEqual(meta(html),meta(before),`Preserve title/H1/meta/canonical/hreflang: ${f}`);
 assert.equal((html.match(/src="[^\"]*web-assets\/analytics.js\?/g)||[]).length,1);
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
 assert.ok(!html.includes('<form'),'Reuse existing forms, no duplicate forms');
 assert.match(html,/index, follow/);
 for(const script of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(script[1]);
 for(const href of [...before.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m=>m[1]))assert.ok(html.includes(`href="${href}"`),`Existing link retained ${f}: ${href}`);
 if(f.includes('/cases/')||f.startsWith('cases/')){
  for(const marker of ['case-opening','case-facts','asset-reading','case-reasoning','case-handover','case-boundary'])assert.ok(html.includes(`class="${marker}"`),`${f}: ${marker}`);
  assert.equal((html.match(/<figure\b/g)||[]).length,1);
  assert.equal((html.match(/<img\b/g)||[]).length,1,'Use existing asset, not invented extra evidence');
  assert.match(html,/data-track-location="case-cta"/);
 }else if(f.includes('/services/')||f.startsWith('services/')){
  assert.ok(html.indexOf('class="taiwan-case-proof"')<html.indexOf('class="scope-module"'));
  assert.ok(html.indexOf('class="scope-module"')<html.indexOf('class="service-notes"'));
  assert.match(html,/class="sample-tag"/);
  assert.match(html,/class="service-notes"[\s\S]*?<details>/);
  assert.equal((html.match(/data-track-location="taiwan-service-case"/g)||[]).length,2);
 }else{
  for(const marker of ['pricing-comparison','pricing-scenarios','pricing-request','historical-pricing'])assert.ok(html.includes(`class="${marker}"`));
  assert.ok(html.indexOf('class="historical-pricing"')<html.indexOf('ZG-PR-2025-01'));
  assert.match(html,/<textarea id="quote-checklist" readonly/);
  assert.match(html,/data-track-location="pricing-copy-brief"/);
  assert.match(html,/"datePublished": "2026-07-23"/);
  assert.match(html,/"dateModified": "2026-09-06"/);
 }
}
for(const f of ['index.html','zh-tw/index.html','zh-cn/index.html','en/index.html','sitemap.xml','web-assets/analytics.js','web-assets/analytics-config.js'])assert.equal(read(f),old(f),`Frozen ${f}`);
// Clipboard success and denied-permission fallback both preserve the original text.
let click,notice='',selected=false,written='';
const field={value:'A\nB',focus(){},select(){selected=true;}},button={dataset:{copySuccess:'copied',copyFallback:'select'},addEventListener(type,fn){assert.equal(type,'click');click=fn;}},status={set textContent(v){notice=v;}};
const document={querySelector:s=>s==='[data-copy-inquiry]'?button:s==='#quote-checklist'?field:status};
const navigator={clipboard:{async writeText(v){written=v;}}};
vm.runInNewContext(read('web-assets/decision-support.js'),{document,navigator});await click();assert.equal(written,'A\nB');assert.equal(notice,'copied');
navigator.clipboard.writeText=async()=>{throw Error('denied');};await click();assert.ok(selected);assert.equal(notice,'select');assert.equal(field.value,'A\nB');
console.log('PASS: 18 decision/case routes, frozen metadata/homepages/GA/sitemap, existing links, explicit samples, history separation and clipboard fallback');
