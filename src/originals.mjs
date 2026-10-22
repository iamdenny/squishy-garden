export const originals = [
 ['strawberry','딸기 말랑이','Strawberry friend','いちごスクイーズ','food','#f7a3ad','M100 60 C35 32 25 105 100 175 C175 105 165 32 100 60Z'],
 ['milk','딸기우유 팩','Strawberry milk','いちごミルク','food','#f8bccb','M60 25H140L157 60V175H43V60Z'],
 ['bear','곰돌이 토스트','Bear toast','くまトースト','animals','#dfb785','M45 65C15 20 80 5 83 43Q100 35 117 43C140 5 185 30 155 65Q175 100 155 155Q100 185 45 155Q25 100 45 65Z'],
 ['cloud','몽실 구름','Little cloud','ふわふわ雲','nature','#d9e8f3','M42 145C0 140 10 80 48 80C35 25 100 10 120 55C165 20 200 75 168 98C210 135 155 175 126 148Q85 180 42 145Z'],
 ['peach','복숭아 친구','Peach pal','ももフレンド','food','#ffc3b3','M100 58C20 5 0 115 100 175C200 115 180 5 100 58Z'],
 ['bunny','포근 토끼','Cozy bunny','ほっこりうさぎ','animals','#e9d5ee','M60 80C10 -10 75 -5 85 65H115C125 -5 190 -10 140 80C195 160 135 185 100 180C65 185 5 160 60 80Z'],
 ['star','반짝 별사탕','Sugar star','こんぺいとうスター','nature','#f5d77d','M100 15L125 70L185 78L140 120L150 182L100 151L50 182L60 120L15 78L75 70Z'],
 ['cat','낮잠 고양이','Sleepy cat','おひるねねこ','animals','#c7dac7','M40 85L35 25L80 60Q100 53 120 60L165 25L160 85Q195 175 100 180Q5 175 40 85Z']
].map(([id,ko,en,ja,category,color,path])=>({id,title:{ko,en,ja},category,color,path,creator:'Squishy Garden',kind:'original',access:'free',difficulty:'easy',rights:'CC BY 4.0',checkedAt:'2026-10-22',urls:{}}));
export function drawing(item,{back=false,mono=false}={}) {
 const face=back?'':`<circle cx="76" cy="106" r="5"/><circle cx="124" cy="106" r="5"/><path d="M90 121Q100 132 110 121" fill="none" stroke="#493f42" stroke-width="3" stroke-linecap="round"/><ellipse cx="61" cy="119" rx="9" ry="5" fill="#ed8c99"/><ellipse cx="139" cy="119" rx="9" ry="5" fill="#ed8c99"/>`;
 const decor=item.id==='strawberry'?'<path d="M65 55L85 35L100 53L117 33L135 55L100 69Z" fill="#729c72"/>':item.id==='milk'?'<path d="M43 61H157M60 25L75 61V175" fill="none" stroke="#a56b83" stroke-width="3"/><path d="M90 78H140" stroke="#fff" stroke-width="7"/>':'';
 return `<g fill="#493f42"><path d="${item.path}" fill="${mono?'white':item.color}" stroke="#493f42" stroke-width="3" stroke-linejoin="round"/>${decor}${face}</g>`;
}
export function art(item){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 230"><g transform="translate(20 20)">${drawing(item)}</g></svg>`;}
export function printable(item,mono=false){return `<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 794 1123"><rect width="794" height="1123" fill="white"/><g font-family="sans-serif" fill="#493f42"><text x="55" y="65" font-size="25" font-weight="bold">Squishy Garden · ${item.title.en}</text><text x="55" y="98" font-size="14">A4 · Print at 100% · Color, cut, tape, stuff, seal.</text><g transform="translate(95 150) scale(2.3)">${drawing(item,{mono})}</g><g transform="translate(95 590) scale(2.3)">${drawing(item,{mono,back:true})}</g><text x="575" y="350" font-size="16">FRONT</text><text x="575" y="790" font-size="16">BACK</text><text x="55" y="1040" font-size="13">Tape both sides. Cut along the outer outline. Leave a small gap for stuffing.</text><text x="55" y="1064" font-size="13">Use soft tissue or cotton. Seal the gap with tape. Ask an adult for help cutting.</text><text x="55" y="1095" font-size="12">squishy.iamdenny.com · Original template · CC BY 4.0</text></g></svg>`;}
