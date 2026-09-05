import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { posts, views, mean, median, asset, shareAsset, coverCopy } from '../tools/editorial-blog.mjs';
import { seoPhaseOnePages } from '../tools/seo-phase-one-content.mjs';
const root=path.resolve(import.meta.dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const baseline='88c77a0c49435f7e978331dec18b555fae90f0c6';
const old=file=>execFileSync('git',['show',`${baseline}:${file}`],{cwd:root,encoding:'utf8'});
for(const file of ['index.html','zh-tw/index.html','zh-cn/index.html','en/index.html','web-assets/analytics.js','web-assets/analytics-config.js']) assert.equal(read(file),old(file),`${file} is frozen`);
const added='\n          <a class="button" href="/insights/" data-track-event="article_index_click" data-track-location="guide-blog-index">全部文章｜榛菓筆記</a>';
for(const page of seoPhaseOnePages.filter(p=>p.kind==='article')) {
  const file=`insights/${page.slug}/index.html`;
  assert.equal(read(file).split(added).length,2,'one discoverable blog link');
  assert.equal(read(file).replace(added,''),old(file),'old guide differs only by new reading link');
  for(const lang of ['zh-cn','en']) assert.equal(read(`${lang}/${file}`),old(`${lang}/${file}`));
}
assert.equal(views.length,10);assert.equal(views.reduce((a,b)=>a+b,0),50000);assert.equal(mean,5000);
const sorted=[...views].sort((a,b)=>a-b);assert.equal(median,(sorted[4]+sorted[5])/2);assert.equal(median,2300);
for(const route of ['insights/',...posts.map(p=>`insights/${p.slug}/`)]) {
  const html=read(route+'index.html');
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
  assert.ok(html.includes(`rel="canonical" href="https://zhenguocool.com/${route}"`));
  assert.ok(read('sitemap.xml').includes(`<loc>https://zhenguocool.com/${route}</loc>`));
  assert.ok(!/hreflang=|noindex|FAQPage|"@type":"Service"/.test(html));
  assert.equal((html.match(/src="\/web-assets\/analytics.js\?/g)||[]).length,1);
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  assert.equal(graph[0]['@type'],route==='insights/'?'CollectionPage':'BlogPosting');
  assert.ok(graph.some(x=>x['@type']==='BreadcrumbList'));
  for(const match of html.matchAll(/(?:src|href)="(\/[^"?#]*)/g)) {
    let local=match[1].slice(1);if(!local||local.endsWith('/'))local+='index.html';
    assert.ok(fs.existsSync(path.join(root,local)),`local asset/link exists: ${local}`);
  }
}
for(const p of posts) {
  const html=read(`insights/${p.slug}/index.html`);
  assert.equal((html.match(/<figure\b/g)||[]).length,3,'cover plus two explanatory visuals');
  assert.ok(!/quote_request_click|service_cta_click|<form/.test(html));
  assert.ok(html.includes('示意')||html.includes('合成資料'));
  assert.ok(p.body.replace(/<[^>]*>/g,'').length>=1000);
  const coverPath=path.join(root,asset(p));
  assert.ok(fs.statSync(coverPath).size<600000);
  assert.equal(fs.readFileSync(coverPath).subarray(8,12).toString(),'WEBP');
  assert.ok(html.includes(asset(p)));
  assert.ok(html.includes(`property="og:image" content="https://zhenguocool.com${shareAsset(p)}"`));
  assert.ok(html.includes(`name="twitter:image" content="https://zhenguocool.com${shareAsset(p)}"`));
  assert.ok(fs.statSync(path.join(root,shareAsset(p))).size<600000);
  for(const line of coverCopy[p.slug].headline) assert.ok(html.includes(`<span>${line}</span>`),'cover text remains HTML');
  assert.ok(html.includes('class="hybrid-vector"'),'deterministic SVG overlay');
  assert.ok(!html.includes('<canvas'),'no rendering runtime on production');
  assert.ok(html.includes('AI 生成'));
  assert.ok(!fs.existsSync(path.join(root,`en/insights/${p.slug}/index.html`)));
}
const sitemapLocs=read('sitemap.xml').match(/<loc>[^<]+<\/loc>/g);
assert.equal(new Set(sitemapLocs).size,sitemapLocs.length);
const prior=old('sitemap.xml').match(/<loc>[^<]+<\/loc>/g);
assert.equal(sitemapLocs.length,prior.length+posts.length+1);for(const loc of prior)assert.ok(sitemapLocs.includes(loc));
const ids=[...read('insights/index.html').matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'unique category anchor IDs');
assert.ok(read('insights/index.html').includes(`${String(posts.length).padStart(2,'0')} STORIES`));
for(const p of posts.filter(p=>p.published)) {
  const html=read(`insights/${p.slug}/index.html`);
  assert.ok(html.includes(`datetime="${p.published}"`));
  assert.ok(html.includes(`"datePublished":"${p.published}"`));
  assert.ok(html.includes('2026-09-06'),'fact check date is present');
  assert.ok(/https:\/\/(blog.youtube|about.fb.com|newsroom.tiktok.com)/.test(html),'official news source');
}
console.log(`Editorial blog: PASS (${posts.length+1} routes, ${posts.length} illustrated articles, frozen homepages/GA, dates, unique anchors)`);
