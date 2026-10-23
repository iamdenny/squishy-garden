import sys,unittest
from datetime import datetime,timezone,timedelta
sys.path.insert(0,'scripts')
import catalog_growth as g
from check_freshness import problems

TITLE='고양이 스퀴시 무료 도안'
HTML=f'<meta property="og:title" content="{TITLE}"><meta property="og:image" content="https://example.com/preview.jpg"><div class="contents_style"><p>도안은 개인 용도로 사용하세요.</p><figure class="imageblock" data-origin-width="2480" data-origin-height="3508"></figure></div>'
class GrowthTest(unittest.TestCase):
 def candidate(self):return {'id':'123','sourceId':'test','title':TITLE,'url':'https://example.com/1','status':'pending_review'}
 def test_requires_source_title_and_printable_inside_article(self):
  self.assertIsNotNone(g.eligible(self.candidate(),HTML)[0])
  for html in [HTML.replace(TITLE,'스퀴시 후기'),HTML.replace('contents_style','sidebar'),HTML.replace('2480','480'),HTML.replace('도안은','유료 도안 구매는')]:
   self.assertIsNone(g.eligible(self.candidate(),html)[0])
 def test_free_claim_must_be_in_post_title(self):
  row=self.candidate();row['title']='고양이 스퀴시 후기'
  self.assertIsNone(g.eligible(row,HTML)[0])
 def test_approved_only_dedup_rejections_budget_and_failure(self):
  source=[{'id':'test','creator':'Creator','feed':'https://example.com/rss','autoPublish':True}]
  row=self.candidate();published,count=g.promote([row],[],source,lambda _:HTML)
  self.assertEqual(len(published),1);self.assertEqual(row['status'],'published');self.assertEqual(published[0]['rights'],'source-only')
  self.assertEqual(len(g.promote([row],published,source,lambda _:HTML)[0]),1)
  for status in ['rejected','published']:
   row=self.candidate();row['status']=status
   self.assertEqual(g.promote([row],[],source,lambda _:HTML)[1],0)
  self.assertEqual(g.promote([self.candidate()],[],[],lambda _:HTML)[1],0)
  self.assertEqual(g.promote([self.candidate()],[],source,lambda _:HTML,budget=0)[1],0)
  row=self.candidate()
  def fail(_):raise TimeoutError()
  self.assertEqual(g.promote([row],[],source,fail)[0],[]);self.assertEqual(row['status'],'pending_review')
 def test_unknown_host_is_never_fetched(self):
  row=self.candidate();row['url']='https://other.example/1'
  self.assertEqual(g.promote([row],[],[{'id':'test','feed':'https://example.com/rss','autoPublish':True}],lambda _:self.fail('Fetched unapproved host'))[1],0)
class FreshnessTest(unittest.TestCase):
 def test_stale_failure_and_missing_checks_are_visible(self):
  now=datetime.now(timezone.utc);stamp=now.isoformat();state={'lastSuccessfulCheck':stamp,'lastAttempt':stamp,'primaryStatus':'reachable'};checks=[{'sourceId':'test','status':'reachable','checkedAt':stamp}]
  self.assertEqual(problems(state,checks,now),[])
  self.assertTrue(problems(state,checks,now+timedelta(days=4)))
  self.assertTrue(problems({**state,'primaryStatus':'unverified'},checks,now))
  self.assertTrue(problems(state,[],now))
if __name__=='__main__':unittest.main()

class RecheckTest(unittest.TestCase):
 def test_changed_free_claim_becomes_unknown_then_recovers(self):
  import collect
  from unittest.mock import patch
  row={'id':'test','title':{'ko':TITLE},'urls':{'ko':'https://example.com/1'},'access':'free','verification':{'method':'approved-feed-and-article-v1'}}
  for html,expected in [(HTML.replace(TITLE,'고양이 스퀴시 유료 도안'),'unknown'),(HTML,'free')]:
   with patch.object(collect,'allowed_get',return_value='<h1>Pattern</h1>'+html):collect.check_extra(row)
   self.assertEqual(row['access'],expected)
 def test_unknown_character_is_not_assumed_food(self):
  self.assertEqual(g.category('허기워기 스퀴시 무료도안'),'play')
