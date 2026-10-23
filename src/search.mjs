import {hasPrintableOriginal} from './printable.mjs';
export function sourceUnavailable(item){return (item.health?.lastConfirmedStatus||item.health?.status)==='unavailable';}
export function normalize(value){return String(value).normalize('NFKC').toLocaleLowerCase().replace(/\bpatterns\b/g,'pattern').replace(/스퀴즈|스퀴쉬/g,'스퀴시').replace(/cinnamoroll|シナモロール/g,'시나모롤').replace(/kuromi|クロミ/g,'쿠로미').replace(/my\s*melody|マイメロディ/g,'마이멜로디').replace(/sanrio|サンリオ/g,'산리오').replace(/halloween|ハロウィン/g,'할로윈').replace(/pokémon|pokemon|ポケモン/g,'포켓몬').replace(/[\s\p{P}\p{S}]+/gu,'');}
// Exact price terms are constraints, never inferred from promotional titles.
const priceTerms=new Map([['무료','free'],['free','free'],['無料','free'],['유료','paid'],['paid','paid'],['有料','paid']]);
function queryPrice(term){return priceTerms.get(term.replace(/(?:도안|patterns?|型紙)$/u,''));}
export function selectItems(items,{q='',category='all',kind='all',difficulty='all',craftType='all',creator='all',access='all',printable='all',saved=false,sort='recommended',lang='ko'}={},favorites=[]){
 const tokens=String(q).trim().split(/\s+/).map(normalize).filter(Boolean);
 const prices=tokens.map(queryPrice).filter(Boolean);
 const terms=tokens.filter(term=>!queryPrice(term));
 return items.filter(i=>prices.every(price=>i.access===price)&&(printable!=='verified'||hasPrintableOriginal(i))&&(access==='all'||i.access===access)&&(category==='all'||i.category===category)&&(kind==='all'||i.kind===kind)&&(difficulty==='all'||i.difficulty===difficulty)&&(craftType==='all'||(i.craftType||'unknown')===craftType)&&(creator==='all'||i.creator===creator)&&(!saved||favorites.includes(i.id))&&terms.every(term=>normalize([...Object.values(i.title),i.creator,i.category,'스퀴시 도안 squishy pattern スクイーズ 型紙',...(i.tags||[])].join(' ')).includes(term))).sort((a,b)=>sort==='newest'?(b.firstSeenAt||b.checkedAt||'').localeCompare(a.firstSeenAt||a.checkedAt||''):sort==='name'?(a.title[lang]||a.title.ko).localeCompare(b.title[lang]||b.title.ko,lang):Number(sourceUnavailable(a))-Number(sourceUnavailable(b)));
}
