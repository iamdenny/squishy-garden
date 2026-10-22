export const promotions=[
 {id:'tools',name:'Everyday Tools',icon:'✦',url:'https://tools.iamdenny.com/',copy:{ko:'계산부터 변환까지, 일상에 필요한 도구를 한곳에서.',en:'Everyday calculators and converters, all in one place.',ja:'計算や変換など、毎日に役立つツールをひとつに。'}},
 {id:'games',name:'Denny Games',icon:'♧',url:'https://games.iamdenny.com/',copy:{ko:'잠깐 쉬어갈까요? 설치 없이 즐기는 웹게임.',en:'Take a little break with games in your browser.',ja:'ちょっとひと休み。インストール不要のブラウザゲーム。'}},
 {id:'modutt',name:'MODU TT · 모두의핑퐁',icon:'◉',url:'https://modutt.kr/',copy:{ko:'탁구 기록부터 대회까지, 탁구 생활을 함께해요.',en:'Table tennis records and tournaments. Korean service.',ja:'卓球の記録から大会まで。韓国語の卓球サービス。'}}
];
export function promotionBlock(lang){
 const label={ko:'광고 · 함께 둘러보세요',en:'Promotion · More to explore',ja:'広告 · こちらもどうぞ'}[lang];
 return '<aside class="promotions" aria-label="'+label+'"><p class="eyebrow">'+label+'</p><div class="promotion-grid">'+promotions.map(p=>{const url=new URL(p.url);if(p.id!=='modutt')url.pathname='/'+lang+'/';url.search=new URLSearchParams({utm_source:'squishy_garden',utm_medium:'cross_promotion',utm_campaign:'craft_discovery'});return '<a class="promotion-card promotion-'+p.id+'" href="'+url.href.replaceAll('&','&amp;')+'" target="_blank" rel="sponsored noopener noreferrer" data-promotion="'+p.id+'"><span class="promotion-icon" aria-hidden="true">'+p.icon+'</span><div><h2>'+p.name+'</h2><p>'+p.copy[lang]+'</p></div><span aria-hidden="true">↗</span></a>'}).join('')+'</div></aside>';
}
export function affiliateBlock(lang,config){
 if(!config.enabled||lang!=='ko')return '';
 const url=new URL(config.url);
 if(!config.channelRegistered||url.protocol!=='https:'||url.hostname!=='link.coupang.com'||!url.pathname.startsWith('/a/'))throw Error('Verified Coupang channel and issued link required');
 return '<aside id="supplies-ad" class="affiliate-supplies" aria-label="쿠팡 파트너스 광고"><p class="eyebrow">광고 · 쿠팡 파트너스</p><h2>종이 공방 준비물 살펴보기</h2><p>스퀴시 만들기 재료를 쿠팡에서 찾아보세요. 구매 전 상품 구성과 용도를 확인해 주세요.</p><p class="affiliate-disclosure">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</p><a class="button" href="'+url.href+'" target="_blank" rel="sponsored nofollow noopener noreferrer" data-promotion="coupang">쿠팡에서 준비물 보기 ↗</a></aside>';
}
