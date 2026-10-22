"""Collect public catalog names and canonical source links only, never pattern files.
One request at a time; robots checked; 1 second between listing pages.
"""
import json,time,urllib.request,re
from html.parser import HTMLParser
from urllib.robotparser import RobotFileParser
from pathlib import Path
BASE='https://hyeriming.com'
class Listing(HTMLParser):
 def __init__(self):super().__init__();self.items={};self.href=None
 def handle_starttag(self,t,a):
  d=dict(a)
  if t=='a':self.href=d.get('href')
  if t=='img' and self.href and re.search(r'/print/squishy\d+/$',self.href):
   key=self.href.rstrip('/').split('/')[-1];self.items[key]={'title':d.get('alt',''),'url':BASE+self.href}
 def handle_endtag(self,t):
  if t=='a':self.href=None
ua='SquishyGardenCatalog/1.0 (+https://squishy.iamdenny.com/ko/about/)'
def get(url):
 req=urllib.request.Request(url,headers={'User-Agent':ua})
 with urllib.request.urlopen(req,timeout=30) as r:return r.read().decode()
robots=RobotFileParser();robots.parse(get(BASE+'/robots.txt').splitlines())
rows={}
for lang in ['ko','en','ja']:
 for page in range(1,11):
  url=f'{BASE}/{lang}/squishy/'+(f'page/{page}/' if page>1 else '')
  if not robots.can_fetch(ua,url):raise RuntimeError('robots excludes '+url)
  p=Listing();p.feed(get(url))
  if not p.items:raise RuntimeError('No catalog items '+url)
  for key,v in p.items.items():
   row=rows.setdefault(key,{'id':'h-'+key,'title':{},'urls':{},'creator':'Hyeriming','kind':'external','access':'free','checkedAt':'2026-10-22','rights':'source-only','category':'food','difficulty':'unknown'})
   row['title'][lang]=v['title'];row['urls'][lang]=v['url']
  print(lang,page,len(p.items),flush=True);time.sleep(1)
for row in rows.values():
 t=row['title']['ko']
 if re.search('유령|눈알|호박|몬스터|마녀|박쥐|크리스마스|산타|할로윈|송편',t):row['category']='seasonal'
 elif re.search('고양이|강아지|토끼|곰|판다|햄스터|오리|펭귄|동물|여우|돼지|개구리|고래|공룡|고슴도치|다람쥐',t):row['category']='animals'
 elif re.search('세트|랜덤|뽑기|가게|마트|자판기',t):row['category']='play'
Path('src/catalog-external.json').write_text(json.dumps(list(rows.values()),ensure_ascii=False,indent=2))
print('Collected',len(rows))
