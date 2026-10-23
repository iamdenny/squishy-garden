const copy={
 ko:{label:'광고',settings:'개인정보·광고 설정',description:'성인 방문자만 선택할 수 있어요. 익명 통계와 Adsterra 광고는 각각 선택하세요. 미성년자는 동의하지 않고 계속 이용해 주세요.',adult:'성인 방문자입니다',analytics:'익명 이용 통계 허용 (Google Analytics)',advertising:'Adsterra 배너 광고 요청 허용',save:'선택 저장',all:'성인 · 모두 허용',decline:'선택 없이 계속',privacy:'Adsterra 배너는 성인 방문자가 광고 요청을 허용한 경우에만 불러옵니다. 광고 요청 시 접속 IP, 브라우저·기기 정보, 페이지 주소와 광고 노출 정보가 Adsterra 및 광고 파트너에 전송·처리될 수 있습니다. 자세한 내용은 <a href="https://adsterra.com/privacy-policy-managed" target="_blank" rel="noopener noreferrer">Adsterra 개인정보 처리방침</a>과 <a href="https://adsterra.com/cookies/" target="_blank" rel="noopener noreferrer">쿠키 정책</a>을 확인해 주세요. 광고 허용은 이 브라우저에 저장되며 아래 설정에서 철회할 수 있습니다.'},
 en:{label:'Advertisement',settings:'Privacy & ad choices',description:'Optional analytics and Adsterra ads are for adult visitors and can be chosen separately. Minors should continue without opting in.',adult:'I am an adult visitor',analytics:'Allow anonymous usage analytics (Google Analytics)',advertising:'Allow Adsterra banner ad requests',save:'Save choices',all:'Adult · allow all',decline:'Continue without optional consent',privacy:'Adsterra banners load only when an adult visitor allows ad requests. A request may send your IP address, browser and device details, page URL, and ad impression information to Adsterra and its advertising partners. See the <a href="https://adsterra.com/privacy-policy-managed" target="_blank" rel="noopener noreferrer">Adsterra Privacy Policy</a> and <a href="https://adsterra.com/cookies/" target="_blank" rel="noopener noreferrer">Cookie Policy</a>. Your choice is saved in this browser and can be withdrawn in the settings below.'},
 ja:{label:'広告',settings:'プライバシー・広告の設定',description:'分析とAdsterra広告は成人の方のみ任意で選択できます。未成年の方は同意せずにご利用ください。',adult:'成人の訪問者です',analytics:'匿名の利用統計を許可する（Google Analytics）',advertising:'Adsterraのバナー広告リクエストを許可する',save:'選択を保存',all:'成人 · すべて許可',decline:'同意せずに続ける',privacy:'Adsterraのバナーは、成人の訪問者が広告リクエストを許可した場合にのみ読み込まれます。広告リクエスト時にIPアドレス、ブラウザー・端末情報、ページURL、広告表示情報がAdsterraと広告パートナーに送信・処理されることがあります。詳しくは<a href="https://adsterra.com/privacy-policy-managed" target="_blank" rel="noopener noreferrer">Adsterraプライバシーポリシー</a>と<a href="https://adsterra.com/cookies/" target="_blank" rel="noopener noreferrer">Cookieポリシー</a>をご確認ください。選択はこのブラウザーに保存され、下の設定から撤回できます。'}
};

export function consentSettingsLabel(lang){return copy[lang].settings;}

export function consentMarkup(lang){
 const t=copy[lang];
 return `<section class="consent" id="consent" hidden aria-label="${t.settings}"><p>${t.description}</p><label><input id="consent-adult" type="checkbox">${t.adult}</label><label><input id="consent-analytics" type="checkbox" disabled>${t.analytics}</label><label><input id="consent-advertising" type="checkbox" disabled>${t.advertising}</label><div class="consent-actions"><button id="consent-no">${t.decline}</button><button id="consent-save">${t.save}</button><button id="consent-yes" class="primary">${t.all}</button></div></section>`;
}

export function adPrivacyNote(lang){return `<p>${copy[lang].privacy}</p>`;}

const groups={top:['top-desktop','top-mobile'],left:['left-rail'],right:['right-rail'],bottom:['bottom-rectangle']};
export function adsterraMarkup(lang,config,group){
 if(!config.enabled)return '';
 const label=copy[lang].label;
 return groups[group].map(id=>{
  const slot=config.slots.find(s=>s.id===id);
  if(!slot)return '';
  const media=slot.media?` data-adsterra-media="${slot.media}"`:'';
  const options=JSON.stringify({key:slot.key,format:'iframe',height:slot.height,width:slot.width,params:{}});
  const mediaCheck=slot.media?`&&matchMedia(${JSON.stringify(slot.media)}).matches`:'';
  const bootstrap=`try{if(JSON.parse(localStorage.getItem("squishy-adult"))==="yes"&&JSON.parse(localStorage.getItem("squishy-advertising"))==="yes"${mediaCheck}){document.getElementById(${JSON.stringify(`adsterra-placement-${slot.id}`)}).hidden=false;window.atOptions=${options};document.write('<scr'+'ipt src=${JSON.stringify(slot.src)}><\\/scr'+'ipt>')}}catch{}`;
  return `<aside class="adsterra-placement adsterra-${slot.id}" id="adsterra-placement-${slot.id}" aria-label="${label} · ${slot.width}×${slot.height}"${media} hidden><small>${label}</small><div class="adsterra-frame" id="adsterra-slot-${slot.id}" data-adsterra-slot="${slot.id}" style="width:${slot.width}px;height:${slot.height}px"><script>${bootstrap}</script></div></aside>`;
 }).join('');
}
