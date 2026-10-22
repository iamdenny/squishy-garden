"""Refresh approved public catalogs; metadata only, one request/second, fail closed.
Full listing traversal finds new/removed entries. Rotating detail checks cover every
entry over time. Failure preserves the last successfully published catalog.
"""
import json,time,urllib.request,re,os
from urllib.parse import urljoin
from urllib.error import HTTPError
from html.parser import HTMLParser
from urllib.robotparser import RobotFileParser
from pathlib import Path
from datetime import datetime,timezone
BASE='https://hyeriming.com'
UA='SquishyGardenCatalog/1.0 (+https://squishy.iamdenny.com/en/about/)'
NOW=datetime.now(timezone.utc);TODAY=NOW.date().isoformat()
class Listing(HTMLParser):
 def __init__(self):super().__init__();self.items={};self.href=None;self.pages=1
 def handle_starttag(self,t,a):
  d=dict(a)
  if t=='a':
   self.href=d.get('href','');m=re.search(r'/squishy/page/(\d+)/',self.href)
   if m:self.pages=max(self.pages,int(m[1]))
  if t=='img' and self.href and re.search(r'/print/squishy(?:Set)?\d+/$',self.href):
   key=self.href.rstrip('/').split('/')[-1];self.items[key]={'title':d.get('alt',''),'url':BASE+self.href,'thumbnail':urljoin(BASE,d.get('src',''))}
 def handle_endtag(self,t):
  if t=='a':self.href=None
class Preview(HTMLParser):
 def __init__(self):super().__init__();self.image=None
 def handle_starttag(self,t,a):
  d=dict(a)
  if t=='meta' and d.get('property')=='og:image' and d.get('content','').startswith('https://'):self.image=d['content']
robots={}
def request(url):
 for attempt in range(3):
  try:
   time.sleep(1)
   req=urllib.request.Request(url,headers={'User-Agent':UA})
   with urllib.request.urlopen(req,timeout=30) as r:
    if r.status!=200:raise RuntimeError('Unexpected status')
    return r.read(4_000_000).decode('utf-8')
  except Exception:
   if attempt==2:raise
   time.sleep(2**attempt)
def allowed_get(url):
 from urllib.parse import urlsplit
 u=urlsplit(url);origin=u.scheme+'://'+u.netloc
 if origin not in robots:
  parser=RobotFileParser();parser.parse(request(origin+'/robots.txt').splitlines());robots[origin]=parser
 if not robots[origin].can_fetch(UA,url):raise RuntimeError('robots excludes '+url)
 return request(url)
def validate_rows(rows,old):
 if len(rows)<100 or (old and len(rows)<len(old)*.8):raise RuntimeError('Unexpected catalog drop; preserving previous data')
 for row in rows:
  if set(row['title'])!={'ko','en','ja'} or any(not v.strip() for v in row['title'].values()):raise RuntimeError('Incomplete translation '+row['id'])
  if len(row['title']['ko'])>250:raise RuntimeError('Invalid title')
