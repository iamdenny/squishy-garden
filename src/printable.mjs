export const printCopy={
 ko:{title:'A4 원본 파일',note:'제작자 서버의 JPG 원본을 새 탭에서 엽니다. 원본에서 인쇄하고, 배율과 이용 조건은 제작자 안내를 따라 주세요.',file:'원본 열기',checked:'원본 링크 확인일'},
 en:{title:'Original A4 files',note:'Open the creator-hosted original JPG in a new tab and print from there. Follow the creator’s scale and usage instructions.',file:'Open original',checked:'Links checked'},
 ja:{title:'A4の原本ファイル',note:'制作者のJPG原本を新しいタブで開いて印刷できます。倍率と利用条件は制作者の説明に従ってください。',file:'原本を開く',checked:'リンク確認日'}
};
export function printableFiles(item){
 const p=item?.printable;
 if(!p||p.paper!=='A4'||p.format!=='JPG'||!Array.isArray(p.files)||p.files.length<1||p.files.length>24||!Object.values(item.urls||{}).includes(p.sourceUrl)||!p.sourceUrl.startsWith('https://hyeriming.com/ko/print/')||Number.isNaN(Date.parse(p.checkedAt)))return [];
 return p.files.every(url=>/^https:\/\/hyeriming\.com\/downloads\/squishy\/squishy[0-9]+\.jpg$/.test(url))?p.files:[];
}
