import sys,unittest,json,contextlib,io
from pathlib import Path
sys.path.insert(0,'scripts')
import discover as d
class DiscoveryTest(unittest.TestCase):
 def test_canonical_variants_and_tracking(self):
  self.assertEqual(d.canonical_url('http://tingkka.tistory.com/m/109/?utm_source=a#top'),d.canonical_url('https://tingkka.tistory.com/109'))
  self.assertNotEqual(d.canonical_url('https://example.com/post?id=1'),d.canonical_url('https://example.com/post?id=2'))
 def test_naver_post_identity_preserves_distinct_posts(self):
  expected='https://blog.naver.com/ddanycrafts/223534089948'
  for url in [expected,'http://m.blog.naver.com/ddanycrafts/223534089948?referrerCode=1','https://blog.naver.com/PostView.naver?blogId=ddanycrafts&logNo=223534089948&redirect=Dlog','https://m.blog.naver.com/PostView.nhn?logNo=223534089948&blogId=ddanycrafts']:
   self.assertEqual(d.canonical_url(url),expected)
  self.assertNotEqual(d.canonical_url(expected),d.canonical_url(expected[:-1]+'9'))
  self.assertNotEqual(d.canonical_url(expected),d.canonical_url(expected.replace('ddanycrafts','another')))
  self.assertIn('PostView.naver',d.canonical_url('https://blog.naver.com/PostView.naver?blogId=ddanycrafts'))
  self.assertIn('PostView.naver',d.canonical_url('https://example.com/PostView.naver?blogId=ddanycrafts&logNo=223534089948'))
 def test_catalog_has_no_duplicate_source_identity_across_entries(self):
  seen={}
  for filename in ['src/catalog-external.json','src/catalog-extra.json']:
   for row in json.loads(Path(filename).read_text()):
    for url in row['urls'].values():
     key=d.canonical_url(url)
     self.assertIn(seen.get(key),[None,row['id']],key)
     seen[key]=row['id']
 def test_only_matching_same_source_http_links(self):
  xml='<rss><channel><item><title>스퀴시 무료도안</title><link>https://tingkka.tistory.com/110</link></item><item><title>스퀴시 후기</title><link>https://evil.example/1</link></item><item><title>스퀴시</title><link>javascript:alert(1)</link></item><item><title>일기</title><link>https://tingkka.tistory.com/111</link></item></channel></rss>'
  rows=d.parse_feed(xml,d.SOURCES[0]);self.assertEqual(len(rows),1);self.assertEqual(rows[0]['status'],'pending_review')
 def test_dedup_published_and_preserve_review_decisions(self):
  xml='<rss><channel><item><title>스퀴시</title><link>https://tingkka.tistory.com/109?utm_source=rss</link></item></channel></rss>'
  rows,checks=d.refresh([], [{'urls':{'ko':'https://tingkka.tistory.com/109'}}],lambda _:xml)
  self.assertEqual(rows,[])
  old=[{'url':'https://tingkka.tistory.com/109','status':'rejected','firstSeenAt':'2026-01-01'}]
  rows,_=d.refresh(old,[],lambda _:xml);self.assertEqual(rows[0]['status'],'rejected');self.assertEqual(rows[0]['firstSeenAt'],'2026-01-01')
 def test_failure_does_not_drop_previous_candidates(self):
  old=[{'url':'https://tingkka.tistory.com/109','status':'pending_review'}]
  def fail(_):raise TimeoutError()
  with contextlib.redirect_stdout(io.StringIO()):rows,checks=d.refresh(old,[],fail)
  self.assertEqual(rows,old);self.assertTrue(all(c['status']=='unverified' for c in checks))
if __name__=='__main__':unittest.main()