def collect_primary():
 rows={};path=Path('src/catalog-external.json');old=json.loads(path.read_text()) if path.exists() else []
 for lang in ['ko','en','ja']:
  first=Listing();first.feed(allowed_get(f'{BASE}/{lang}/squishy/'))
  if not 1<=first.pages<=100:raise RuntimeError('Pagination outside budget')
  for page in range(1,first.pages+1):
   p=first
   if page>1:p=Listing();p.feed(allowed_get(f'{BASE}/{lang}/squishy/page/{page}/'))
   if not p.items:raise RuntimeError('Empty listing')
   for key,v in p.items.items():
    row=rows.setdefault(key,{'id':'h-'+key,'title':{},'urls':{},'creator':'Hyeriming','kind':'external','access':'free','checkedAt':TODAY,'rights':'source-only','category':'food','difficulty':'unknown'})
    row['title'][lang]=v['title'];row['urls'][lang]=v['url']
    if lang=='ko' and v['thumbnail'].startswith(BASE+'/thumbs/'):row['thumbnail']=v['thumbnail']
   print(lang,page,len(p.items),flush=True)
 for row in rows.values():
  t=row['title'].get('ko','')
  if re.search('세트|랜덤|뽑기|가게|마트|자판기',t):row['category']='play'
  elif re.search('유령|눈알|호박|몬스터|마녀|박쥐|크리스마스|산타|할로윈|송편',t):row['category']='seasonal'
  elif re.search('고양이|강아지|토끼|곰|판다|햄스터|오리|펭귄|동물|여우|돼지|개구리|고래|공룡|고슴도치|다람쥐',t):row['category']='animals'
 result=list(rows.values());validate_rows(result,old)
 # Existing checkedAt means listing presence; detailCheckedAt is separately evidenced.
 oldmap={i['id']:i for i in old}
 for row in result:
  previous=oldmap.get(row['id'],{})
  row['firstSeenAt']=previous.get('firstSeenAt',previous.get('checkedAt',TODAY))
  if previous.get('detailCheckedAt'):row['detailCheckedAt']=previous['detailCheckedAt']
 offset=(NOW.date().toordinal()*12)%len(result)
 sample=[result[(offset+i)%len(result)] for i in range(min(12,len(result)))]
 for row in sample:
  html=allowed_get(row['urls']['ko'])
  if '<h1' not in html or row['urls']['ko'] not in html:raise RuntimeError('Detail page changed '+row['id'])
  row['detailCheckedAt']=TODAY
 return result,len(sample)
def check_extra(row):
 # An upstream failure is not evidence of deletion. Keep the last usable metadata.
 try:
  html=allowed_get(row['urls']['ko'])
  if '<h1' not in html:raise RuntimeError('Source markup changed')
  preview=Preview();preview.feed(html)
  if preview.image:row['thumbnail']=preview.image
  row['checkedAt']=TODAY
  check={'id':row['id'],'status':'reachable','checkedAt':TODAY}
 except HTTPError as error:
  check={'id':row['id'],'status':'unavailable' if error.code in (404,410) else 'unverified','checkedAt':TODAY,'httpStatus':error.code}
 except Exception as error:
  check={'id':row['id'],'status':'manual_required' if str(error).startswith('robots excludes ') else 'unverified','checkedAt':TODAY}
 previous=row.get('health',{})
 if check['status'] in ('reachable','unavailable'):
  check.update(lastConfirmedStatus=check['status'],lastConfirmedAt=TODAY)
 else:
  confirmed=previous.get('lastConfirmedStatus',previous.get('status'))
  if confirmed in ('reachable','unavailable'):
   check.update(lastConfirmedStatus=confirmed,lastConfirmedAt=previous.get('lastConfirmedAt',previous.get('checkedAt',row.get('checkedAt'))))
 row['health']={k:v for k,v in check.items() if k!='id'}
 return check

def main():
 path=Path('src/catalog-external.json');statepath=Path('src/freshness.json')
 state=json.loads(statepath.read_text());primary_ok=False
 try:
  result,detail_count=collect_primary();primary_ok=True
  path.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
  state.update(lastSuccessfulCheck=NOW.isoformat(),listings=len(result),detailChecks=detail_count)
 except Exception as error:
  print('::warning::Primary catalog refresh failed; preserving previous catalog and success timestamp. '+type(error).__name__,flush=True)
 extras=json.loads(Path('src/catalog-extra.json').read_text())
 checks=[check_extra(row) for row in extras]
 state.update(lastAttempt=NOW.isoformat(),primaryStatus='reachable' if primary_ok else 'unverified',otherSourceChecks=checks)
 state['partialFailure']=not primary_ok or any(c['status']!='reachable' for c in checks)
 if state['partialFailure']:print('::warning::Some sources could not be verified. See freshness.json.',flush=True)
 statepath.write_text(json.dumps(state,ensure_ascii=False,indent=2)+'\n')
 Path('src/catalog-extra.json').write_text(json.dumps(extras,ensure_ascii=False,indent=2)+'\n')
 print('Curated links checked:',len(checks),'reachable:',sum(c['status']=='reachable' for c in checks),flush=True)
if __name__=='__main__':main()
