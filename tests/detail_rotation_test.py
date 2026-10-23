import unittest,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from collect import detail_sample

class DetailRotationTests(unittest.TestCase):
 def test_same_day_runs_advance_and_eventually_cover_catalog(self):
  rows=[{'id':str(i).zfill(3)} for i in range(25)]
  seen=set()
  for hour in (6,18,19):
   selected=detail_sample(rows)
   self.assertEqual(len(selected),12)
   if hour==18:self.assertFalse(seen.intersection(r['id'] for r in selected))
   seen.update(r['id'] for r in selected)
   for row in selected:row['detailCheckedAt']=f'2026-10-23T{hour:02}:00:00+00:00'
  self.assertEqual(len(seen),25)
 def test_missing_invalid_legacy_and_recent_dates(self):
  rows=[{'id':'recent','detailCheckedAt':'2026-10-23T18:00:00+00:00'},
        {'id':'legacy','detailCheckedAt':'2026-10-22'},
        {'id':'missing'},{'id':'invalid','detailCheckedAt':'broken'}]
  self.assertEqual([r['id'] for r in detail_sample(rows)],['invalid','missing','legacy','recent'])
  self.assertEqual(detail_sample([]),[])
