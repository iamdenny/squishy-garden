import test from 'node:test';
import assert from 'node:assert/strict';
import {printableFiles} from '../src/printable.mjs';
const source='https://hyeriming.com/ko/print/squishy0145/';
const original='https://hyeriming.com/downloads/squishy/squishy0145.jpg';
const item=()=>({urls:{ko:source},printable:{format:'JPG',paper:'A4',sourceUrl:source,checkedAt:'2026-10-23',files:[original]}});
test('verified originals are distinct from preview images',()=>{assert.deepEqual(printableFiles(item()),[original]);assert.deepEqual(printableFiles({thumbnail:original}),[])});
test('untrusted file URLs and unrelated source pages are rejected',()=>{for(const url of ['javascript:alert(1)','https://example.com/file.jpg','https://hyeriming.com/thumbs/squishy/squishy0145.webp']){const row=item();row.printable.files=[url];assert.deepEqual(printableFiles(row),[])}const row=item();row.printable.sourceUrl='https://hyeriming.com/ko/print/squishy9999/';assert.deepEqual(printableFiles(row),[])});

test('printable filter intersects other filters and excludes preview-only or missing originals',async()=>{
 const {selectItems}=await import('../src/search.mjs');
 const {hasPrintableOriginal}=await import('../src/printable.mjs');
 const rows=JSON.parse(await (await import('node:fs/promises')).readFile(new URL('../public/catalog.json',import.meta.url))).items;
 const selected=selectItems(rows,{printable:'verified'});
 assert(selected.length>8);assert(selected.every(hasPrintableOriginal));
 assert.equal(selectItems(rows,{printable:'verified',kind:'original'}).length,8);
 assert(selectItems(rows,{printable:'verified',kind:'external'}).every(i=>i.printable.files.length));
 assert.deepEqual(selectItems(rows,{printable:'verified',access:'paid'}),[]);
 const original=selected.find(i=>i.kind==='external');
 assert.equal(hasPrintableOriginal({...original,health:{status:'unverified',lastConfirmedStatus:'unavailable'}}),false);
 assert.equal(hasPrintableOriginal({...original,printable:undefined}),false);
 assert.equal(selectItems(rows,{printable:'verified',saved:true},[original.id]).length,1);
});
