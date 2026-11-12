export async function onRequest({request,env,params}) {
 const path=Array.isArray(params.path)?params.path.join('/'):params.path;
 const headers={'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-robots-tag':'noindex, nofollow'};
 if(!({config:'GET',submit:'POST'}[path]===request.method))return new Response('{"ok":false}',{status:405,headers});
 if(!env.CREATOR_RECRUITMENT)return new Response('{"ok":false,"message":"招募表單尚未開放。"}',{status:503,headers});
 const forwarded=new Headers();for(const key of ['origin','content-type','content-length','CF-Connecting-IP'])if(request.headers.has(key))forwarded.set(key,request.headers.get(key));
 return env.CREATOR_RECRUITMENT.fetch(new Request('https://recruitment.internal/public/'+path,{method:request.method,headers:forwarded,body:request.method==='POST'?request.body:undefined,duplex:'half'}));
}
