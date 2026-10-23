"""Conservative metadata-only publication for reviewed creator feeds.
No article bodies or printable files are persisted. Ambiguous posts stay in review.
"""
import re
from html import unescape
from html.parser import HTMLParser
from urllib.parse import urlsplit
from datetime import datetime, timezone
from collect import allowed_get
from public_sources import eligible_listing

class Evidence(HTMLParser):
 def __init__(self):
  super().__init__();self.meta={};self.depth=0;self.body=[];self.assets=0;self.skip=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='meta':self.meta[a.get('property','')]=a.get('content','')
  if tag=='div':
   if self.depth:self.depth+=1
   elif 'contents_style' in a.get('class','').split():self.depth=1
  if self.depth:
   if tag in ('script','style'):self.skip+=1
   if tag=='figure' and 'fileblock' in a.get('class','').split():self.assets+=1
   if tag=='figure' and 'imageblock' in a.get('class','').split():
    try:
     # An A4-shaped high-resolution image in the article is evidence of a printable,
     # not a sidebar thumbnail or an embedded preview of another article.
     w,h=int(a.get('data-origin-width',0)),int(a.get('data-origin-height',0))
     if min(w,h)>=1000 and 1.35<max(w,h)/min(w,h)<1.48:self.assets+=1
    except (ValueError,ZeroDivisionError):pass
 def handle_endtag(self,tag):
  if tag=='div' and self.depth:self.depth-=1
  if tag in ('script','style') and self.skip:self.skip-=1
 def handle_data(self,data):
  if self.depth and not self.skip:self.body.append(data)

def normalized(title):return re.sub(r'[\W_]+','',unescape(title)).casefold()
def eligible(candidate,html):
 p=Evidence();p.feed(html);title=unescape(candidate['title']);body=' '.join(p.body)
 if not re.search(r'무료\s*도안',title):return None,'Title does not explicitly offer a free template'
 if not re.search(r'스퀴[시즈쉬]|squish',title,re.I):return None,'Not a squishy template title'
 if normalized(p.meta.get('og:title',''))!=normalized(title):return None,'Feed and source titles differ'
 if not p.assets or not re.search(r'도안|템플릿',body):return None,'Printable asset evidence missing from article'
 if re.search(r'유료\s*도안|도안\s*구매|판매\s*도안',body):return None,'Pricing needs editorial review'
 image=p.meta.get('og:image','');u=urlsplit(image)
 if u.scheme!='https' or not u.hostname or u.username or u.password:return None,'Preview needs review'
 return p,None

def category(title):
 if re.search('할로윈|크리스마스|산타|미라|유령|호박|눈알|프랑켄슈타인',title):return 'seasonal'
 if re.search('스퀴시북|가게|하우스|게임|집 만들기',title):return 'play'
 if re.search('강아지|고양이|토끼|동물|곰|펭귄',title):return 'animals'
 if re.search('버터|과일|블루베리|키위|빵|우유|초콜릿|간식|아이스크림',title):return 'food'
 return 'play'

def promote(queue,published,sources,fetch=allowed_get,now=None,budget=24):
 now=now or datetime.now(timezone.utc).isoformat();day=now[:10]
 approved={s['id']:s for s in sources if s.get('autoPublish')}
 existing={u.rstrip('/') for row in published for u in row.get('urls',{}).values()};result=list(published);checked=0
 # Never reconsider rejected posts. Retry oldest checked candidate first to avoid starvation.
 candidates=sorted((r for r in queue if r['status']=='pending_review' and r['sourceId'] in approved),key=lambda r:r.get('lastReviewAttempt',''))
 # Interleave sources so a large historical listing cannot starve other creators.
 groups={}
 for row in candidates:groups.setdefault(row['sourceId'],[]).append(row)
 candidates=[row for rank in range(max((len(rows) for rows in groups.values()),default=0)) for rows in groups.values() for row in rows[rank:rank+1]]
 for row in candidates:
  if checked>=budget:break
  source=approved[row['sourceId']]
  if urlsplit(row['url']).hostname!=urlsplit(source['feed']).hostname:continue
  if row['url'].rstrip('/') in existing:row['status']='published';continue
  checked+=1;row['lastReviewAttempt']=now
  try:
   evidence,reason=(eligible_listing if source.get('adapter')=='listing' else eligible)(row,fetch(row['url']))
   if not evidence:row['reviewNote']=reason;continue
   title=getattr(evidence,'title',unescape(row['title']));item={'id':'feed-'+row['id'],'title':{lang:title for lang in ['ko','en','ja']},'titleLanguage':source.get('language','ko'),'urls':{'ko':row['url']},'creator':source['creator'],'kind':'external','category':category(title),'difficulty':'unknown','access':'free','rights':'source-only','thumbnail':evidence.meta['og:image'],'checkedAt':day,'firstSeenAt':day,'sourcePublishedAt':row.get('sourcePublishedAt'),'tags':['스퀴시','squishy','スクイーズ'],'health':{'status':'reachable','checkedAt':day,'lastConfirmedStatus':'reachable','lastConfirmedAt':day},'verification':{'method':('approved-listing-and-form-v1' if source.get('accessRequirement')=='email' else 'approved-listing-and-file-v1') if source.get('adapter')=='listing' else 'approved-feed-and-article-v1','sourceId':source['id'],'checkedAt':now,'sourceUrl':row['url']}}
   if source.get('accessRequirement'):item['accessRequirement']=source['accessRequirement']
   if '스퀴시북' in title:item['craftType']='book'
   result.append(item);existing.add(row['url'].rstrip('/'));row['status']='published';row['reviewNote']='Source title, free-template claim and in-article printable evidence verified'
  except Exception as error:row['reviewNote']='Source verification failed: '+type(error).__name__
 return result,checked
