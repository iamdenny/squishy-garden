"""Find review candidates from approved RSS feeds; publish only source-verified metadata from approved creators."""
import hashlib,json,re,xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlsplit,urlunsplit,parse_qsl,urlencode,unquote,quote
from datetime import datetime,timezone
from collect import allowed_get
from html import unescape

SOURCES=[
 {'id':'gripipi','creator':'그리피피 · Gripipi','feed':'https://tingkka.tistory.com/rss'},
 {'id':'rosazzing','creator':'로사찡','feed':'https://rosazzing.tistory.com/rss'},
 {'id':'ryong','creator':'룡룡쌤','feed':'https://ryongryongkid.tistory.com/rss'},
 {'id':'sunny','creator':'햇님유뚜비','feed':'https://sunny-utube.tistory.com/rss','autoPublish':True},
 {'id':'zzoangland','creator':'쪼앙랜드 · zzoangland','feed':'https://chohwa.tistory.com/rss','autoPublish':True},
 {'id':'morongborong','creator':'모롱보롱 · morongborong','feed':'https://whitetree0415.tistory.com/rss','autoPublish':True}]

def canonical_url(url):
 u=urlsplit(url)
 if u.scheme not in ('http','https') or not u.hostname or u.username or u.password:raise ValueError('Invalid source URL')
 host=u.hostname.lower();path=unquote(u.path).rstrip('/') or '/'
 # Naver exposes the same post through desktop, mobile and PostView URLs.
 # Only normalize verified post-shaped paths; unrelated query semantics survive.
 if host in ('blog.naver.com','m.blog.naver.com'):
  params=dict(parse_qsl(u.query));match=re.fullmatch(r'/([A-Za-z0-9_-]+)/([0-9]+)',path)
  if path in ('/PostView.naver','/PostView.nhn') and re.fullmatch(r'[A-Za-z0-9_-]+',params.get('blogId','')) and re.fullmatch(r'[0-9]+',params.get('logNo','')):
   return 'https://blog.naver.com/'+params['blogId'].lower()+'/'+params['logNo']
  if match:return 'https://blog.naver.com/'+match[1].lower()+'/'+match[2]
 if host.endswith('.tistory.com') and path.startswith('/m/'):path=path[2:]
 query=[(k,v) for k,v in parse_qsl(u.query) if not k.lower().startswith('utm_') and k.lower() not in ('fbclid','gclid')]
 return urlunsplit(('https',host,quote(path,safe='/@:'),urlencode(sorted(query)),''))

def parse_feed(xml,source):
 root=ET.fromstring(xml);entries=root.findall('./channel/item')
 if root.tag!='rss' or root.find('channel') is None:raise ValueError('Expected RSS channel')
 if len(entries)>100:raise ValueError('Feed item budget exceeded')
 result=[];host=urlsplit(source['feed']).hostname
 for entry in entries:
  title=re.sub(r'\s+',' ',unescape(entry.findtext('title') or '')).strip()
  if not re.search(r'스퀴[시즈쉬]|말랑이|squish',title,re.I):continue
  if not title or len(title)>250:continue
  try:url=canonical_url(entry.findtext('link') or '')
  except ValueError:continue
  if urlsplit(url).hostname!=host:continue
  result.append({'id':hashlib.sha256(url.encode()).hexdigest()[:16],'sourceId':source['id'],'creator':source['creator'],'title':title,'url':url,'sourcePublishedAt':entry.findtext('pubDate'),'status':'pending_review'})
 return result

def refresh(old,published,fetch=allowed_get):
 now=datetime.now(timezone.utc).isoformat();rows={canonical_url(r['url']):{**r,'url':canonical_url(r['url'])} for r in old};checks=[]
 known={canonical_url(url) for row in published for url in row.get('urls',{}).values()}
 for source in SOURCES:
  try:
   candidates=parse_feed(fetch(source['feed']),source)
   for row in candidates:
    url=row['url']
    if url in known:continue
    if url not in rows:rows[url]={**row,'firstSeenAt':now}
    rows[url]['lastSeenAt']=now
   checks.append({'sourceId':source['id'],'status':'reachable','checkedAt':now,'matchingItems':len(candidates)})
  except Exception as error:
   checks.append({'sourceId':source['id'],'status':'unverified','checkedAt':now,'reason':type(error).__name__})
   print('::warning::Discovery failed for '+source['id']+'; preserving previous review queue.',flush=True)
 for url,row in rows.items():
  if url in known:row['status']='published'
 return list(rows.values()),checks

def main():
 path=Path('data/discovery-queue.json');old=json.loads(path.read_text()) if path.exists() else []
 published=json.loads(Path('src/catalog-external.json').read_text())+json.loads(Path('src/catalog-extra.json').read_text())
 rows,checks=refresh(old,published)
 from catalog_growth import promote
 extra_path=Path('src/catalog-extra.json');extras=json.loads(extra_path.read_text())
 grown,verified=promote(rows,extras,SOURCES)
 extra_path.write_text(json.dumps(grown,ensure_ascii=False,indent=2)+'\n')
 print('New verified patterns:',len(grown)-len(extras),'source pages checked:',verified,flush=True)
 path.parent.mkdir(exist_ok=True);path.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
 Path('data/discovery-health.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2)+'\n')
 print('Review queue:',sum(r['status']=='pending_review' for r in rows),'pending; source checks:',len(checks),flush=True)
if __name__=='__main__':main()
