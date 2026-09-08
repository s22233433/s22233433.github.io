export async function onRequest({request,env,params}){
 const path=Array.isArray(params.path)?params.path.join('/'):params.path;
 const allowed={config:'GET',messages:'GET',submit:'POST'};
 const headers={'content-type':'application/json','cache-control':'no-store','x-robots-tag':'noindex, nofollow'};
 if(!allowed[path]||request.method!==allowed[path])return new Response('{"ok":false}',{status:405,headers});
 if(!env.TOOL_FEEDBACK)return new Response('{"ok":false,"error":"feedback_unavailable"}',{status:503,headers});
 const target=new URL('https://feedback.internal/public/'+path),query=new URL(request.url).searchParams;
 if(path==='messages'){target.searchParams.set('tool',query.get('tool')||'');if(query.has('cursor'))target.searchParams.set('cursor',query.get('cursor'));}
 const forwarded=new Headers();for(const key of ['origin','content-type','content-length','CF-Connecting-IP'])if(request.headers.has(key))forwarded.set(key,request.headers.get(key));
 return env.TOOL_FEEDBACK.fetch(new Request(target,{method:request.method,headers:forwarded,body:request.method==='POST'?request.body:undefined}));
}
