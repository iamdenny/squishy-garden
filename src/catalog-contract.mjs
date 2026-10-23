const CATEGORIES=new Set(['food','animals','nature','seasonal','play']);
const MAX_ITEMS=10000;

export function validateCatalog(value){
 if(!value||value.schemaVersion!==1||!Array.isArray(value.items)||value.items.length<1||value.items.length>MAX_ITEMS)throw new Error('Catalog envelope is invalid');
 if(typeof value.updatedAt!=='string'||Number.isNaN(Date.parse(value.updatedAt)))throw new Error('Catalog timestamp is invalid');
 if(value.health!==undefined){
  const h=value.health;
  if(!h||!['reachable','unverified'].includes(h.primaryStatus)||typeof h.lastAttempt!=='string'||Number.isNaN(Date.parse(h.lastAttempt))||!Array.isArray(h.discovery)||h.discovery.length>100||!Number.isInteger(h.pendingReview)||h.pendingReview<0)throw new Error('Catalog health is invalid');
  for(const source of h.discovery)if(!source||typeof source.sourceId!=='string'||source.sourceId.length>100||!['reachable','unverified'].includes(source.status)||typeof source.checkedAt!=='string'||Number.isNaN(Date.parse(source.checkedAt)))throw new Error('Source health is invalid');
 }
 const ids=new Set();
 for(const item of value.items){
  if(!item||typeof item.id!=='string'||!/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/.test(item.id)||ids.has(item.id))throw new Error('Catalog id is invalid');
  ids.add(item.id);
  if(!['original','external'].includes(item.kind)||!CATEGORIES.has(item.category))throw new Error(`Catalog category is invalid for ${item.id}`);
  if(typeof item.creator!=='string'||!item.creator.trim()||item.creator.length>200||!item.title||['ko','en','ja'].some(lang=>typeof item.title[lang]!=='string'||item.title[lang].length>300))throw new Error(`Catalog text is invalid for ${item.id}`);
  if(item.kind==='external'){
   const sources=Object.entries(item.urls||{});
   if(!sources.length||sources.some(([lang,source])=>!['ko','en','ja'].includes(lang)||!isHttpsUrl(source)))throw new Error(`Catalog source is invalid for ${item.id}`);
  }
  if(item.printable){
   const p=item.printable;
   if(p.paper!=='A4'||p.format!=='JPG'||!Object.values(item.urls||{}).includes(p.sourceUrl)||new URL(p.sourceUrl).hostname!=='hyeriming.com'||!Array.isArray(p.files)||!p.files.length||p.files.length>24||p.files.some(url=>!/^https:\/\/hyeriming\.com\/downloads\/squishy\/squishy[0-9]+\.jpg$/.test(url))||Number.isNaN(Date.parse(p.checkedAt)))throw new Error(`Invalid printable metadata for ${item.id}`);
  }
  if(item.thumbnail!==undefined&&item.thumbnail!==null&&!isHttpsUrl(item.thumbnail))throw new Error(`Catalog preview is invalid for ${item.id}`);
 }
 return value;
}

function isHttpsUrl(value){
 try{const url=new URL(value);return url.protocol==='https:'&&Boolean(url.hostname)&&!url.username&&!url.password}catch{return false}
}
