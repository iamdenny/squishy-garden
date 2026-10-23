import test from 'node:test';
import assert from 'node:assert/strict';
import {printableFiles} from '../src/printable.mjs';
const source='https://hyeriming.com/ko/print/squishy0145/';
const original='https://hyeriming.com/downloads/squishy/squishy0145.jpg';
const item=()=>({urls:{ko:source},printable:{format:'JPG',paper:'A4',sourceUrl:source,checkedAt:'2026-10-23',files:[original]}});
test('verified originals are distinct from preview images',()=>{assert.deepEqual(printableFiles(item()),[original]);assert.deepEqual(printableFiles({thumbnail:original}),[])});
test('untrusted file URLs and unrelated source pages are rejected',()=>{for(const url of ['javascript:alert(1)','https://example.com/file.jpg','https://hyeriming.com/thumbs/squishy/squishy0145.webp']){const row=item();row.printable.files=[url];assert.deepEqual(printableFiles(row),[])}const row=item();row.printable.sourceUrl='https://hyeriming.com/ko/print/squishy9999/';assert.deepEqual(printableFiles(row),[])});
