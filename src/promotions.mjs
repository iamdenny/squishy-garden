// Official, unmodified brand-kit assets. Provenance: docs/promotion-assets.md.
export const promotions=[
 {id:'tools',name:'Everyday Tools',url:'https://tools.iamdenny.com/',image:'/promotions/tools-ko.png',width:1080,height:1080},
 {id:'games',name:'Denny Games',url:'https://games.iamdenny.com/ko/',image:'/promotions/games-ko.png',width:336,height:280},
 {id:'modutt',name:'MODU TT · 모두의핑퐁',url:'https://modutt.kr/',image:'/promotions/modutt-light.svg',width:300,height:250}
];
export function promotionBlock(lang){
 const label={ko:'광고 · 함께 둘러보세요',en:'Promotion · More to explore',ja:'広告 · こちらもどうぞ'}[lang];
 return '<aside class="promotions" aria-label="'+label+'"><p class="eyebrow">'+label+'</p><div class="promotion-grid">'+promotions.map(p=>{const url=new URL(p.url);url.search=new URLSearchParams({utm_source:'squishy_garden',utm_medium:'cross_promotion',utm_campaign:'craft_discovery'});return '<a class="promotion-banner" href="'+url.href.replaceAll('&','&amp;')+'" target="_blank" rel="sponsored noopener noreferrer" data-promotion="'+p.id+'"><img src="'+p.image+'" width="'+p.width+'" height="'+p.height+'" alt="'+p.name+' — '+({ko:'서비스 홍보 배너',en:'Korean promotional banner',ja:'韓国語の紹介バナー'}[lang])+'" loading="lazy" decoding="async"></a>'}).join('')+'</div></aside>';
}
export function affiliateBlock(lang,config){
 if(!config.enabled||lang!=='ko')return '';
 const url=new URL(config.url);
 if(!config.channelRegistered||url.protocol!=='https:'||url.hostname!=='link.coupang.com'||!url.pathname.startsWith('/a/'))throw Error('Verified Coupang channel and issued link required');
 return '<aside id="supplies-ad" class="affiliate-supplies" aria-label="쿠팡 파트너스 광고"><p class="eyebrow">광고 · 쿠팡 파트너스</p><h2>종이 공방 준비물 살펴보기</h2><p>스퀴시 만들기 재료를 쿠팡에서 찾아보세요. 구매 전 상품 구성과 용도를 확인해 주세요.</p><p class="affiliate-disclosure">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</p><a class="button" href="'+url.href+'" target="_blank" rel="sponsored nofollow noopener noreferrer" data-promotion="coupang">쿠팡에서 준비물 보기 ↗</a></aside>';
}

export function affiliateCompact(lang,config,placement){
 if(!config.enabled||lang!=='ko')return '';
 const url=new URL(config.url);
 if(!config.channelRegistered||url.protocol!=='https:'||url.hostname!=='link.coupang.com'||!url.pathname.startsWith('/a/'))throw Error('Verified Coupang link required');
 return `<aside class="coupang-compact coupang-${placement}" aria-label="쿠팡 파트너스 광고"><div><small>광고 · 쿠팡 파트너스</small><h2>종이·테이프·솜, 준비물 챙기기</h2><p>만들 도안에 맞는 재료와 상품 구성을 확인해 주세요.</p></div><a class="button" href="${url.href}" target="_blank" rel="sponsored nofollow noopener noreferrer" data-promotion="coupang" data-placement="${placement}">쿠팡에서 준비물 보기 ↗</a><p class="affiliate-disclosure">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</p></aside>`;
}

export function affiliateRail(lang,config,placement){
 if(!config.enabled||lang!=='ko')return '';
 const url=new URL(config.url);
 if(!config.channelRegistered||url.protocol!=='https:'||url.hostname!=='link.coupang.com'||!url.pathname.startsWith('/a/'))throw Error('Verified Coupang link required');
 const copy=placement==='left'?['A4 종이와 색칠 도구','도안에 맞는 종이와 꾸미기 재료를 살펴보세요.']:['투명 테이프와 솜','붙이고 채울 재료의 구성과 용도를 확인해 보세요.'];
 return `<aside class="coupang-rail" aria-label="쿠팡 파트너스 광고 · ${placement}"><small>광고 · 쿠팡 파트너스</small><h2>${copy[0]}</h2><p>${copy[1]}</p><a class="button" href="${url.href}" target="_blank" rel="sponsored nofollow noopener noreferrer" data-promotion="coupang" data-placement="${placement}">준비물 살펴보기 ↗</a><p class="affiliate-disclosure">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</p></aside>`;
}
