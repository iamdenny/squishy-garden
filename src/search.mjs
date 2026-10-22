export function normalize(value){return String(value).normalize('NFKC').toLocaleLowerCase().replace(/[\s\p{P}\p{S}]+/gu,'');}
export function selectItems(items,{q='',category='all',kind='all',difficulty='all',craftType='all',creator='all',saved=false,sort='recommended',lang='ko'}={},favorites=[]){
 const terms=String(q).trim().split(/\s+/).map(normalize).filter(Boolean);
 return items.filter(i=>(category==='all'||i.category===category)&&(kind==='all'||i.kind===kind)&&(difficulty==='all'||i.difficulty===difficulty)&&(craftType==='all'||(i.craftType||'unknown')===craftType)&&(creator==='all'||i.creator===creator)&&(!saved||favorites.includes(i.id))&&terms.every(term=>normalize([...Object.values(i.title),i.creator,i.category].join(' ')).includes(term))).sort((a,b)=>sort==='name'?(a.title[lang]||a.title.ko).localeCompare(b.title[lang]||b.title.ko,lang):0);
}
