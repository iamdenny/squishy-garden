import unittest,sys
from unittest.mock import patch
sys.path.insert(0,'scripts')
import quota_guard as q
import collect
class QuotaTest(unittest.TestCase):
 def test_limits_fail_closed(self):
  q.check_sizes(31*q.MIB,240*1024,80*q.MIB)
  for sizes in [(51*q.MIB,1,0),(1,3*q.MIB,0),(31*q.MIB,1,120*q.MIB)]:
   with self.assertRaises(RuntimeError):q.check_sizes(*sizes)
 def test_request_budget_prevents_network(self):
  with patch.object(collect,'request_count',collect.REQUEST_LIMIT),patch.object(collect.urllib.request,'urlopen') as network:
   with self.assertRaises(collect.BudgetExceeded):collect.request('https://example.com')
   network.assert_not_called()
if __name__=='__main__':unittest.main()
