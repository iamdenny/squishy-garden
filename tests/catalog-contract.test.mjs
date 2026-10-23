import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateCatalog, catalogIsCurrent } from '../src/catalog-contract.mjs';

function sampleCatalog(){
 return {schemaVersion:1,updatedAt:'2026-10-23T00:00:00.000Z',items:[{id:'sample-pattern',kind:'external',category:'animals',creator:'Sample creator',title:{ko:'샘플 도안',en:'Sample pattern',ja:'サンプル型紙'},urls:{ko:'https://example.com/pattern'},thumbnail:'https://example.com/preview.jpg'}]};
}

test('catalog contract rejects duplicate ids and unsafe source or preview URLs',()=>{
 const duplicate=sampleCatalog();duplicate.items.push({...duplicate.items[0]});
 assert.throws(()=>validateCatalog(duplicate),/id is invalid/);
 const unsafeSource=sampleCatalog();unsafeSource.items[0].urls.ko='javascript:alert(1)';
 assert.throws(()=>validateCatalog(unsafeSource),/source is invalid/);
 const unsafePreview=sampleCatalog();unsafePreview.items[0].thumbnail='https://user@example.com/preview.jpg';
 assert.throws(()=>validateCatalog(unsafePreview),/preview is invalid/);
});

test('contract rejects incomplete translations and unknown categories',()=>{
 const untranslated=sampleCatalog();delete untranslated.items[0].title.ja;
 assert.throws(()=>validateCatalog(untranslated),/text is invalid/);
 const unknown=sampleCatalog();unknown.items[0].category='unknown';
 assert.throws(()=>validateCatalog(unknown),/category is invalid/);
});

test('current generated multilingual snapshot satisfies the browser contract',async()=>{
 const current=JSON.parse(await readFile(new URL('../public/catalog.json',import.meta.url),'utf8'));
 assert.equal(validateCatalog(current),current);
 assert(current.items.length>=100);
});

test('live health rejects malformed status and timestamps',()=>{
 const base={schemaVersion:1,updatedAt:'2026-10-23T00:00:00Z',items:[{id:'test',kind:'original',category:'food',creator:'Creator',title:{ko:'a',en:'a',ja:'a'}}]};
 const health={lastAttempt:base.updatedAt,primaryStatus:'reachable',pendingReview:0,discovery:[{sourceId:'test',status:'reachable',checkedAt:base.updatedAt}]};
 assert.doesNotThrow(()=>validateCatalog({...base,health}));
 assert.throws(()=>validateCatalog({...base,health:{...health,discovery:[{sourceId:'test',status:'reachable',checkedAt:'bad'}]}}));
 assert.throws(()=>validateCatalog({...base,health:{...health,pendingReview:-1}}));
});

test("a cached catalog cannot replace a newer deployed snapshot",()=>{
 const minimum="2026-10-24T00:00:00Z";
 assert.equal(catalogIsCurrent({updatedAt:"2026-10-23T00:00:00Z"},minimum),false);
 assert.equal(catalogIsCurrent({generatedAt:minimum},minimum),true);
 assert.equal(catalogIsCurrent({generatedAt:"2026-10-24T12:00:00Z"},minimum),true);
 assert.equal(catalogIsCurrent({generatedAt:"invalid"},minimum),false);
 assert.equal(catalogIsCurrent({revision:"same",generatedAt:"2026-10-23T00:00:00Z"},minimum,"same"),true);
 assert.equal(catalogIsCurrent({revision:"old",generatedAt:"2026-10-23T00:00:00Z"},minimum,"new"),false);
});
