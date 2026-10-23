import unittest,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from collect import printable_metadata
class PrintableTests(unittest.TestCase):
 def test_explicit_originals_only(self):
  html='A4 '+r'{\"downloadJpg\":\"/downloads/squishy/squishy0145.jpg\"}'
  self.assertEqual(printable_metadata(html,'https://hyeriming.com/ko/print/squishy0145/')['files'],['https://hyeriming.com/downloads/squishy/squishy0145.jpg'])
  self.assertIsNone(printable_metadata(html,'https://example.com/'))
  self.assertIsNone(printable_metadata('A4 <img src="/thumbs/squishy0145.webp">','https://hyeriming.com/ko/print/squishy0145/'))
 def test_untrusted_download_is_rejected(self):
  self.assertIsNone(printable_metadata('A4 {"downloadJpg":"https://evil.test/file.jpg"}','https://hyeriming.com/ko/print/squishy0145/'))
