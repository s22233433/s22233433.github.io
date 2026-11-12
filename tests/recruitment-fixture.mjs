// Test/development ONLY. Imported by tests and loopback preview, never production code.
import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
import {createHmac} from 'node:crypto';
import {policyVersion} from '../web-assets/recruitment/contract.mjs';
export async function fixture(file=':memory:'){
 const sqlite=new DatabaseSync(file);sqlite.exec(fs.readFileSync(new URL('../workers/creator-recruitment/schema.sql',import.meta.url),'utf8'));
 const DB={prepare(sql){const make=values=>({bind(...v){return make(v);},async first(){return sqlite.prepare(sql).get(...values)||null;},async all(){return {results:sqlite.prepare(sql).all(...values)};},async run(){return {meta:{changes:sqlite.prepare(sql).run(...values).changes}};}});return make([]);}};
 const env={DB,ENABLED:'true',APPROVED_POLICY_VERSION:policyVersion,RETENTION_DAYS:'180',TURNSTILE_SECRET:'test-only',TURNSTILE_SITEKEY:'local-test-only',RATE_SALT:'test-only-recruitment-salt-never-production',TEAM_DOMAIN:'https://test.cloudflareaccess.com',POLICY_AUD:'test-only-audience',ADMIN_EMAIL:'owner@example.com',CSV_ENABLED:'true'};
 const originalFetch=globalThis.fetch;
 const pair=await crypto.subtle.generateKey({name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['sign','verify']);
 const jwk={...await crypto.subtle.exportKey('jwk',pair.publicKey),kid:'test-key'};
 globalThis.fetch=async(url,opts)=>{if(String(url).endsWith('/siteverify')){const token=JSON.parse(opts.body).response;return Response.json({success:token==='test-ok',hostname:'zhenguocool.com',action:'creator_recruitment'});}if(String(url)===env.TEAM_DOMAIN+'/cdn-cgi/access/certs')return Response.json({keys:[jwk]});throw Error('Unexpected external network in isolated test');};
 const b64=x=>Buffer.from(x).toString('base64url');
 async function jwt(extra={}){const h=b64(JSON.stringify({alg:'RS256',kid:jwk.kid})),p=b64(JSON.stringify({iss:env.TEAM_DOMAIN,aud:[env.POLICY_AUD],email:env.ADMIN_EMAIL,exp:Date.now()/1000+3600,...extra}));return h+'.'+p+'.'+b64(await crypto.subtle.sign('RSASSA-PKCS1-v1_5',pair.privateKey,new TextEncoder().encode(h+'.'+p)));}
 const start=(stamp=String(Date.now()-4000))=>stamp+'.'+createHmac('sha256',env.RATE_SALT).update('start:'+stamp).digest('hex');
 const sample=()=>({request_id:crypto.randomUUID(),name:'本機測試申請',age:'22',region:'臺北市',email:'test@example.com',platforms:['Instagram'],social_urls:['https://example.com/creator'],live_experience:'沒有',guild_history:'沒有',current_contract:'沒有',privacy_consent:true,partner_sharing_consent:false,policy_version:policyVersion,website:'',turnstile_token:'test-ok',started:start()});
 return {sqlite,env,jwt,start,sample,close(){sqlite.close();globalThis.fetch=originalFetch;}};
}
