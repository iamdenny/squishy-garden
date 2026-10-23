import test from 'node:test';import assert from 'node:assert/strict';import{readFile}from'node:fs/promises';import{selectItems}from'../src/search.mjs';import{originals,printable,panels,tabs,tabPoints}from'../src/originals.mjs';
const external=JSON.parse(await readFile(new URL('../src/catalog-external.json',import.meta.url)));const items=[...originals,...external];
test('cross-language search and intersecting filters',()=>{for(const q of ['딸기','strawberry','いちご'])assert(selectItems(items,{q}).some(i=>i.id==='strawberry'));assert.deepEqual(selectItems(items,{q:'딸기',category:'animals'}),[]);assert.deepEqual(selectItems(items,{saved:true},['milk']).map(i=>i.id),['milk']);assert.equal(selectItems(items,{kind:'original',difficulty:'easy'}).length,8);assert.equal(selectItems(items,{q:'no-match-121212'}).length,0)});
test('source provenance and all three titles',()=>{assert.equal(new Set(items.map(i=>i.id)).size,items.length);for(const i of external){for(const l of ['ko','en','ja']){assert(i.title[l]?.trim());assert(new URL(i.urls[l]).protocol==='https:')}assert.equal(i.rights,'source-only');assert.equal(i.difficulty,'unknown')}});
test('original print templates contain six cube faces, seven unique joining tabs and printable A4 margins',()=>{for(const i of originals){const svg=printable(i);assert.equal(panels.length,6);assert.equal(tabs.length,7);assert.equal(new Set(tabs.map(t=>t.match)).size,7);for(const t of tabs)for(const [x,y]of tabPoints(panels.find(p=>p.name===t.panel),t.edge)){assert(x>=10&&x<=200);assert(y>=30&&y<=245)}assert(svg.includes('width="210mm" height="297mm"'));assert(svg.includes('CC BY 4.0'))}});
test('character aliases and discovery dates support finding new patterns',async()=>{const extras=JSON.parse(await readFile(new URL('../src/catalog-extra.json',import.meta.url)));for(const q of ['시나모롤','Kuromi','クロミ','산리오 쿠로미'])assert(selectItems(extras,{q}).some(i=>i.id==='sanrio-diy'));assert.equal(selectItems([{id:'old',title:{ko:'old'},firstSeenAt:'2026-01-01',checkedAt:'2026-12-01'},{id:'new',title:{ko:'new'},firstSeenAt:'2026-02-01'}],{sort:'newest'})[0].id,'new');});
test('curated sources have unique URLs, translated titles and intersecting access/book filters',async()=>{const extras=JSON.parse(await readFile(new URL('../src/catalog-extra.json',import.meta.url)));assert.equal(new Set(extras.map(i=>i.urls.ko)).size,extras.length);for(const i of extras){assert.equal(i.rights,'source-only');for(const lang of ['ko','en','ja'])assert(i.title[lang]?.trim());assert(['free','paid','unknown'].includes(i.access))}const books=selectItems(extras,{craftType:'book',access:'free'});assert(books.length>=2);assert(books.every(i=>i.access==='free'&&i.craftType==='book'));assert(!books.some(i=>i.id==='sowony-sweet-game'));assert.equal(selectItems(extras,{access:'paid',craftType:'book'})[0].id,'sowony-sweet-game');});
test('common Korean spelling variants preserve specific character matches',async()=>{const extras=JSON.parse(await readFile(new URL('../src/catalog-extra.json',import.meta.url)));for(const q of ['메타몽 스퀴즈','메타몽 스퀴쉬'])assert(selectItems(extras,{q}).some(i=>i.id==='ryong-ditto-book'));});
test('default discovery puts confirmed missing sources last without losing saved or exact matches',()=>{
 const missing={id:'missing',title:{ko:'가 도안'},health:{status:'unverified',lastConfirmedStatus:'unavailable'}};
 const uncertain={id:'uncertain',title:{ko:'나 도안'},health:{status:'unverified'}};
 const recovered={id:'recovered',title:{ko:'다 도안'},health:{status:'reachable',lastConfirmedStatus:'reachable'}};
 const rows=[missing,uncertain,recovered];
 assert.deepEqual(selectItems(rows).map(i=>i.id),['uncertain','recovered','missing']);
 assert.deepEqual(selectItems(rows,{saved:true},['missing']).map(i=>i.id),['missing']);
 assert.deepEqual(selectItems(rows,{q:'가 도안'}).map(i=>i.id),['missing']);
 assert.deepEqual(selectItems(rows,{sort:'name'}).map(i=>i.id),['missing','uncertain','recovered']);
 assert.deepEqual(rows.map(i=>i.id),['missing','uncertain','recovered']);
});

test('cross-language character queries find original-language creator titles',()=>{
 const rows=[{id:'c',creator:'Creator',category:'play',title:{ko:'산리오 시나모롤 스퀴시북',en:'산리오 시나모롤 스퀴시북',ja:'산리오 시나모롤 스퀴시북'}}];
 for(const q of ['cinnamoroll','シナモロール','sanrio 시나모롤','스퀴즈 도안'])assert.equal(selectItems(rows,{q}).length,1);
 assert.equal(selectItems(rows,{q:'kuromi'}).length,0);
});
