import importlib.util,unittest
s=importlib.util.spec_from_file_location('collect','scripts/collect.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
class CollectorTest(unittest.TestCase):
 def test_links_sets_and_pagination(self):
  p=m.Listing();p.feed('<a href="/ko/print/squishySet0026/"><img alt="Set"></a><a href="/ko/squishy/page/14/">Last</a>')
  self.assertEqual(p.pages,14);self.assertEqual(p.items['squishySet0026']['title'],'Set')
 def test_large_drop_and_missing_translation_fail(self):
  with self.assertRaises(RuntimeError):m.validate_rows([],list(range(239)))
  with self.assertRaises(RuntimeError):m.validate_rows([{'id':'a','title':{'ko':'test'}}]*150,[])
if __name__=='__main__':unittest.main()
