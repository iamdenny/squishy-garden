// A 50 mm cube net: top, front, bottom, back, left, right.
// Five panel hinges and seven glue tabs close the twelve edges of the cube.
export const originals=[
 ['strawberry','딸기 큐브 상자','Strawberry cube','いちごキューブ','food','#f6acb8'],
 ['milk','딸기우유 상자','Strawberry milk box','いちごミルクボックス','food','#f7c4d0'],
 ['bear','곰돌이 상자','Little bear box','くまさんボックス','animals','#dfbd90'],
 ['cloud','구름 선물 상자','Cloud gift box','くもギフトボックス','nature','#dceaf3'],
 ['peach','복숭아 큐브','Peach cube','ももキューブ','food','#ffd2b7'],
 ['bunny','토끼 귀 상자','Bunny ears box','うさぎボックス','animals','#eed9ef'],
 ['star','별사탕 상자','Sugar star box','おほしさまボックス','nature','#f7e49e'],
 ['cat','고양이 상자','Little cat box','ねこボックス','animals','#d4e1c9']
].map(([id,ko,en,ja,category,color])=>({id,title:{ko,en,ja},category,color,creator:'Squishy Garden',kind:'original',craftType:'fold',access:'free',difficulty:'easy',rights:'CC BY 4.0',checkedAt:'2026-10-22',urls:{}}));
export const panels=[{name:'top',x:80,y:42},{name:'front',x:80,y:92},{name:'bottom',x:80,y:142},{name:'back',x:80,y:192},{name:'left',x:30,y:92},{name:'right',x:130,y:92}];
export const tabs=[{panel:'top',edge:'top',match:'back.bottom'},{panel:'top',edge:'left',match:'left.top'},{panel:'top',edge:'right',match:'right.top'},{panel:'bottom',edge:'left',match:'left.bottom'},{panel:'bottom',edge:'right',match:'right.bottom'},{panel:'back',edge:'left',match:'left.left'},{panel:'back',edge:'right',match:'right.right'}];
export function tabPoints(panel,edge){const{x,y}=panel,s=50,d=7,c=4;return edge==='left'?[[x,y],[x-d,y+c],[x-d,y+s-c],[x,y+s]]:edge==='right'?[[x+s,y],[x+s+d,y+c],[x+s+d,y+s-c],[x+s,y+s]]:[[x,y],[x+c,y-d],[x+s-c,y-d],[x+s,y]];}
const hints={ko:{cut:'실선: 오리기',fold:'점선: 접기',glue:'번호 날개: 풀칠',front:'앞면',top:'윗면',bottom:'아랫면',back:'뒷면',left:'왼쪽',right:'오른쪽',title:'입체 상자 전개도',scale:'A4 · 배율 100% · 완성 크기 5 × 5 × 5 cm',step1:'① 바깥 실선을 오리세요. ② 점선을 안쪽으로 접으세요.',step2:'③ 번호 날개를 같은 번호의 면 안쪽에 붙이세요. ④ 윗면은 마지막에 닫으세요.',access:'장식: 바깥선을 오리고 점선을 접어 윗면에 붙이세요.',note:'상자 만들기 도안입니다. 종이 스퀴시로 쓸 때는 테이프와 부드러운 충전재가 필요해요.'},en:{cut:'Solid: cut',fold:'Dashed: fold',glue:'Numbered tabs: glue',front:'FRONT',top:'TOP',bottom:'BOTTOM',back:'BACK',left:'LEFT',right:'RIGHT',title:'Foldable box template',scale:'A4 · 100% scale · Finished size 5 × 5 × 5 cm',step1:'1. Cut the outer solid line. 2. Fold dashed lines inward.',step2:'3. Glue tabs behind their matching numbered edges. 4. Close the top last.',access:'Decoration: cut, fold the dashed base and glue onto the top.',note:'Box craft template. For a squishy version, add clear tape and soft stuffing.'},ja:{cut:'実線：切る',fold:'点線：折る',glue:'番号のタブ：のり',front:'前',top:'上',bottom:'底',back:'後ろ',left:'左',right:'右',title:'立体ボックスの型紙',scale:'A4 · 倍率100% · 完成サイズ 5 × 5 × 5 cm',step1:'① 外側の実線を切ります。② 点線を内側に折ります。',step2:'③ 同じ番号の辺の裏にタブを貼ります。④ 上面は最後に閉じます。',access:'飾り：切って、点線で折り、上面に貼ります。',note:'ボックス工作の型紙です。スクイーズにする場合はテープと柔らかい詰め物を追加。'}};
function face(item,x,y,mono){let d='';const pink=mono?'white':'#ed91a3';
 if(item.id==='milk')d=`<path d="M${x+2} ${y+9}H${x+48}" stroke="${pink}" stroke-width="4"/><text x="${x+25}" y="${y+15}" text-anchor="middle" font-family="sans-serif" font-size="3" fill="#7e4d62">STRAWBERRY MILK</text>`;
 if(item.id==='strawberry')d=`<path d="M${x+11} ${y+5}l7 5 7-8 7 8 7-5-5 11H${x+16}Z" fill="${mono?'white':'#89a77a'}" stroke="#66775f" stroke-width=".4"/>`;
 if(item.id==='star')d=`<path d="M${x+25} ${y+5}l2.4 5 5.5.6-4 4 1 5.5-4.9-2.7-4.9 2.7 1-5.5-4-4 5.5-.6Z" fill="${mono?'white':'#fff4c4'}" stroke="#a58c51" stroke-width=".4"/>`;
 if(item.id==='cat')d+=`<path d="M${x+8} ${y+30}l8 1m-8 4 8-1m18-3 8-1m-8 4 8 1" stroke="#5a6153" stroke-width=".6"/>`;
 return `${d}<g fill="#514946"><circle cx="${x+18}" cy="${y+26}" r="1.4"/><circle cx="${x+32}" cy="${y+26}" r="1.4"/><path d="M${x+22} ${y+31}q3 4 6 0" fill="none" stroke="#514946" stroke-width=".7" stroke-linecap="round"/><ellipse cx="${x+13}" cy="${y+31}" rx="2.8" ry="1.4" fill="${pink}"/><ellipse cx="${x+37}" cy="${y+31}" rx="2.8" ry="1.4" fill="${pink}"/></g>`;
}
function net(item,mono=false,lang='en'){
 const t=hints[lang];let s='';const color=mono?'white':item.color;
 for(const p of panels){s+=`<rect x="${p.x}" y="${p.y}" width="50" height="50" fill="${color}"/>`;if(p.name==='front')s+=face(item,p.x,p.y,mono);else s+=`<text x="${p.x+25}" y="${p.y+27}" text-anchor="middle" font-size="2.5" fill="#8d8279">${t[p.name]}</text>`;}
 for(const tab of tabs){const p=panels.find(p=>p.name===tab.panel),points=tabPoints(p,tab.edge);s+=`<polygon points="${points.map(v=>v.join(',')).join(' ')}" fill="${mono?'white':'#f0ece7'}"/>`;}
 // Every panel edge is a cut, a panel hinge, or the base of a glue tab.
 for(const p of panels)for(const edge of ['top','right','bottom','left']){
  const x=p.x,y=p.y,S=50,ends={top:[x,y,x+S,y],right:[x+S,y,x+S,y+S],bottom:[x,y+S,x+S,y+S],left:[x,y,x,y+S]}[edge];
  const neighbor=panels.find(q=>q!==p&&({top:q.x===x&&q.y+S===y,bottom:q.x===x&&q.y===y+S,left:q.y===y&&q.x+S===x,right:q.y===y&&q.x===x+S}[edge]));
  const tab=tabs.find(q=>q.panel===p.name&&q.edge===edge);
  if(neighbor&&panels.indexOf(neighbor)<panels.indexOf(p))continue;
  s+=`<line x1="${ends[0]}" y1="${ends[1]}" x2="${ends[2]}" y2="${ends[3]}" stroke="${neighbor||tab?'#8c6a79':'#4f4945'}" stroke-width="${neighbor||tab?'.35':'.45'}" ${neighbor||tab?'stroke-dasharray="2 1.4"':''}/>`;
 }
 tabs.forEach((tab,i)=>{const p=panels.find(p=>p.name===tab.panel),points=tabPoints(p,tab.edge);s+=`<polyline points="${points.map(v=>v.join(',')).join(' ')}" fill="none" stroke="#4f4945" stroke-width=".45"/>`;let cx=tab.edge==='left'?p.x-3.5:tab.edge==='right'?p.x+53.5:p.x+25,cy=tab.edge==='top'?p.y-2:p.y+26;s+=`<text x="${cx}" y="${cy}" text-anchor="middle" font-size="3" fill="#777">${i+1}</text>`;
 const[panelName,edge]=tab.match.split('.'),q=panels.find(p=>p.name===panelName);cx=edge==='left'?q.x+3:edge==='right'?q.x+47:q.x+25;cy=edge==='top'?q.y+5:edge==='bottom'?q.y+47:q.y+26;s+=`<text x="${cx}" y="${cy}" text-anchor="middle" font-size="3" fill="#777">${i+1}</text>`;});
 if(['bunny','bear','cat'].includes(item.id)){for(const x of [37,58]){const ear=item.id==='bunny'?`M${x} 206V177C${x} 154 ${x+13} 154 ${x+13} 177V206Z`:item.id==='cat'?`M${x} 206V178L${x+13} 194V206Z`:`M${x} 206V191C${x-6} 174 ${x+19} 174 ${x+13} 191V206Z`;s+=`<path d="${ear}" fill="${color}" stroke="#4f4945" stroke-width=".45"/><path d="M${x} 199H${x+13}" stroke="#8c6a79" stroke-width=".35" stroke-dasharray="2 1.4"/>`;}}
 return s;
}
export function art(item){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="18 27 175 225"><g font-family="sans-serif">${net(item)}</g></svg>`;}
export function printable(item,mono=false,lang='en'){
 const t=hints[lang];return `<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 210 297"><rect width="210" height="297" fill="white"/><g font-family="'Noto Sans KR','Noto Sans JP',Arial,sans-serif" fill="#493f42"><text x="15" y="13" font-size="5" font-weight="bold">Squishy Garden · ${item.title[lang]}</text><text x="15" y="20" font-size="3">${t.title} · ${t.scale}</text><line x1="15" y1="27" x2="25" y2="27" stroke="#4f4945" stroke-width=".45"/><text x="28" y="28" font-size="2.6">${t.cut}</text><line x1="77" y1="27" x2="87" y2="27" stroke="#8c6a79" stroke-width=".35" stroke-dasharray="2 1.4"/><text x="90" y="28" font-size="2.6">${t.fold}</text><text x="145" y="28" font-size="2.6">${t.glue}</text>${net(item,mono,lang)}<text x="15" y="255" font-size="2.5">${t.step1}</text><text x="15" y="261" font-size="2.5">${t.step2}</text>${['bunny','bear','cat'].includes(item.id)?`<text x="15" y="267" font-size="2.5">${t.access}</text>`:''}<text x="15" y="276" font-size="2.3">${t.note}</text><text x="15" y="285" font-size="2.4">squishy.iamdenny.com · Original template · CC BY 4.0</text><path d="M160 282v4m0-2h30m0-2v4" stroke="#555" stroke-width=".35"/><text x="175" y="290" text-anchor="middle" font-size="2.3">30 mm</text></g></svg>`;
}
export function assembly(){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 190"><g fill="#f6d7de" stroke="#536759" stroke-width="2"><path d="M45 40h35v35h35v35H80v35H45v-35H10V75h35Z"/><path d="M200 100l30 25 65-25-30-25Z"/><path d="M200 100V55l30 25v45m0-45 65-25v45" fill="#e3eacb"/><path d="M390 60l45 20v65l-45-20Zm45 20 60-25v65l-60 25Z"/><path d="M390 60l60-25 45 20-60 25Z" fill="#e3eacb"/><path d="M620 65l45 20v60l-45-20Zm45 20 60-25v60l-60 25Z"/><path d="M620 65l60-25 45 20-60 25Z" fill="#e3eacb"/></g><g fill="#536759" font-family="sans-serif" font-size="14" text-anchor="middle"><text x="62" y="175">1</text><text x="248" y="175">2</text><text x="445" y="175">3</text><text x="675" y="175">4</text><text x="150" y="95">→</text><text x="340" y="95">→</text><text x="550" y="95">→</text></g><g fill="#514946"><circle cx="680" cy="105" r="3"/><circle cx="705" cy="95" r="3"/><path d="M686 115q8 5 15-5" stroke="#514946" stroke-width="2" fill="none"/></g></svg>`;}
