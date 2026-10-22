import {readFile}from'node:fs/promises';
const {domain}=JSON.parse(await readFile('site.json'));const base='https://'+domain;
let error;
for(let i=0;i<12;i++){
 try{const r=await fetch(base+'/release.json',{signal:AbortSignal.timeout(15000),cache:'no-store'});if(!r.ok)throw Error('Release HTTP '+r.status);const release=await r.json();if(process.env.EXPECTED_SHA&&release.sha!==process.env.EXPECTED_SHA)throw Error('Serving commit does not match');for(const p of ['/ko/','/en/','/ja/','/sitemap.xml','/freshness.json']){const res=await fetch(base+p,{signal:AbortSignal.timeout(15000)});if(!res.ok)throw Error(p+' HTTP '+res.status)}console.log(JSON.stringify({verified:true,base,...release}));error=null;break}catch(e){error=e;console.log('Readback pending: '+e.message);await new Promise(r=>setTimeout(r,10000))}
}
if(error)throw error;
