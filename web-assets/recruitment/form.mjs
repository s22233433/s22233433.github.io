import {fields,validate,policyVersion} from './contract.mjs';
const $=s=>document.querySelector(s),form=$('#creator-form'),button=form.querySelector('[type=submit]'),status=$('#form-status');
const menu=$('#recruit-menu');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));$('#recruit-nav').classList.toggle('open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.setAttribute('aria-expanded','false');$('#recruit-nav').classList.remove('open');}});
let config,widget,token='',busy=false,submitted=false,requestId=crypto.randomUUID(),startedTracking=false,lastFailure='';
const track=(name)=>{if(typeof window.zgTrack==='function')void window.zgTrack(name,{form_id:'tw_creator_recruitment'});};
form.addEventListener('input',()=>{if(!startedTracking){startedTracking=true;track('recruitment_form_start');}});
$('#add-social').onclick=()=>{const count=form.querySelectorAll('[name=social_urls]').length;if(count>=5)return;const label=document.createElement('label');label.className='url-row';label.textContent='社群連結 '+(count+1);const input=document.createElement('input');input.type='url';input.name='social_urls';input.maxLength=500;input.placeholder='https://';input.setAttribute('aria-describedby','social_urls-error');label.append(input);$('#social-links').append(label);input.focus();if(count===4)$('#add-social').disabled=true;};
function showErrors(errors){form.querySelectorAll('[aria-invalid]').forEach(x=>x.removeAttribute('aria-invalid'));form.querySelectorAll('.field-error').forEach(x=>x.textContent='');const box=$('#form-errors');box.replaceChildren();box.hidden=!Object.keys(errors).length;for(const [key,msg] of Object.entries(errors)){const field=form.elements.namedItem(key),help=document.getElementById(key+'-error');if(help)help.textContent=msg;if(field instanceof HTMLElement)field.setAttribute('aria-invalid','true');const link=document.createElement('a');link.textContent=msg;link.href='#'+(document.getElementById(key)?key:'application');box.append(link);}if(!box.hidden)box.focus();}
function values(){const f=new FormData(form),body={};for(const [k,,type] of fields)body[k]=(type==='multi'||type==='urls')?f.getAll(k).filter(Boolean):f.get(k)||'';return {...body,request_id:requestId,website:f.get('website')||'',policy_version:policyVersion,privacy_consent:f.has('privacy_consent'),partner_sharing_consent:false,turnstile_token:token,started:config?.started};}
form.addEventListener('submit',async e=>{
 e.preventDefault();if(busy||submitted)return;const body=values(),errors=validate(body).errors;showErrors(errors);if(Object.keys(errors).length)return;
 if(!config?.enabled||!token){status.textContent='請先完成安全驗證；若未載入，請稍後重新整理。';return;}
 busy=true;lastFailure='';button.disabled=true;status.textContent='正在安全送出，請勿關閉頁面…';
 try{const r=await fetch('/api/creator-recruitment/submit',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(20000)});const result=await r.json();if(!r.ok||result.ok!==true||typeof result.receipt!=='string'){if(result.errors)showErrors(result.errors);throw Error(result.message||'送出未完成，請稍後再試。');}
  submitted=true;form.reset();form.querySelectorAll('input,select,textarea,button').forEach(x=>x.disabled=true);status.textContent='已確認伺服器收件。';$('#form-success').hidden=false;$('#receipt').textContent='申請編號：'+result.receipt;$('#form-success').focus();track('recruitment_submit_success');
 }catch(error){lastFailure=error.name==='TimeoutError'?'連線逾時，尚未確認收件。可用同一份資料重試；請勿重複填寫新申請。':['TypeError','SyntaxError'].includes(error.name)?'送出暫時失敗，尚未確認收件；請稍後再試。':error.message;status.textContent=lastFailure;track('recruitment_submit_error');token='';if(widget!==undefined)window.turnstile?.reset(widget);
 }finally{busy=false;if(!submitted)button.disabled=!token;}
});
async function init(){try{
 const r=await fetch('/api/creator-recruitment/config',{cache:'no-store'});config=await r.json();if(!r.ok||!config.enabled)throw Error(config.message||'表單尚未開放。');if(config.policy_version!==policyVersion)throw Error('資料使用說明版本已更新，請重新整理。');
 window.onRecruitTurnstile=()=>{widget=window.turnstile.render('#recruit-turnstile',{sitekey:config.sitekey,action:'creator_recruitment',language:'zh-tw',callback:t=>{token=t;button.disabled=busy||submitted;status.textContent=lastFailure||'安全驗證完成，請確認資料後送出。';},'expired-callback':()=>{token='';button.disabled=true;status.textContent='安全驗證已逾時，請重新驗證。';},'error-callback':()=>{token='';button.disabled=true;status.textContent='安全驗證暫時無法使用，請稍後再試。';}});};
 status.textContent='請完成安全驗證。';if(window.turnstile){window.onRecruitTurnstile();return;}
 const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onRecruitTurnstile&render=explicit';script.async=true;script.onerror=()=>status.textContent='安全驗證未能載入，請檢查連線後重試。';document.head.append(script);
 }catch(e){status.textContent=e.message;button.disabled=true;}}
init();
