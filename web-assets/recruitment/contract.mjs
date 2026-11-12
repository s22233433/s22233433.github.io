export const policyVersion = 'tw-creator-2026-11-12-v1';
export const retentionDays = 180;
export const statuses = ['新申請','待聯繫','已聯繫','面談中','合作評估中','已錄取','不適合','已撤回'];
export const regions = ['臺北市','新北市','桃園市','臺中市','臺南市','高雄市','基隆市','新竹市','嘉義市','新竹縣','苗栗縣','彰化縣','南投縣','雲林縣','嘉義縣','屏東縣','宜蘭縣','花蓮縣','臺東縣','澎湖縣','金門縣','連江縣','其他地區'];
export const fields = [
 ['name','稱呼／姓名','text',true,80],['age','年齡','number',true,18,120],['region','所在地區','select',true,regions],
 ['email','Email','email',true,254],['line_id','LINE ID','text',false,100],['wechat_id','微信 WeChat ID','text',false,100],['phone','聯絡電話','tel',false,32],
 ['live_experience','是否有直播經驗','select',true,['有','沒有']],
 ['platforms','目前經營的平台','multi',false,['抖音（中國大陸 Douyin）','TikTok（國際版）','Instagram','YouTube','Facebook','其他','尚未經營']],
 ['social_urls','社群帳號連結','urls',false],
 ['content_types','目前主要內容類型','multi',false,['唱歌／音樂','舞蹈','聊天／生活','美妝／穿搭','美食','遊戲','短影音','其他','尚未經營']],
 ['followers','粉絲數量區間','select',false,['尚未經營','未滿 1,000','1,000–9,999','1萬–4.9萬','5萬–9.9萬','10萬以上']],
 ['guild_history','是否曾加入直播公會','select',true,['有','沒有']],['current_contract','目前是否有公會或經紀合約','select',true,['有','沒有','不確定，需先確認']],
 ['live_types','想嘗試的直播類型','multi',false,['才藝','聊天互動','美妝／穿搭','美食／生活','遊戲','尚待討論']],
 ['days_per_week','每週可直播天數','number',false,0,7],['hours_per_day','每天可投入時數','number',false,0,16],
 ['start_timing','預計開始時間','select',false,['可立即開始','1 個月內','1–3 個月','尚待討論']],
 ['equipment','是否具備直播設備','select',false,['已有手機與穩定網路','已有完整直播設備','需要先了解設備需求']],
 ['interview','是否願意參與線上說明或面談','select',false,['願意','希望先取得文字說明','尚待討論']],
 ['notes','其他補充說明','textarea',false,2000]
];
export function validate(body) {
 const errors={}, data={};
 if(!body||typeof body!=='object'||Array.isArray(body))return {errors:{form:'請重新整理後再試。'},data};
 for(const [key,label,type,required,options,max] of fields){
  const value=body[key]??(type==='multi'||type==='urls'?[]:'');
  if(type==='multi'||type==='urls'){
   if(!Array.isArray(value)||value.some(x=>typeof x!=='string')||value.length>(type==='urls'?5:options.length)||new Set(value).size!==value.length){errors[key]=`${label}格式不正確。`;continue;}
   if(type==='multi'&&value.some(x=>!options.includes(x)))errors[key]=`請選擇有效的${label}。`;
   if(type==='urls'&&value.some(x=>{try{const u=new URL(x);return x.length>500||u.protocol!=='https:'||!!u.username||!!u.password;}catch{return true;}}))errors[key]='社群連結限有效 HTTPS 網址，最多 5 個。';
   if(value.includes('尚未經營')&&value.length>1)errors[key]='「尚未經營」不可與其他選項同選。';
   data[key]=value;continue;
  }
  if(type==='number'){
   if(value===''&&!required){data[key]=null;continue;}
   const n=typeof value==='number'?value:typeof value==='string'&&/^\d+$/.test(value)?Number(value):NaN;
   if(!Number.isInteger(n)||n<options||n>max)errors[key]=key==='age'?'本計畫限年滿 18 歲，請填寫有效年齡。':`${label}請填 ${options}–${max} 的整數。`;
   data[key]=n;continue;
  }
  if(typeof value!=='string'){errors[key]=`${label}格式不正確。`;continue;}
  const s=value.trim();if((required&&!s)||s.length>(type==='select'?150:options)||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(s))errors[key]=`請填寫有效的${label}，並確認字數。`;
  if(type==='select'&&s&&!options.includes(s))errors[key]=`請選擇有效的${label}。`;
  if(type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s))errors[key]='請填寫有效 Email。';
  if(type==='tel'&&s&&!/^[+\d() .-]{6,32}$/.test(s))errors[key]='請確認聯絡電話格式。';
  data[key]=type==='email'?s.toLowerCase():s;
 }
 if(body.privacy_consent!==true)errors.privacy_consent='請閱讀並同意招募資料使用說明。';
 if(body.partner_sharing_consent!==false)errors.partner_sharing_consent='跨境合作夥伴分享尚未開放。';
 if(body.policy_version!==policyVersion)errors.privacy_consent='資料使用說明已更新，請重新整理後閱讀。';
 const allowed=new Set([...fields.map(x=>x[0]),'privacy_consent','partner_sharing_consent','policy_version','request_id','website','turnstile_token','started']);
 if(Object.keys(body).some(k=>!allowed.has(k)))errors.form='表單含未支援欄位，請重新整理。';
 return {data,errors};
}
