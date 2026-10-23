"""Fail closed before uploading a deployment that exceeds local cost limits."""
import json,os,sys,urllib.request
from pathlib import Path
MIB=1024*1024
SITE_LIMIT=50*MIB
ARTIFACT_LIMIT=150*MIB
CATALOG_LIMIT=2*MIB

def check_sizes(site_bytes,catalog_bytes,artifact_bytes=0):
 if site_bytes>SITE_LIMIT:raise RuntimeError('Site exceeds 50 MiB; keep the current deployment')
 if catalog_bytes>CATALOG_LIMIT:raise RuntimeError('Catalog exceeds 2 MiB; keep the published snapshot')
 if artifact_bytes+site_bytes+MIB>ARTIFACT_LIMIT:raise RuntimeError('Projected repository artifacts exceed 150 MiB; wait for retention expiry')

def stored_artifacts():
 repo=os.environ['GITHUB_REPOSITORY'];token=os.environ['GITHUB_TOKEN'];total=0
 if repo!='iamdenny/squishy-garden':raise RuntimeError('Unexpected repository')
 for page in range(1,21):
  req=urllib.request.Request(f'https://api.github.com/repos/{repo}/actions/artifacts?per_page=100&page={page}',headers={'Authorization':'Bearer '+token,'Accept':'application/vnd.github+json'})
  with urllib.request.urlopen(req,timeout=20) as response:data=json.load(response)
  for artifact in data['artifacts']:
   if not artifact['expired']:total+=artifact['size_in_bytes']
  if len(data['artifacts'])<100:return total
 raise RuntimeError('Artifact inventory exceeds inspection budget')

def main():
 root=Path('dist');size=sum(p.stat().st_size for p in root.rglob('*') if p.is_file());catalog=(root/'catalog.json').stat().st_size
 artifacts=stored_artifacts() if '--remote' in sys.argv else 0
 check_sizes(size,catalog,artifacts)
 print(json.dumps({'siteBytes':size,'catalogBytes':catalog,'storedArtifactBytes':artifacts,'siteLimitMiB':50,'projectedArtifactLimitMiB':150}))
if __name__=='__main__':main()
