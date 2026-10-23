import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const app=await readFile(new URL('../src/app.js',import.meta.url),'utf8');
// Exercise the production handlers in isolation without contacting GA or a printer.
const eventCode=app.slice(app.indexOf('function event('),app.indexOf('const banner='));
const viewCode=app.slice(app.indexOf('function recordPatternView('),app.indexOf('let favorites='));
function harness(adult='yes',analytics='yes'){
 const sent=[];const ctx=vm.createContext({adultConsent:adult,consent:analytics,detailViewSent:false,window:{gtag:(...args)=>sent.push(args)},location:{origin:'https://squishy.iamdenny.com',pathname:'/ko/',search:'?q=private-search'},document:{querySelector:()=>({dataset:{patternView:'h-squishy0145'}})}});
 vm.runInContext(eventCode+viewCode,ctx);return {ctx,sent};
}
test('analytics requires adult and analytics consent, strips URL query, and deduplicates detail views',()=>{
 for(const [adult,analytics] of [['no','yes'],['yes','no'],[null,null]]){const {ctx,sent}=harness(adult,analytics);vm.runInContext('recordPatternView()',ctx);assert.equal(sent.length,0);}
 const {ctx,sent}=harness();vm.runInContext('recordPatternView();recordPatternView()',ctx);
 assert.equal(sent.length,1);assert.equal(sent[0][1],'pattern_view');assert.equal(sent[0][2].pattern_id,'h-squishy0145');assert.equal(sent[0][2].page_location,'https://squishy.iamdenny.com/ko/');
 ctx.consent='no';vm.runInContext("event('print_attempt')",ctx);assert.equal(sent.length,1);
});
test('original-file click is distinct from creator visit and uses no URL or filename parameter',()=>{
 const {ctx,sent}=harness();let handler;ctx.document.addEventListener=(_,fn)=>handler=fn;
 const start=app.indexOf("document.addEventListener('click',e=>{const original=");
 vm.runInContext(app.slice(start,app.indexOf('\nfunction updateSaves',start)),ctx);
 handler({target:{closest:selector=>selector==='[data-original-file]'?{dataset:{originalFile:'h-squishy0145',fileIndex:'2'}}:null}});
 assert.equal(sent.length,1);assert.equal(sent[0][1],'original_open');assert.equal(sent[0][2].file_index,2);assert.equal(sent[0][2].file_name,undefined);
});
test('print event describes an attempt and a failed image cannot trigger print',()=>{
 const {ctx,sent}=harness();let click,printed=0;ctx.window.print=()=>printed++;ctx.document.body={classList:{add(){},remove(){}}};
 const start=app.indexOf('function bindPrintButton(');vm.runInContext(app.slice(start,app.indexOf("\ndocument.querySelectorAll('[data-print-source]'",start)),ctx);
 ctx.button={addEventListener:(_,fn)=>click=fn};ctx.image={complete:true,naturalWidth:480,addEventListener(){}};
 vm.runInContext("bindPrintButton(button,image,'h-squishy0145','preview')",ctx);click();assert.equal(printed,1);assert.equal(sent[0][1],'print_attempt');assert.equal(sent[0][2].print_source,'preview');
 ctx.image.naturalWidth=0;click();assert.equal(printed,1);
});
