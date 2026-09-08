// Same signature/issuer/audience validation boundary as the staff Access verifier.
const decode=s=>{if(!/^[\w-]+$/.test(s))throw Error('jwt_encoding');return Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-s.length%4)%4)),x=>x.charCodeAt(0));};
export function claimsIdentity(c,env,now=Date.now()/1000){
 if(!env.POLICY_AUD||!env.TEAM_DOMAIN)throw Error('auth_config');
 if(c.iss!==env.TEAM_DOMAIN||!(Array.isArray(c.aud)?c.aud:[c.aud]).includes(env.POLICY_AUD))throw Error('auth_scope');
 if(!Number.isFinite(c.exp)||c.exp<=now||(c.nbf!==undefined&&(!Number.isFinite(c.nbf)||c.nbf>now)))throw Error('auth_expiry');
 const email=typeof c.email==='string'?c.email.trim().toLowerCase():'';
 if(email!==env.ADMIN_EMAIL)throw Error('admin_required');return email;
}
export async function adminIdentity(request,env,fetcher=fetch){
 const token=request.headers.get('Cf-Access-Jwt-Assertion');if(!token||token.length>16000)throw Error('jwt_required');
 const parts=token.split('.');if(parts.length!==3)throw Error('jwt_shape');
 const [h,p,s]=parts,header=JSON.parse(new TextDecoder().decode(decode(h))),claims=JSON.parse(new TextDecoder().decode(decode(p)));
 if(header.alg!=='RS256'||typeof header.kid!=='string')throw Error('jwt_algorithm');
 const email=claimsIdentity(claims,env);
 const response=await fetcher(env.TEAM_DOMAIN+'/cdn-cgi/access/certs',{signal:AbortSignal.timeout(6000)});if(!response.ok)throw Error('jwks_unavailable');
 const {keys}=await response.json(),key=keys?.find(k=>k.kid===header.kid&&k.kty==='RSA');if(!key)throw Error('jwt_key');
 const imported=await crypto.subtle.importKey('jwk',key,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
 if(!await crypto.subtle.verify('RSASSA-PKCS1-v1_5',imported,decode(s),new TextEncoder().encode(h+'.'+p)))throw Error('jwt_signature');return email;
}
