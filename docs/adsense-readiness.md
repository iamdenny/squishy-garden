# AdSense ownership preparation

Prepared on 2026-10-23 for the existing Denny publisher `ca-pub-3539037484563455`.
The parent `iamdenny.com` site is under review; this is not approval or serving evidence.

`site.json` owns the public publisher identifier. The build writes its matching
seller line to `/ads.txt` and an ownership meta tag to indexable localized pages.
No Google ad script, display unit, automatic ad setting or CMP is activated.
Print-only and noindex pages remain outside the verification metadata insertion.
The existing advertising and analytics choices are unaffected.

The parent domain must delegate this subdomain in its own ads.txt. Retain its
existing seller records and other subdomains. Before activation, confirm the
parent site is Ready in this publisher account, obtain site-specific display
units, review applicable consent and privacy settings, and evaluate the audience
and child-directed-content requirements for this craft catalog. Adult analytics
opt-in does not itself establish AdSense eligibility or a certified Google CMP.

Run `npm run verify`; it checks metadata and seller agreement on generated
indexable pages and rejects inadvertent Google ad scripts. After deployment,
check `/release.json`, `/ads.txt`, and `/ko/`, `/en/`, `/ja/` independently.

Sources:
- https://support.google.com/adsense/answer/7584263?hl=en
- https://support.google.com/adsense/answer/12171612?hl=en
