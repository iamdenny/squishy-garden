"""Bounded discovery from reviewed public listing pages; never store template binaries."""
import hashlib,re
from html.parser import HTMLParser
from urllib.parse import urljoin,urlsplit

SOURCES=[
 {'id':'doran','creator':'도란도안 · Doran Doan','feed':'https://dorandoan.com/category/squishy','adapter':'listing','path':r'/worksheets/squishy-[a-z0-9-]+','language':'ko','autoPublish':True},
 {'id':'squishyguide','creator':'SquishyGuide','feed':'https://www.squishyguide.com/en/download-pack/','adapter':'listing','path':r'/en/templates/[a-z0-9-]+/?','language':'en','autoPublish':True},
]
class Page(HTMLParser):
 def __init__(self):
  super().__init__();self.meta={};self.links=[];self.href=None;self.label=[];self.text=[];self.skip=0;self.heading=False;self.h1=[]
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if t=='meta':self.meta[a.get('property','')]=a.get('content','')
  if t in ('script','style'):self.skip+=1
  if t=='h1':self.heading=True
  if t=='a':self.href=a.get('href');self.label=[]
  if t=='img' and self.href and a.get('alt'):self.label.append(a['alt'])
 def handle_data(self,d):
  if self.skip:return
  self.text.append(d)
  if self.heading:self.h1.append(d)
  if self.href:self.label.append(d)
 def handle_endtag(self,t):
  if t in ('script','style') and self.skip:self.skip-=1
  if t=='h1':self.heading=False
  if t=='a':
   if self.href:self.links.append((self.href,' '.join(self.label).strip()))
   self.href=None;self.label=[]

def parse_listing(html,source):
 p=Page();p.feed(html);rows={};origin=urlsplit(source['feed']).hostname
 for href,label in p.links:
  url=urljoin(source['feed'],href);u=urlsplit(url)
  if u.scheme!='https' or u.hostname!=origin or u.query or not re.fullmatch(source['path'],u.path):continue
  title=re.sub(r'\s+',' ',label).strip()
  if not re.search(r'스퀴[시즈쉬]|squish',title,re.I) or len(title)>250:continue
  if url in rows:continue
  rows[url]={'id':hashlib.sha256(url.encode()).hexdigest()[:16],'sourceId':source['id'],'creator':source['creator'],'title':title,'url':url,'sourcePublishedAt':None,'status':'pending_review','discoveredVia':source['feed']}
 if not rows:raise ValueError('No pattern links found in public listing')
 if len(rows)>500:raise ValueError('Listing candidate budget exceeded')
 return list(rows.values())

def eligible_listing(candidate,html):
 source=next((s for s in SOURCES if s['id']==candidate['sourceId']),None)
 if not source:return None,'Unknown public source'
 u=urlsplit(candidate['url'])
 if u.hostname!=urlsplit(source['feed']).hostname or not re.fullmatch(source['path'],u.path):return None,'Unexpected source URL'
 p=Page();p.feed(html);title=' '.join(p.h1).strip()
 if not title or len(title)>250 or not re.search(r'스퀴[시즈쉬]|squish',title+' '+p.meta.get('og:title',''),re.I):return None,'Pattern heading missing'
 image=p.meta.get('og:image','')
 if urlsplit(image).scheme!='https':return None,'Preview missing'
 # Only a file explicitly linked by this exact pattern page counts as evidence.
 slug=u.path.rstrip('/').split('/')[-1]
 files=[urlsplit(urljoin(candidate['url'],href)) for href,_ in p.links]
 if not any(f.scheme=='https' and f.hostname in (u.hostname,'assets.squishyguide.com') and slug in f.path and re.search(r'\.(pdf|zip)$',f.path,re.I) for f in files):return None,'Matching printable file link missing'
 text=' '.join(p.text)+' '+p.meta.get('og:title','')
 if not re.search(r'무료|free',text,re.I):return None,'Free access needs review'
 p.title=title
 return p,None
