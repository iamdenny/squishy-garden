"""Make stale or failed refreshes visible as a failed Actions run after saving data."""
import json,sys
from pathlib import Path
from datetime import datetime,timezone

def problems(state,discovery,now=None):
 now=now or datetime.now(timezone.utc);issues=[]
 for field in ['lastSuccessfulCheck','lastAttempt']:
  try:
   stamp=datetime.fromisoformat(state[field].replace('Z','+00:00'))
   age=(now-stamp).total_seconds()
   if age>72*3600 or age < -3600:issues.append(field+' is stale or invalid')
  except (KeyError,TypeError,ValueError):issues.append(field+' missing or invalid')
 if state.get('primaryStatus')!='reachable':issues.append('Primary collection failed; previous catalog preserved')
 if not discovery:issues.append('No discovery source checks')
 for source in discovery:
  try:age=(now-datetime.fromisoformat(source['checkedAt'].replace('Z','+00:00'))).total_seconds()
  except (KeyError,ValueError,TypeError):age=float('inf')
  if source.get('status')!='reachable' or age>72*3600:issues.append('Discovery requires attention: '+source['sourceId'])
 return issues

def main():
 state=json.loads(Path('src/freshness.json').read_text());checks=json.loads(Path('data/discovery-health.json').read_text())
 issues=problems(state,checks)
 for issue in issues:print('::error::'+issue)
 print('Freshness check:', 'FAILED' if issues else 'healthy')
 sys.exit(bool(issues))
if __name__=='__main__':main()
