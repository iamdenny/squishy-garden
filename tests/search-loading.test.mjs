import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {selectItems} from '../src/search.mjs';
const app=await readFile(new URL('../src/app.js',import.meta.url),'utf8');
const searchUI=app.slice(app.indexOf("const data=document.querySelector('#catalog-data');"),app.indexOf("const apiPattern=document.querySelector('#api-pattern');"));
function setup(){
 const nodes=new Map();
 const node=key=>{if(!nodes.has(key))nodes.set(key,{textContent:'',value:'all',hidden:false,dataset:{},attributes:{},setAttribute(k,v){this.attributes[k]=v},addEventListener(){},replaceChildren(...children){this.children=children},append(child){(this.children??=[]).push(child)},focus(){}});return nodes.get(key)};
 node('catalog-data').textContent=JSON.stringify([{id:'first',title:{ko:'딸기'},creator:'A'}]);
 const events=[];let resolve,reject;
 const promise=new Promise((a,b)=>{resolve=a;reject=b});
 const context={document:{querySelector:s=>node(s.replace(/^[#.]/,'')),getElementById:node,createElement:()=>({}),querySelectorAll:()=>[],createDocumentFragment:()=>({append(){}})},config:{lang:'ko'},t:{count:'개',cats:{food:'음식'},anyCreator:'전체'},selectItems,favorites:[],rerender(){},updateSaves(){},event:(...args)=>events.push(args),fetchLatestCatalog:()=>promise,makeCard:item=>({dataset:{id:item.id}}),updateFreshness(){},location:{search:'?q='+encodeURIComponent('쿠로미도안'),pathname:'/ko/',hash:''},history:{replaceState(){}},window:{addEventListener(){}},URLSearchParams,Option:class{constructor(text,value){this.text=text;this.value=value}},setTimeout,clearTimeout};
 vm.runInNewContext(searchUI,context);
 return {node,resolve,reject,events,settle:()=>new Promise(r=>setImmediate(r))};
}
test('pending full catalog does not show false zero results or emit incomplete search analytics',async()=>{
 const ui=setup();
 assert.equal(ui.node('empty').hidden,true);
 assert.equal(ui.node('cards').attributes['aria-busy'],'true');
 assert.match(ui.node('result-count').textContent,/불러오는 중/);
 ui.node('search-form').onsubmit({preventDefault(){}});
 assert.equal(ui.events.length,0);
 ui.resolve({items:[{id:'kuromi',title:{ko:'쿠로미'},creator:'B'}]});await ui.settle();
 assert.equal(ui.node('cards').attributes['aria-busy'],'false');
 assert.equal(ui.node('result-count').textContent,'1 개');
 ui.node('search-form').onsubmit({preventDefault(){}});
 assert.equal(ui.events[0][1].results_count,1);
});
test('failed full catalog is clearly partial and does not claim no matching pattern exists',async()=>{
 const ui=setup();ui.reject(new Error('offline'));await ui.settle();
 assert.equal(ui.node('empty').hidden,true);
 assert.match(ui.node('result-count').textContent,/일부 목록/);
 assert.match(ui.node('live-catalog-status').textContent,/일부 도안만/);
 ui.node('search-form').onsubmit({preventDefault(){}});assert.equal(ui.events.length,0);
});
test('complete snapshot supports full search while disclosing delayed live updates',async()=>{
 const ui=setup();ui.resolve({dataSource:'snapshot',items:[{id:'kuromi',title:{ko:'쿠로미'},creator:'B'}]});await ui.settle();
 assert.equal(ui.node('result-count').textContent,'1 개');
 assert.match(ui.node('live-catalog-status').textContent,/저장된 도안/);
});
