# Operations check — 2026-10-23

## Catalog and printable files

- 295 entries after adding three source-verified Hyeriming references from the user's image-search example: snack set, juice carton and mild ramen.
- After the successful automated refresh, 19 entries carry creator-declared A4 JPG metadata (26 unique files). Source HTML explicitly provides each `downloadJpg`; no path is guessed and no printable binary is stored/rehosted.
- Detail pages and live-detail pages show original-file links separately from the preview-print button. These links open the creator-hosted JPG; browser/device printing and physical assembly are not certified.
- The existing rotating primary detail check enriches and rechecks originals; supplementary entries are checked on each refresh. Missing declarations remove printable metadata after a successful page check; source failures preserve last-known data and dates.
- Tori Craft candidates require account access; Draw Sewing candidates did not expose the PDF links advertised in their text during this check. Neither was published as a verified printable.

## Search and analytics — actual account readback

- Search Console property: `sc-domain:iamdenny.com`, page filter contains `https://squishy.iamdenny.com/`, Web, last 24 hours (October 22–23): **1 impression, 0 clicks, average position 9**. Last update shown: 3 hours ago. This is one impression, not evidence of a sustained ranking or full indexing.
- The default three-month report stopped at October 21 (before launch), so its zero counts are not used to assess launch performance.
- GA4 property `560105322`, October 16–22: **1 active user, 1 view, 3 events**, Direct channel. Realtime also showed 1 active user when inspected. These may be setup/testing visits; organic acquisition is unproven.
- Public SEO and sitemap validation remains part of `npm run verify`; 927 indexable URLs is the generated URL count, not Google's indexed count.

## Provider account readback

- Reopened the owner browser successfully. GitHub billing budgets for `iamdenny` show Actions and Packages each at **$0.00 / $0.00 spent, Usage blocked**. Existing settings were read, not changed; this verifies the additional paid-usage block, not unrelated subscriptions or domain costs.
- Adsterra website `squishy.iamdenny.com` (6143682) is **Approved**. All five configured banner units (31876491–31876495) are **Active**.
- Adsterra Statistics filtered to this domain, all countries and placements, October 19–23 UTC: **No data**. Approval and active units do not establish actual impressions or revenue.
- Collection run `39941450125` completed successfully in 4m28s with no partial failure. Follow-up deployment `39941972441` succeeded; public readback at `ac31ddf2da8705dd19d460d911eb84dbcd79a9ab` verified 295 entries, 19 original-file entries and 26 original links.
- Existing repository request/time/storage guards remain enabled. No paid server, database or API was introduced.
