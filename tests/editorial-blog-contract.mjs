import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { posts,published,views,mean,median,asset,shareAsset,blogLocales,localizedPost,href,indexHref,newestFirst } from '../tools/editorial-blog.mjs';
import { seoPhaseOnePages } from '../tools/seo-phase-one-content.mjs';
const root=path.resolve(import.meta.dirname,'..'),base='https://zhenguocool.com';
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const old=file=>execFileSync('git',['show',`88c77a0c49435f7e978331dec18b555fae90f0c6:${file}`],{cwd:root,encoding:'utf8'});
for(const file of ['index.html','zh-tw/index.html','zh-cn/index.html','en/index.html','web-assets/analytics.js','web-assets/analytics-config.js'])assert.equal(read(file),old(file),`${file} is frozen`);
for(const locale of blogLocales)for(const p of seoPhaseOnePages.filter(p=>p.kind==='article')){
 const file=`${locale.prefix}insights/${p.slug}/index.html`;
 const label=locale.key==='en'?'All articles｜ZhenguoCool Journal':locale.key==='zh-CN'?'全部文章｜榛果笔记':'全部文章｜榛菓筆記';
 const added=`\n          <a class="button" href="${indexHref(locale)}" data-track-event="article_index_click" data-track-location="guide-blog-index">${label}</a>`;
 assert.equal(read(file).split(added).length,2);assert.equal(read(file).replace(added,''),old(file),'guide change limited to locale-correct journal entry');
}
assert.equal(views.reduce((a,b)=>a+b,0),50000);assert.equal(mean,5000);assert.equal(median,2300);
assert.deepEqual([...posts].sort(newestFirst).map(p=>p.number),['06','05','04','03','02','01']);
for(const locale of blogLocales){
 const index=read(`${locale.prefix}insights/index.html`);
 const order=[...index.matchAll(/class="post-card" id="note-(\d+)"/g)].map(m=>m[1]);assert.deepEqual(order,['06','05','04','03','02','01']);
 assert.equal((index.match(/data-category=/g)||[]).length,5);assert.ok(index.includes('filters.js'));
 const ids=[...index.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
 for(const slug of ['',...posts.map(p=>p.slug)]){
  const route=`${locale.prefix}insights/${slug?slug+'/':''}`,html=read(route+'index.html'),url=base+'/'+route;
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1);assert.ok(html.includes(`<html lang="${locale.key}">`));
  assert.ok(html.includes(`rel="canonical" href="${url}"`));assert.ok(read('sitemap.xml').includes(`<loc>${url}</loc>`));
  assert.ok(!/noindex|FAQPage|"@type":"Service"|<canvas/.test(html));
  assert.equal((html.match(/src="\/web-assets\/analytics.js\?/g)||[]).length,1);
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  assert.equal(graph[0]['@type'],slug?'BlogPosting':'CollectionPage');assert.equal(graph[0].inLanguage,locale.key);
  for(const target of blogLocales){
   const destination=base+indexHref(target)+(slug?slug+'/':'');
   assert.ok(html.includes(`hreflang="${target.key}" href="${destination}"`));
   if(target.key!==locale.key)assert.ok(html.includes(`href="${indexHref(target)}${slug?slug+'/':''}" lang="${target.key}" data-lang-link="${target.key}"`));
  }
  assert.ok(html.includes(`hreflang="x-default" href="${base}/insights/${slug?slug+'/':''}"`));
  for(const match of html.matchAll(/(?:src|href)="(\/[^"?#]*)/g)){
   let local=match[1].slice(1);if(!local||local.endsWith('/'))local+='index.html';
   assert.ok(fs.existsSync(path.join(root,local)),`Missing local target: ${local}`);
  }
  if(!slug)continue;
  const source=posts.find(p=>p.slug===slug),p=localizedPost(source,locale),date=p.published||published;
  assert.equal((html.match(/<figure\b/g)||[]).length,3);
  assert.ok(!/quote_request_click|service_cta_click|<form/.test(html));assert.ok(html.includes(`datetime="${date}"`));assert.equal(graph[0].datePublished,date);
  assert.equal(graph[0].image,base+shareAsset(p,locale));assert.ok(html.includes(`property="og:image" content="${base}${shareAsset(p,locale)}"`));
  for(const file of [asset(p),shareAsset(p,locale)]){
   const bytes=fs.readFileSync(path.join(root,file));assert.ok(bytes.length<600000);assert.equal(bytes.subarray(8,12).toString(),'WEBP');
  }
  const tagNames=body=>body.match(/<\/?[\w:-]+/g);
  assert.deepEqual(tagNames(p.body),tagNames(source.body),'translation preserves full structure');
  const sources=body=>[...body.matchAll(/href="([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(sources(p.body),sources(source.body),'source URLs retained');
  assert.equal(p.toc.length,source.toc.length);
  if(locale.key==='en')assert.ok(!/[\u3400-\u9fff]/.test(p.body),'no untranslated Chinese body text');
  assert.ok(p.body.length>source.body.length*.7,'not a summarized translation');
 }
}
const locs=read('sitemap.xml').match(/<loc>[^<]+<\/loc>/g),prior=old('sitemap.xml').match(/<loc>[^<]+<\/loc>/g);
assert.equal(new Set(locs).size,locs.length);assert.equal(locs.length,prior.length+(posts.length+1)*blogLocales.length);for(const loc of prior)assert.ok(locs.includes(loc));
console.log('PASS: 21 localized journal routes, complete translations, reciprocal language links, correct ordering, share assets and frozen homepages/GA');
