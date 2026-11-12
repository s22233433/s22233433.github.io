// Local QA only. Real temporary SQLite, simulated external Turnstile/Access, no production credentials.
import http from 'node:http';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import worker from '../workers/creator-recruitment/index.mjs';import {fixture} from '../tests/recruitment-fixture.mjs';
import {onRequest as gateway} from '../functions/api/creator-recruitment/[[path]].js';
const root=path.resolve(import.meta.dirname,'..'),dir=fs.mkdtempSync(path.join(os.tmpdir(),'zg-recruit-qa-')),f=await fixture(path.join(dir,'applications.sqlite'));
const port=Number(process.env.PORT||9878),origin='http://127.0.0.1:'+port;
const server=http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,origin);if(!['GET','HEAD'].includes(req.method)&&req.headers.origin!==origin){res.writeHead(403);return res.end('Local origin required');}
 let body; if(!['GET','HEAD'].includes(req.method)){const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>20000){res.writeHead(413);return res.end();}chunks.push(chunk);}body=Buffer.concat(chunks);}
 let response;
 if(url.pathname.startsWith('/api/creator-recruitment/')){
  const request=new Request('https://zhenguocool.com'+url.pathname,{method:req.method,headers:{'content-type':'application/json',origin:'https://zhenguocool.com','CF-Connecting-IP':'127.0.0.1'},body});
  response=await gateway({request,params:{path:url.pathname.split('/').slice(3)},env:{CREATOR_RECRUITMENT:{fetch:r=>worker.fetch(r,f.env)}}});
 }else if(url.pathname.startsWith('/creator-recruitment')){
  const request=new Request('https://staff.zhenguocool.com'+url.pathname+url.search,{method:req.method,headers:{'content-type':'application/json',origin:'https://staff.zhenguocool.com','Cf-Access-Jwt-Assertion':await f.jwt()},body});response=await worker.fetch(request,f.env);
 }else if(url.pathname==='/dev-turnstile.js'){
  response=new Response("window.turnstile={render(s,o){document.querySelector(s).textContent='本機安全驗證替身（不代表正式驗證）';window.localTestCaptcha=o;queueMicrotask(()=>o.callback('test-ok'));return 1;},reset(){queueMicrotask(()=>window.localTestCaptcha.callback('test-ok'));}};",{headers:{'content-type':'text/javascript'}});
 }else{
  const pathname=url.pathname==='/tw-creator-recruitment'?'/tw-creator-recruitment/':url.pathname;
  if(!(pathname==='/tw-creator-recruitment/'||pathname==='/web-assets/analytics.js'||pathname.startsWith('/web-assets/recruitment/')||pathname.startsWith('/web-assets/icons/'))||pathname.includes('..')){res.writeHead(404);return res.end('Local preview route only');}
  const file=path.join(root,pathname)+(pathname.endsWith('/')?'index.html':'');if(!fs.existsSync(file)){res.writeHead(404);return res.end();}
  let content=fs.readFileSync(file);const ext=path.extname(file);if(ext==='.html')content=Buffer.from(content.toString().replace('<head>','<head><script src="/dev-turnstile.js"></script>').replace(/<script src="\/web-assets\/analytics-config\.js[^"]*" defer><\/script>/g,''));
  response=new Response(content,{headers:{'content-type':({'.html':'text/html; charset=utf-8','.css':'text/css','.mjs':'text/javascript','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg'})[ext]||'application/octet-stream','cache-control':'no-store'}});
 }
 res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch{res.writeHead(500);res.end('Local preview failed');}});
server.listen(port,'127.0.0.1',()=>console.log(JSON.stringify({url:origin+'/tw-creator-recruitment/',admin:origin+'/creator-recruitment/',sqlite:path.join(dir,'applications.sqlite'),warning:'LOCAL TEST ONLY. Synthetic input; never production data.'})));
process.on('SIGINT',()=>server.close(()=>{f.close();process.exit(0);}));
