import {adminIdentity} from '../tool-feedback/access.mjs';
import {boundedJson} from '../tool-feedback/index.mjs';
import {validate,policyVersion,retentionDays,statuses,regions,fields} from '../../web-assets/recruitment/contract.mjs';
import {adminHtml} from './admin.mjs';
const publicOrigin='https://zhenguocool.com',staffOrigin='https://staff.zhenguocool.com';
const headers={'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','x-robots-tag':'noindex, nofollow'};
const json=(status,body)=>new Response(JSON.stringify(body),{status,headers});
const uuid=v=>typeof v==='string'&&/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(v);
const hmac=async(secret,text)=>{const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return [...new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(text)))].map(x=>x.toString(16).padStart(2,'0')).join('');};
const ready=env=>env.ENABLED==='true'&&env.APPROVED_POLICY_VERSION===policyVersion&&env.DB&&env.TURNSTILE_SECRET&&env.TURNSTILE_SITEKEY&&env.RATE_SALT?.length>=32&&Number(env.RETENTION_DAYS)===retentionDays;
async function allowance(db,key,limit,expiry){return !!await db.prepare('INSERT INTO creator_rate_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 WHERE count<? RETURNING count').bind(key,expiry,limit).first();}
export async function purgeExpired(env,now=new Date().toISOString()){
 if(!env.DB)throw Error('database_missing');
 const result=await env.DB.prepare('DELETE FROM creator_applications WHERE expires_at<=?').bind(now).run();
 await env.DB.prepare('DELETE FROM creator_rate_limits WHERE expires_at<=?').bind(Date.parse(now)).run();
 return result.meta.changes;
}
async function publicApi(request,env,url){
 if(!ready(env))return json(503,{ok:false,message:'表單暫時停止收件，請稍後再試或聯絡招募窗口。'});
 const now=Date.now();
 if(request.method==='GET'&&url.pathname==='/public/config'){
  const stamp=String(now);return json(200,{ok:true,enabled:true,sitekey:env.TURNSTILE_SITEKEY,policy_version:policyVersion,retention_days:Number(env.RETENTION_DAYS),started:stamp+'.'+await hmac(env.RATE_SALT,'start:'+stamp)});
 }
 if(request.method!=='POST'||url.pathname!=='/public/submit')return json(405,{ok:false});
 if(request.headers.get('origin')!==publicOrigin)return json(403,{ok:false,message:'請從官方招募頁送出。'});
 let body;try{body=await boundedJson(request);}catch{return json(400,{ok:false,message:'表單格式不正確或內容過長。'});}
 const result=validate(body);
 if(!uuid(body?.request_id)||body.website!==''||typeof body.turnstile_token!=='string'||body.turnstile_token.length>2048)result.errors.form='請確認表單內容並重新驗證。';
 if(Object.keys(result.errors).length)return json(422,{ok:false,errors:result.errors,message:'請修正標示的欄位。'});
 const [stamp,sig,...extra]=String(body.started||'').split('.');
 if(extra.length||!/^\d{13}$/.test(stamp)||sig!==await hmac(env.RATE_SALT,'start:'+stamp)||now-Number(stamp)<3000||now-Number(stamp)>7200000)return json(422,{ok:false,message:'表單尚未就緒或已逾時，請重新整理再填寫。'});
 const ip=request.headers.get('CF-Connecting-IP');if(!ip)return json(503,{ok:false,message:'無法驗證連線，請稍後再試。'});
 const hour=Math.floor(now/3600000),day=new Date(now).toISOString().slice(0,10),source=await hmac(env.RATE_SALT,day+'|'+ip);
 await env.DB.prepare('DELETE FROM creator_rate_limits WHERE expires_at<?').bind(now).run();
 if(!await allowance(env.DB,'attempt:'+hour+':'+source,20,now+86400000))return json(429,{ok:false,message:'嘗試次數較多，請稍後再試。'});
 const data=result.data,requestHash=await hmac(env.RATE_SALT,JSON.stringify({data,policyVersion,privacy:true,sharing:false}));
 const existing=await env.DB.prepare('SELECT id,request_hash,expires_at FROM creator_applications WHERE request_id=?').bind(body.request_id).first();
 if(existing&&existing.expires_at>new Date(now).toISOString())return existing.request_hash===requestHash?json(200,{ok:true,receipt:existing.id,replayed:true}):json(409,{ok:false,message:'此送出編號已使用；請重新整理後再試。'});
 let verification;try{
  const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({secret:env.TURNSTILE_SECRET,response:body.turnstile_token}),signal:AbortSignal.timeout(8000)});
  verification=r.ok?await r.json():null;
 }catch{return json(502,{ok:false,message:'安全驗證暫時無法使用，資料尚未送出。'});}
 if(!verification?.success||verification.hostname!=='zhenguocool.com'||verification.action!=='creator_recruitment')return json(403,{ok:false,message:'安全驗證失效，請重新驗證。'});
 if(!await allowance(env.DB,'submit:'+hour+':'+source,5,now+86400000)||!await allowance(env.DB,'total:'+day,1000,now+86400000))return json(429,{ok:false,message:'送出次數較多，請稍後再試。'});
 await purgeExpired(env);
 const emailKey=await hmac(env.RATE_SALT,'email:'+data.email),id=crypto.randomUUID(),date=new Date(now).toISOString(),expiry=new Date(now+Number(env.RETENTION_DAYS)*86400000).toISOString();
 await env.DB.prepare(`INSERT INTO creator_applications(id,request_id,request_hash,email_key,name,email,region,live_experience,payload_json,submitted_at,updated_at,source_page,policy_version,privacy_consent,partner_sharing_consent,consent_at,expires_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,1,0,?,?) ON CONFLICT DO NOTHING`).bind(id,body.request_id,requestHash,emailKey,data.name,data.email,data.region,data.live_experience,JSON.stringify(data),date,date,publicOrigin+'/tw-creator-recruitment/',policyVersion,date,expiry).run();
 const saved=await env.DB.prepare('SELECT id,request_hash FROM creator_applications WHERE request_id=?').bind(body.request_id).first();
 if(!saved||saved.request_hash!==requestHash)return json(409,{ok:false,message:'此申請可能已收件，請勿重複送出；需要更正請聯絡招募窗口。'});
 return json(201,{ok:true,receipt:saved.id});
}
function filters(url){
 const clauses=['expires_at>?'],args=[new Date().toISOString()];
 for(const [key,allowed] of [['status',statuses],['region',regions],['live_experience',['有','沒有']]]){
  const v=url.searchParams.get(key);if(v){if(!allowed.includes(v))throw Error();clauses.push(key+'=?');args.push(v);}
 }
 for(const key of ['from','to']){
  const value=url.searchParams.get(key);if(!value)continue;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value))throw Error();const parsed=Date.parse(value+'T00:00:00+08:00');if(!Number.isFinite(parsed)||new Date(parsed+28800000).toISOString().slice(0,10)!==value)throw Error();
  clauses.push('submitted_at'+(key==='from'?'>=':'<')+'?');args.push(new Date(parsed+(key==='to'?86400000:0)).toISOString());
 }
 if(url.searchParams.get('from')&&url.searchParams.get('to')&&url.searchParams.get('from')>url.searchParams.get('to'))throw Error();
 return {where:clauses.join(' AND '),args};
}
export const csvCell=v=>'"'+((/^[\s]*[=+@\-\t\r\n]/.test(String(v??''))?"'":'')+String(v??'')).replaceAll('"','""')+'"';
const safeRow=({request_hash,request_id,email_key,...row})=>({...row,payload:JSON.parse(row.payload_json),payload_json:undefined});
async function adminApi(request,env,url,actor){
 if(!env.DB)return json(503,{ok:false,message:'資料庫未設定。'});
 const base='/creator-recruitment/api/';
 if(request.method==='GET'&&[base+'applications',base+'export'].includes(url.pathname)){
  let f;try{f=filters(url);}catch{return json(422,{ok:false,message:'篩選條件不正確。'});}
  const exporting=url.pathname.endsWith('/export');if(exporting&&env.CSV_ENABLED!=='true')return json(403,{ok:false,message:'CSV 匯出尚未授權。'});
  const offset=Number(url.searchParams.get('offset')||0);if(!Number.isInteger(offset)||offset<0||offset>100000)return json(422,{ok:false});
  const {results}=await env.DB.prepare('SELECT * FROM creator_applications WHERE '+f.where+' ORDER BY submitted_at DESC,id DESC LIMIT ? OFFSET ?').bind(...f.args,exporting?1001:51,exporting?0:offset).all();
  if(exporting){
   if(results.length>1000)return json(422,{ok:false,message:'超過 1,000 筆，請縮小日期範圍後匯出。'});
   const columns=['申請編號','申請時間（UTC）','招募狀態',...fields.map(x=>x[1]),'隱私版本','同意時間（UTC）','跨境分享同意','到期時間（UTC）','內部備註'];
   const lines=results.map(r=>{const p=JSON.parse(r.payload_json);return [r.id,r.submitted_at,r.status,...fields.map(([k])=>Array.isArray(p[k])?p[k].join('；'):p[k]),r.policy_version,r.consent_at,'未同意／未開放',r.expires_at,r.internal_notes];});
   return new Response('\uFEFF'+[columns,...lines].map(row=>row.map(csvCell).join(',')).join('\r\n'),{headers:{...headers,'content-type':'text/csv; charset=utf-8','content-disposition':'attachment; filename="creator-applications.csv"'}});
  }
  return json(200,{items:results.slice(0,50).map(safeRow),next_offset:results.length>50?offset+50:null,export_enabled:env.CSV_ENABLED==='true'});
 }
 if(!['PATCH','DELETE','POST'].includes(request.method))return json(405,{ok:false});
 if(request.headers.get('origin')!==staffOrigin)return json(403,{ok:false,message:'管理來源不正確。'});
 if(url.pathname===base+'purge'&&request.method==='POST')return json(200,{ok:true,deleted:await purgeExpired(env)});
 const id=url.pathname.slice((base+'applications/').length);if(!url.pathname.startsWith(base+'applications/')||!uuid(id))return json(404,{ok:false});
 const row=await env.DB.prepare('SELECT * FROM creator_applications WHERE id=? AND expires_at>?').bind(id,new Date().toISOString()).first();if(!row)return json(404,{ok:false,message:'資料不存在或已到期。'});
 let body;try{body=await boundedJson(request);}catch{return json(422,{ok:false});}
 if(!Number.isInteger(body.revision)||body.revision!==row.revision)return json(409,{ok:false,message:'資料已變更，請重新載入後再操作。'});
 if(request.method==='DELETE'){
  if(body.confirm!==id)return json(422,{ok:false,message:'刪除確認編號不符。'});
  const r=await env.DB.prepare('DELETE FROM creator_applications WHERE id=? AND revision=?').bind(id,body.revision).run();return json(r.meta.changes?200:409,{ok:!!r.meta.changes});
 }
 if(request.method!=='PATCH'||!statuses.includes(body.status)||typeof body.internal_notes!=='string'||body.internal_notes.length>4000)return json(422,{ok:false,message:'狀態或備註格式不正確。'});
 const r=await env.DB.prepare('UPDATE creator_applications SET status=?,internal_notes=?,updated_at=?,updated_by=?,revision=revision+1 WHERE id=? AND revision=? RETURNING revision').bind(body.status,body.internal_notes,new Date().toISOString(),actor,id,body.revision).first();
 return json(r?200:409,{ok:!!r});
}
export default {
 async fetch(request,env){
  try{
   const url=new URL(request.url);
   if(url.hostname==='recruitment.internal'&&url.pathname.startsWith('/public/'))return await publicApi(request,env,url);
   if(url.origin!==staffOrigin||!/^\/creator-recruitment(?:\/|$)/.test(url.pathname))return json(404,{ok:false});
   let actor;try{actor=await adminIdentity(request,env);}catch{return json(403,{ok:false,message:'僅限授權管理者登入。'});}
   if(request.method==='GET'&&['/creator-recruitment','/creator-recruitment/'].includes(url.pathname))return new Response(adminHtml,{headers:{...headers,'content-type':'text/html; charset=utf-8','content-security-policy':"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",'referrer-policy':'no-referrer'}});
   return await adminApi(request,env,url,actor);
  }catch{return json(503,{ok:false,message:'服務暫時無法使用，請稍後再試。'});}
 },
 async scheduled(_event,env){await purgeExpired(env);}
};
