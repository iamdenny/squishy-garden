import sys,unittest
sys.path.insert(0,'scripts')
from public_sources import SOURCES,parse_listing,eligible_listing
from catalog_growth import promote
from unittest.mock import patch

class PublicSourcesTest(unittest.TestCase):
 def test_listing_deduplicates_and_rejects_unrelated_external_and_script_links(self):
  html=''.join(f'<a href="{u}">{t}</a>' for u,t in [('/worksheets/squishy-01-1','곰 스퀴시'),('/worksheets/squishy-01-1','곰 스퀴시'),('https://other.test/worksheets/squishy-02-2','스퀴시'),('/worksheets/maze-01','스퀴시'),('/worksheets/squishy-03-3?track=x','스퀴시')])
  rows=parse_listing(html,SOURCES[0]);self.assertEqual(len(rows),1);self.assertEqual(rows[0]['url'],'https://dorandoan.com/worksheets/squishy-01-1')
  with self.assertRaises(ValueError):parse_listing('<html>login</html>',SOURCES[0])
 def test_requires_item_specific_file_and_heading_and_free_evidence(self):
  row={'sourceId':'doran','url':'https://dorandoan.com/worksheets/squishy-01-1'}
  html='<h1>곰 스퀴시</h1><meta property="og:title" content="무료 도안"><meta property="og:image" content="https://dorandoan.com/img.png"><a href="/worksheets/squishy-01-1.pdf">PDF</a>'
  self.assertIsNotNone(eligible_listing(row,html)[0])
  for invalid in [html.replace('squishy-01-1.pdf','another.pdf'),html.replace('무료','유료'),html.replace('곰 스퀴시','곰 후기'),html.replace('/worksheets/squishy-01-1.pdf','https://evil.test/squishy-01-1.pdf')]:self.assertIsNone(eligible_listing(row,invalid)[0])
  self.assertIsNone(eligible_listing({**row,'url':'https://evil.test/worksheets/squishy-01-1'},html)[0])
 def test_sources_share_global_review_budget(self):
  sources=[{'id':s,'creator':s,'feed':'https://'+s+'.test/rss','autoPublish':True} for s in ['a','b']]
  queue=[{'id':str(i)+s,'sourceId':s,'title':'스퀴시','url':f'https://{s}.test/{i}','status':'pending_review'} for s in ['a','b'] for i in range(5)]
  seen=[]
  def fetch(url):seen.append(url);return ''
  promote(queue,[],sources,fetch,budget=2)
  self.assertEqual(seen,['https://a.test/0','https://b.test/0'])
 def test_listing_price_recheck_downgrades_missing_evidence(self):
  import collect
  row={'id':'x','title':{'ko':'곰'},'urls':{'ko':'https://dorandoan.com/worksheets/squishy-01-1'},'access':'free','verification':{'method':'approved-listing-and-file-v1','sourceId':'doran'}}
  with patch.object(collect,'allowed_get',return_value='<h1>곰 스퀴시</h1>'):collect.check_extra(row)
  self.assertEqual(row['access'],'unknown');self.assertIn('lastCheckAttempt',row)

class RotationTest(unittest.TestCase):
 def test_extra_checks_are_bounded_and_advance_after_failure(self):
  from collect import extra_sample
  rows=[{'id':f'item-{i:03}'} for i in range(80)]
  first=extra_sample(rows);self.assertEqual(len(first),24)
  for row in first:row['lastCheckAttempt']='2026-10-23T15:00:00+00:00'
  second=extra_sample(rows)
  self.assertFalse({r['id'] for r in first}&{r['id'] for r in second})

class ListingIdentityTest(unittest.TestCase):
 def test_repeated_discovery_does_not_duplicate_trailing_slash_urls(self):
  import discover
  source=SOURCES[1]
  html='<a href="/en/templates/cat-paper-squishy/">Cat paper squishy</a>'
  with patch.object(discover,'SOURCES',[source]):
   first,_=discover.refresh([],[],lambda _:html)
   second,_=discover.refresh(first,[],lambda _:html)
  self.assertEqual(len(second),1)
  self.assertEqual(second[0]['url'],'https://www.squishyguide.com/en/templates/cat-paper-squishy')
