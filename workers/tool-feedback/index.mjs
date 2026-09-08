import {adminIdentity} from './access.mjs';
import {adminHtml} from './admin.mjs';
const tools=new Set(['quotation','email-signature','qr-code','script-counter','social-image','daily-draw']);
const moderation=new Set(['pending','approved','rejected','hidden']),states=new Set(['received','reviewing','completed']);
const json=(status,body)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','x-robots-tag':'noindex, nofollow'}});
const uuid=s=>typeof s==='string'&&/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(s);
const text=(v,max,required=false)=>{if(typeof v!=='string'||v.length>max||(required&&!v.trim()))throw Error('invalid_fields');return v.trim();};
export async function boundedJson(request){
 if(!request.headers.get('content-type')?.startsWith('application/json'))throw Error('content_type');
 if(Number(request.headers.get('content-length'))>16384)throw Error('payload_large');
 const reader=request.body?.getReader();if(!reader)throw Error('invalid_json');let total=0;const chunks=[];
 for(;;){const {done,value}=await reader.read();if(done)break;total+=value.length;if(total>16384){await reader.cancel();throw Error('payload_large');}chunks.push(value);}
 const bytes=new Uint8Array(total);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}return JSON.parse(new TextDecoder().decode(bytes));
}
export function submission(body){
 if(!body||typeof body!=='object'||Array.isArray(body))throw Error('invalid_fields');
 if(!tools.has(body.tool_id)||body.version!=='1.0.0'||body.locale!=='zh-TW'||!['suggestion','bug','question'].includes(body.type)||!uuid(body.request_id))throw Error('invalid_fields');
 const email=text(body.email??'',254);if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw Error('invalid_email');
 if(typeof body.public_opt_in!=='boolean'||text(body.website??'',200))throw Error('invalid_fields');
 return {tool_id:body.tool_id,version:body.version,locale:body.locale,type:body.type,nickname:text(body.nickname??'',40)||'訪客',title:text(body.title,100,true),body:text(body.body,2000,true),email,public_opt_in:body.public_opt_in?1:0,request_id:body.request_id};
}
const signature=async(secret,data)=>{const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return [...new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(data)))].map(x=>x.toString(16).padStart(2,'0')).join('');};
async function allowance(db,key,limit,expiry){const r=await db.prepare('INSERT INTO rate_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 WHERE count<? RETURNING count').bind(key,expiry,limit).first();return !!r;}
export function publicRecord(row){return {id:row.id,tool_id:row.tool_id,version:row.version,nickname:row.public_nickname||'訪客',title:row.public_title,body:row.public_body,state:row.state,reply:row.public_reply,created_at:row.created_at};}
export function moderationInput(body,row){
 if(!body||!moderation.has(body.moderation)||!states.has(body.state)||!Number.isInteger(body.revision))throw Error('invalid_fields');
 const result={moderation:body.moderation,state:body.state,revision:body.revision,public_title:text(body.public_title??'',100),public_body:text(body.public_body??'',2000),public_nickname:text(body.public_nickname??'',40),public_reply:text(body.public_reply??'',2000)};
 if(result.moderation==='approved'&&(!row.public_opt_in||!result.public_title||!result.public_body))throw Error('public_consent_required');return result;
}
async function publicApi(request,env,url){
 if(!env.DB||env.ENABLED!=='true')return json(503,{ok:false,error:'feedback_unavailable'});
 if(url.pathname==='/public/config'&&request.method==='GET')return json(200,{enabled:!!env.TURNSTILE_SECRET,sitekey:env.TURNSTILE_SITEKEY});
 if(url.pathname==='/public/messages'&&request.method==='GET'){
  const tool=url.searchParams.get('tool');if(!tools.has(tool))return json(400,{ok:false,error:'invalid_tool'});
  let before=['9999','zzzz'];try{if(url.searchParams.has('cursor')){const c=url.searchParams.get('cursor');if(c.length>250)throw Error();before=JSON.parse(atob(c));if(!Array.isArray(before)||before.length!==2||!/^[0-9T:.Z-]{20,30}$/.test(before[0])||!uuid(before[1]))throw Error();}}catch{return json(400,{ok:false,error:'invalid_cursor'});}
  const {results}=await env.DB.prepare("SELECT id,tool_id,version,public_nickname,public_title,public_body,public_reply,state,created_at FROM feedback WHERE tool_id=? AND moderation='approved' AND public_opt_in=1 AND (created_at<? OR (created_at=? AND id<?)) ORDER BY created_at DESC,id DESC LIMIT 21").bind(tool,before[0],before[0],before[1]).all();
  const rows=results.slice(0,20),last=rows.at(-1);return json(200,{items:rows.map(publicRecord),cursor:results.length>20?btoa(JSON.stringify([last.created_at,last.id])):null});
 }
 if(url.pathname!=='/public/submit'||request.method!=='POST')return json(404,{ok:false,error:'not_found'});
 if(!env.TURNSTILE_SECRET||!env.RATE_SALT)return json(503,{ok:false,error:'feedback_unavailable'});
 if(request.headers.get('origin')!=='https://zhenguocool.com')return json(403,{ok:false,error:'origin_rejected'});
 let data,input;try{data=await boundedJson(request);input=submission(data);}catch(e){return json(e.message==='payload_large'?413:422,{ok:false,error:'invalid_fields'});}
 const hash=await signature(env.RATE_SALT,JSON.stringify(input));
 const existing=await env.DB.prepare('SELECT id,request_hash FROM feedback WHERE request_id=?').bind(input.request_id).first();if(existing)return existing.request_hash===hash?json(200,{ok:true,id:existing.id}):json(409,{ok:false,error:'request_conflict'});
 const now=Date.now(),day=new Date(now).toISOString().slice(0,10),ip=request.headers.get('CF-Connecting-IP')||'unknown';
 const source=await signature(env.RATE_SALT,day+'|'+ip),hour=Math.floor(now/3600000);
 await env.DB.prepare('DELETE FROM rate_limits WHERE expires_at<?').bind(now).run();
 if(!await allowance(env.DB,'attempt:'+hour+':'+source,30,now+86400000))return json(429,{ok:false,error:'rate_limited'});
 let verified;try{const token=text(data.turnstile_token,2048,true);const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({secret:env.TURNSTILE_SECRET,response:token}),signal:AbortSignal.timeout(8000)});verified=r.ok?await r.json():null;}catch{return json(502,{ok:false,error:'verification_unavailable'});}
 if(!verified?.success||verified.hostname!=='zhenguocool.com'||verified.action!=='tool_feedback')return json(403,{ok:false,error:'verification_failed'});
 if(!await allowance(env.DB,'hour:'+hour+':'+source,5,now+86400000)||!await allowance(env.DB,'day:'+day,1000,now+86400000))return json(429,{ok:false,error:'rate_limited'});
 const id=crypto.randomUUID(),date=new Date(now).toISOString();
 await env.DB.prepare('INSERT INTO feedback(id,request_id,request_hash,tool_id,version,locale,type,nickname,title,body,email,public_opt_in,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(request_id) DO NOTHING').bind(id,input.request_id,hash,input.tool_id,input.version,input.locale,input.type,input.nickname,input.title,input.body,input.email,input.public_opt_in,date,date).run();
 const saved=await env.DB.prepare('SELECT id,request_hash FROM feedback WHERE request_id=?').bind(input.request_id).first();if(!saved||saved.request_hash!==hash)return json(409,{ok:false,error:'request_conflict'});
 return json(201,{ok:true,id:saved.id});
}
async function adminApi(request,env,url,actor){
 if(request.method==='GET'&&url.pathname==='/tool-feedback/api/messages'){
  const filter=url.searchParams.get('moderation')||'pending';if(!moderation.has(filter))return json(400,{ok:false,error:'invalid_filter'});
  let before=['9999','zzzz'];try{if(url.searchParams.has('before')){const c=url.searchParams.get('before');if(c.length>250)throw Error();before=JSON.parse(atob(c));if(!Array.isArray(before)||before.length!==2||!/^[0-9T:.Z-]{20,30}$/.test(before[0])||!uuid(before[1]))throw Error();}}catch{return json(400,{ok:false,error:'invalid_cursor'});}
  const {results}=await env.DB.prepare('SELECT * FROM feedback WHERE moderation=? AND (created_at<? OR (created_at=? AND id<?)) ORDER BY created_at DESC,id DESC LIMIT 31').bind(filter,before[0],before[0],before[1]).all();
  const rows=results.slice(0,30),last=rows.at(-1);return json(200,{items:rows.map(({request_hash,request_id,...row})=>row),actor,cursor:results.length>30?btoa(JSON.stringify([last.created_at,last.id])):null});
 }
 const id=url.pathname.split('/').at(-1);if(request.method!=='PATCH'||!url.pathname.startsWith('/tool-feedback/api/messages/')||!uuid(id))return json(404,{ok:false,error:'not_found'});
 if(request.headers.get('origin')!=='https://staff.zhenguocool.com')return json(403,{ok:false,error:'origin_rejected'});
 const row=await env.DB.prepare('SELECT * FROM feedback WHERE id=?').bind(id).first();if(!row)return json(404,{ok:false,error:'not_found'});
 let data;try{data=moderationInput(await boundedJson(request),row);}catch(e){return json(422,{ok:false,error:e.message==='public_consent_required'?e.message:'invalid_fields'});}
 if(data.revision!==row.revision)return json(409,{ok:false,error:'revision_conflict'});
 const now=new Date().toISOString();
 // The SQLite trigger writes before/after public values in the same transaction.
 const result=await env.DB.prepare('UPDATE feedback SET moderation=?,state=?,public_title=?,public_body=?,public_nickname=?,public_reply=?,updated_at=?,updated_by=?,revision=revision+1 WHERE id=? AND revision=? RETURNING revision').bind(data.moderation,data.state,data.public_title,data.public_body,data.public_nickname,data.public_reply,now,actor,id,row.revision).first();
 if(result?.revision!==row.revision+1)return json(409,{ok:false,error:'revision_conflict'});return json(200,{ok:true});
}
export default {async fetch(request,env){
 const url=new URL(request.url);
 try{
  // Public RPC paths are reachable only over a service binding, never via the staff route.
  if(url.hostname==='feedback.internal'&&url.pathname.startsWith('/public/'))return await publicApi(request,env,url);
  if(url.hostname!=='staff.zhenguocool.com'||!url.pathname.startsWith('/tool-feedback'))return json(404,{ok:false,error:'not_found'});
  let actor;try{actor=await adminIdentity(request,env);}catch{return json(403,{ok:false,error:'admin_access_required'});}
  if(url.pathname==='/tool-feedback'||url.pathname==='/tool-feedback/')return new Response(adminHtml,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-robots-tag':'noindex, nofollow','content-security-policy':"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"}});
  return await adminApi(request,env,url,actor);
 }catch{console.error(JSON.stringify({event:'tool_feedback_failure'}));return json(503,{ok:false,error:'temporarily_unavailable'});}
}};
