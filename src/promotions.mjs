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

export function surroundingAds(lang){
 const label={ko:'광고',en:'Promotion',ja:'広告'}[lang];
 const banner=(id,image,width,height,placement)=>{const p=promotions.find(p=>p.id===id);return `<aside class="ad-${placement}" aria-label="${label} · ${p.name}"><small>${label}</small><a href="${p.url}?utm_source=squishy_garden&amp;utm_medium=cross_promotion&amp;utm_campaign=${placement}" target="_blank" rel="sponsored noopener noreferrer" data-promotion="${id}" data-placement="${placement}"><img src="/promotions/${image}" width="${width}" height="${height}" alt="${p.name}" loading="lazy"></a></aside>`};
 return banner('tools','tools-wide.png',1500,500,'top')+banner('modutt','modutt-tall.svg',160,600,'left')+banner('games','games-tall.png',160,600,'right');
}
