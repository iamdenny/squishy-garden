import importlib.util,unittest
s=importlib.util.spec_from_file_location('collect','scripts/collect.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
class CollectorTest(unittest.TestCase):
 def test_links_sets_and_pagination(self):
  p=m.Listing();p.feed('<a href="/ko/print/squishySet0026/"><img alt="Set"></a><a href="/ko/squishy/page/14/">Last</a>')
  self.assertEqual(p.pages,14);self.assertEqual(p.items['squishySet0026']['title'],'Set')
 def test_large_drop_and_missing_translation_fail(self):
  with self.assertRaises(RuntimeError):m.validate_rows([],list(range(239)))
  with self.assertRaises(RuntimeError):m.validate_rows([{'id':'a','title':{'ko':'test'}}]*150,[])

from unittest.mock import patch
class SourceIsolationTest(unittest.TestCase):
 def test_transient_failure_preserves_last_good_metadata(self):
  row={'id':'test','urls':{'ko':'https://example.com/pattern'},'thumbnail':'https://example.com/old.png','checkedAt':'2026-01-01'}
  with patch.object(m,'allowed_get',side_effect=TimeoutError()):check=m.check_extra(row)
  self.assertEqual(check['status'],'unverified');self.assertEqual(row['checkedAt'],'2026-01-01');self.assertEqual(row['thumbnail'],'https://example.com/old.png')
 def test_not_found_differs_from_access_denied(self):
  for code,status in [(404,'unavailable'),(410,'unavailable'),(403,'unverified'),(429,'unverified')]:
   row={'id':'test','urls':{'ko':'https://example.com/pattern'}}
   with patch.object(m,'allowed_get',side_effect=m.HTTPError(row['urls']['ko'],code,'failure',{},None)):self.assertEqual(m.check_extra(row)['status'],status)
 def test_recovery_updates_timestamp(self):
  row={'id':'test','urls':{'ko':'https://example.com/pattern'},'health':{'status':'unavailable'}}
  with patch.object(m,'allowed_get',return_value='<h1>Pattern</h1>'):self.assertEqual(m.check_extra(row)['status'],'reachable')
  self.assertEqual(row['checkedAt'],m.TODAY)

class ConfirmationHistoryTest(unittest.TestCase):
 def test_missing_timeout_then_recovery(self):
  row={'id':'test','urls':{'ko':'https://example.com/pattern'}}
  with patch.object(m,'allowed_get',side_effect=m.HTTPError(row['urls']['ko'],404,'missing',{},None)):m.check_extra(row)
  self.assertEqual(row['health']['lastConfirmedStatus'],'unavailable')
  with patch.object(m,'allowed_get',side_effect=TimeoutError()):m.check_extra(row)
  self.assertEqual(row['health']['status'],'unverified')
  self.assertEqual(row['health']['lastConfirmedStatus'],'unavailable')
  with patch.object(m,'allowed_get',return_value='<h1>Pattern restored</h1>'):m.check_extra(row)
  self.assertEqual(row['health']['lastConfirmedStatus'],'reachable')
 def test_legacy_missing_and_initial_failure(self):
  for previous,expected in [({'status':'unavailable','checkedAt':'2026-01-01'},'unavailable'),({},None)]:
   row={'id':'test','urls':{'ko':'https://example.com/pattern'},'health':previous}
   with patch.object(m,'allowed_get',side_effect=TimeoutError()):m.check_extra(row)
   self.assertEqual(row['health'].get('lastConfirmedStatus'),expected)
   if expected:self.assertEqual(row['health']['lastConfirmedAt'],'2026-01-01')

if __name__=='__main__':unittest.main()
