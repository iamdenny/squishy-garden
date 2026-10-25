import{readFile,access}from'node:fs/promises';import assert from'node:assert/strict';
const config=JSON.parse(await readFile('site.json'));const xml=await readFile('dist/sitemap.xml','utf8'),catalog=JSON.parse(await readFile('dist/catalog.json','utf8'));assert.equal(catalog.schemaVersion,1);assert(catalog.items.length>=100);assert.equal(new Set(catalog.items.map(i=>i.id)).size,catalog.items.length);let count=0;
for(const [,loc]of xml.matchAll(/<loc>(.*?)<\/loc>/g)){const p=new URL(loc).pathname;const html=await readFile('dist'+p+'index.html','utf8');assert(html.includes(`rel="canonical" href="${loc}"`));for(const lang of config.locales)assert(html.includes(`hreflang="${lang}"`));assert(html.includes('<meta name="description"'));for(const [,j]of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g))JSON.parse(j);for(const [,href]of html.matchAll(/(?:href|src)="(\/[^"?#]*)/g)){if(href==='/')continue;await access('dist'+href+(href.endsWith('/')?'index.html':''))}count++}
for(const p of ['robots.txt','llms.txt','fold-hero.jpg','release.json','CNAME'])await access('dist/'+p);console.log(`Verified metadata, JSON-LD and local links on ${count} pages.`);
for(const lang of config.locales){const home=await readFile(`dist/${lang}/index.html`,'utf8');assert(!home.includes('data-outbound='),'Home patterns must open our details first');for(const [,href]of home.matchAll(/class="mosaic-item[^\"]*" href="([^\"]+)"/g))assert(href.startsWith(`/${lang}/patterns/`));const detail=await readFile(`dist/${lang}/patterns/ryong-ditto-book/index.html`,'utf8');assert(detail.indexOf('id="prepare"')<detail.indexOf('data-outbound='));assert.equal((detail.match(/data-outbound=/g)||[]).length,1);assert.equal((detail.match(/data-supply=/g)||[]).length,5);assert(detail.includes('https://ryongryongkid.tistory.com/389'));}
for(const lang of config.locales){const live=await readFile(`dist/${lang}/fresh-pattern/index.html`,'utf8');assert(live.includes('noindex,follow'));assert(live.includes('id="api-pattern"'));for(const slot of ['top-desktop','top-mobile','left-rail','right-rail','bottom-rectangle'])assert(live.includes(`data-adsterra-slot="${slot}"`));}
console.log('Verified detail-first discovery and final creator handoff in all languages.');
for(const lang of config.locales){for(const route of ['print-studio','print/strawberry']){const page=await readFile(`dist/${lang}/${route}/index.html`,'utf8');assert(!page.includes('data-promotion='),'Print routes must not contain ads');assert(!page.includes('data-adsterra-slot='),'Print routes must not contain Adsterra slots');assert(!/<script src="https:\/\/bauval\.org\/22\//.test(page),'Print routes must not request Adsterra');assert(page.includes('noindex,follow'))}const detail=await readFile(`dist/${lang}/patterns/ryong-ditto-book/index.html`,'utf8');for(const slot of ['top-desktop','top-mobile','left-rail','right-rail','bottom-rectangle'])assert(detail.includes(`data-adsterra-slot="${slot}"`));assert(detail.includes('id="consent-adult"'));assert(detail.includes('id="consent-advertising"'));assert(detail.includes('localStorage.getItem("squishy-advertising")'));assert(!/<script src="https:\/\/bauval\.org\/22\//.test(detail),'Adsterra must wait for explicit opt-in');const privacy=await readFile(`dist/${lang}/privacy/index.html`,'utf8');assert(privacy.includes('https://adsterra.com/privacy-policy-managed'));}
const liveCatalogUrl='https://raw.githubusercontent.com/iamdenny/squishy-garden/main/public/catalog.json';assert.equal(config.catalogApiUrl,liveCatalogUrl);await access('dist/catalog-contract.mjs');assert.match(await readFile('dist/app.js','utf8'),/from '\.\/catalog-contract\.mjs\?v=[a-f0-9]{12}'/);for(const lang of config.locales){const page=await readFile(`dist/${lang}/index.html`,'utf8');assert(page.includes(`\"catalogApiUrl\":\"${liveCatalogUrl}\"`));}
assert((await readFile('dist/app.js','utf8')).includes("fetchCatalog('/catalog.json')"),'Search must fall back to the shared local catalog snapshot');
console.log('Verified the live catalog endpoint and bundled browser validator.');
for(const lang of config.locales){const detail=await readFile(`dist/${lang}/patterns/ryong-ditto-book/index.html`,'utf8');const rails=(detail.match(/class="coupang-rail"/g)||[]).length;assert.equal(rails,lang==='ko'?2:0,'Coupang side rails are Korean-only and need partner disclosures');assert(detail.includes('class="ad-rail-stack ad-rail-left"'));assert(detail.includes('class="ad-rail-stack ad-rail-right"'));}
const adCss=await readFile('dist/ads.css','utf8');assert(adCss.includes('@media(min-width:1200px)'));assert(adCss.includes('@media print{.adsterra-placement,.ad-rail-stack,.coupang-rail,.consent'));
console.log('Verified four-edge Coupang placements, wide-screen rails and print exclusion.');
for(const lang of config.locales){const external=await readFile(`dist/${lang}/patterns/ddany-dubai-chocolate/index.html`,'utf8');assert(external.includes('data-print-source="#creator-preview"'));assert(external.includes('data-print-mode="preview"'));assert(!external.includes(`href="/${lang}/print-studio/"`),'A pattern print action must not open the blank upload studio');const original=await readFile(`dist/${lang}/patterns/strawberry/index.html`,'utf8');assert(original.includes('data-print-source="#print-source"'));assert(original.includes('data-print-mode="template"'));assert(original.includes(`/patterns/${lang}/strawberry.svg`));const live=await readFile(`dist/${lang}/fresh-pattern/index.html`,'utf8');assert(live.includes('id="api-print"'));assert(!live.includes(`href="/${lang}/print-studio/"`));}
const style=await readFile('dist/style.css','utf8');assert(style.includes('body.print-preview #main .detail-art>img'));assert(style.includes('body.print-template .print-source'));
console.log('Verified detail print buttons target the selected image or original A4 SVG without opening the empty studio.');

const seller=`google.com, ${config.adsensePublisher.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`;
assert.equal(await readFile('dist/ads.txt','utf8'),seller);
for(const [,loc]of xml.matchAll(/<loc>(.*?)<\/loc>/g)){const html=await readFile('dist'+new URL(loc).pathname+'index.html','utf8');assert(html.includes(`<meta name="google-adsense-account" content="${config.adsensePublisher}">`));assert(!/<script[^>]+(?:pagead2\.googlesyndication|adsbygoogle)/.test(html),'Verification must not activate Google ads');}
console.log('Verified AdSense ownership metadata and seller record without Google ad scripts.');

for(const lang of config.locales){
 const detail=await readFile(`dist/${lang}/patterns/h-squishy0145/index.html`,'utf8');
 assert(detail.includes('href="https://hyeriming.com/downloads/squishy/squishy0145.jpg"'));
 assert(detail.includes('class="verified-printables"'));
 const live=await readFile(`dist/${lang}/fresh-pattern/index.html`,'utf8');assert(live.includes('id="api-printables"'));
}
console.log('Verified source-hosted A4 original links and live detail placeholders.');

for(const lang of config.locales){
 const home=await readFile(`dist/${lang}/index.html`,'utf8');assert(home.includes('id="printable-only"'));assert(home.includes('class="printable-badge"'));
 const detail=await readFile(`dist/${lang}/patterns/h-squishy0145/index.html`,'utf8');assert(detail.includes('data-pattern-view="h-squishy0145"'));assert(detail.includes('data-original-file="h-squishy0145"'));
}
console.log('Verified original-only filter, card badges and distinct detail/original event targets.');

// Shared UI strings must be available without a per-page duplicate payload.
await access("dist/i18n.mjs");
for(const lang of config.locales){const html=await readFile(`dist/${lang}/index.html`,"utf8");const embedded=JSON.parse(html.match(/id="site-config">(.*?)<\/script>/)[1]);assert.equal(embedded.lang,lang);assert(!Object.hasOwn(embedded,"ui"));}
console.log("Verified shared locale module and compact per-page configuration.");

for(const lang of config.locales){
 const home=await readFile(`dist/${lang}/index.html`,'utf8');
 const cards=home.split('id="cards" class="cards">')[1].split('<div id="empty"')[0];
 assert.equal((cards.match(/<article class="card"/g)||[]).length,24);
 const data=JSON.parse(home.match(/id="catalog-data">(.*?)<\/script>/)[1]);assert.equal(data.length,Math.min(24,catalog.items.length));
 const detail=await readFile(`dist/${lang}/patterns/squishyidea-butter-squishy-paper-template/index.html`,'utf8');
 assert(detail.includes({ko:'이메일 입력 필요',en:'Email required',ja:'メールアドレスの入力が必要'}[lang]));
}
console.log('Verified compact initial cards, shared full-catalog loading and email requirement disclosures.');
