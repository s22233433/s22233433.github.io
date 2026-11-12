// Public, non-personal production checks. Run: node tests/creator-recruitment-live.mjs
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
const base='https://zhenguocool.com';
const request=(url,args=[])=>{
 const output=execFileSync('curl',['--silent','--show-error','--max-time','25',...args,'--write-out','\n%{http_code}',url],{encoding:'utf8'});
 const split=output.lastIndexOf('\n');return {status:Number(output.slice(split+1)),body:output.slice(0,split)};
};
const page=request(base+'/tw-creator-recruitment/');assert.equal(page.status,200);
assert.match(page.body,/<meta name="robots" content="index,follow,max-image-preview:large">/);
assert.match(page.body,/<link rel="canonical" href="https:\/\/zhenguocool.com\/tw-creator-recruitment\/">/);
assert.doesNotMatch(page.body,/WJ STARS|無界星馳|wj-stars|studio-scenario|25,000|尚未公開招募|draft1/);
assert.match(page.body,/榛菓行銷有限公司/);assert.equal((page.body.match(/<h1>/g)||[]).length,1);
const graph=JSON.parse(page.body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
assert.ok(graph.find(x=>x['@type']==='BreadcrumbList'));assert.equal(graph.find(x=>x['@type']==='FAQPage').mainEntity.length,9);
for(const name of ['contract.mjs','form.mjs','recruitment.css','site-shell.css']){
 const asset=request(base+'/web-assets/recruitment/'+name);assert.equal(asset.status,200);assert.equal(asset.body,readFileSync('web-assets/recruitment/'+name,'utf8'),name+' live source parity');
}
for(const path of ['/','/careers/','/sitemap.xml']){const r=request(base+path);assert.equal(r.status,200);assert.ok(r.body.includes('/tw-creator-recruitment/'),path+' internal discovery');}
const config=request(base+'/api/creator-recruitment/config');assert.equal(config.status,200);const c=JSON.parse(config.body);assert.equal(c.enabled,true);assert.equal(c.policy_version,'tw-creator-2026-11-12-v1');assert.equal(c.retention_days,180);assert.ok(c.sitekey&&!c.sitekey.startsWith('1x'));
const invalid=request(base+'/api/creator-recruitment/submit',['-X','POST','-H','Origin: '+base,'-H','Content-Type: application/json','--data','{}']);assert.equal(invalid.status,422);assert.equal(JSON.parse(invalid.body).ok,false);
const crossOrigin=request(base+'/api/creator-recruitment/submit',['-X','POST','-H','Origin: https://example.com','-H','Content-Type: application/json','--data','{}']);assert.equal(crossOrigin.status,403);
assert.equal(request(base+'/api/creator-recruitment/applications').status,405);
for(const path of ['/api/contact','/api/careers'])assert.equal(request(base+path).status,405,path+' existing handler');
const admin=request('https://staff.zhenguocool.com/creator-recruitment/api/applications');assert.ok([302,303,401,403].includes(admin.status),'unauthenticated admin must not return data');
console.log(JSON.stringify({result:'PASS',url:base+'/tw-creator-recruitment/',indexable:true,partner_materials:false,live_assets:4,discovery_links:3,form_enabled:true,invalid_submission:invalid.status,cross_origin:crossOrigin.status,unauthenticated_admin:admin.status,positive_submission:'requires real browser verification'},null,2));
