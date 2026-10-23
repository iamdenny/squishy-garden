const CATEGORIES=new Set(['food','animals','nature','seasonal','play']);
const MAX_ITEMS=10000;

export function validateCatalog(value){
 if(!value||value.schemaVersion!==1||!Array.isArray(value.items)||value.items.length<1||value.items.length>MAX_ITEMS)throw new Error('Catalog envelope is invalid');
 if(typeof value.updatedAt!=='string'||Number.isNaN(Date.parse(value.updatedAt)))throw new Error('Catalog timestamp is invalid');
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
  if(item.thumbnail!==undefined&&item.thumbnail!==null&&!isHttpsUrl(item.thumbnail))throw new Error(`Catalog preview is invalid for ${item.id}`);
 }
 return value;
}

function isHttpsUrl(value){
 try{const url=new URL(value);return url.protocol==='https:'&&Boolean(url.hostname)&&!url.username&&!url.password}catch{return false}
}
