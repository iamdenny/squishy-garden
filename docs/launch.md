# Launch and operations

- Site: https://squishy.iamdenny.com/ko/
- Repository: https://github.com/iamdenny/squishy-garden
- DNS: DNSEver CNAME `squishy` → `iamdenny.github.io`
- Hosting: GitHub Pages Actions; approved TLS certificate and HTTPS enforcement verified 2026-10-22 UTC.
- Languages: Korean, English, Japanese.
- Catalog: 249 entries (8 original foldable cube nets, 241 source links). External patterns are not rehosted. This is a selected-source catalog, not exhaustive internet coverage.
- Originals: six 50 mm faces, seven numbered glue tabs, solid cut lines and dashed fold lines, A4 color and coloring SVGs. Browser and geometry checked; physical print/assembly remains untested.

## Discovery and analytics

Google Search Console domain property `sc-domain:iamdenny.com` successfully read the HTTPS sitemap on 2026-10-22 and discovered 759 pages. Discovery is not indexing or ranking proof.

GA4 property `560105322`, web stream `16182123748`, measurement ID `G-BEW0F8CYXF`. Enhanced measurement is disabled. Analytics loads only with adult opt-in; raw search terms are not sent. Public ingestion verified in GA4 Realtime: one test active user, one page_view, first_visit and session_start for the Korean homepage on 2026-10-22 UTC. This is test traffic, not organic acquisition.

Canonical URLs, reciprocal hreflang, server-rendered content, JSON-LD, robots.txt, sitemap.xml and llms.txt are generated. These support discovery; AI citation and search ranking are not guaranteed.

## Daily maintenance

GitHub Actions runs at 21:23 UTC / 06:23 Asia/Seoul daily (GitHub may delay scheduled jobs). Run `Refresh, verify and deploy` manually with `refresh=true` for an immediate refresh.

The collector respects robots directives, limits requests, discovers pagination, deduplicates entries, checks all three translations, rotates 12 detail checks and probes the two additional sources. Major shrinkage or collection failure keeps the existing public catalog intact. Successful changes commit and deploy in the same run. Review Actions failures and `freshness.json` for operational health. No recurring paid LLM/API is required.

## Validation and recovery

`npm run verify` checks search/provenance/net geometry, builds all pages, and validates metadata and local links. Python collector tests cover parsing and fail-closed validation. Desktop and 390px mobile search, saved items and language switching were checked in Chrome.

The final readback job verifies the served commit and HTTPS endpoints. To roll back, revert the relevant content commit and let the push workflow deploy. To pause collection, disable the schedule in `.github/workflows/deploy.yml`; manual deploy remains available.

## Initial production evidence

Release `c9b1571f21ab3e3dbc7fd22201f209a8d1568143` served over valid HTTPS. Workflow run [39798876480](https://github.com/iamdenny/squishy-garden/actions/runs/39798876480) passed build, deployment and public readback. HTTP redirects to HTTPS.

Manual refresh run [39799039646](https://github.com/iamdenny/squishy-garden/actions/runs/39799039646) successfully collected, tested and committed revision `e2239b644b49f66ab8efdfb50b4d47add797ba84`. Collection completed at 2026-10-22T14:56:21Z with 239 listings and 12 rotating detail checks. Check that run's deployment/readback jobs for final rollout status.

The manual refresh deployment subsequently completed successfully. Public HTTPS readback confirmed revision `e2239b644b49f66ab8efdfb50b4d47add797ba84` and all locale, sitemap and freshness endpoints. Thus collection → validation → automatic commit → deployment → public readback has been exercised end to end. Documentation-only commits use `[skip ci]`; the serving revision intentionally identifies the last application/catalog deployment.

## Discovery refresh, 2026-10-23 KST

251 entries now include 243 creator-hosted preview URLs. No external image binaries or pattern files are stored in this repository. External cards and hero previews open creator sources directly; a separate Details link retains provenance and indexed information. Daily collection refreshes previews, including expiring source preview URLs, and preserves first discovery dates. Six localized collection pages add crawlable character/topic entry points. Search includes character aliases in Korean/English/Japanese and recently-added ordering. A visible warning appears after 72 hours without a successful catalog check. New source availability and preview refresh were exercised locally; 783 indexable pages passed metadata/link validation.

## Promotions, 2026-10-23 KST

Added three labeled, localized cross-promotion cards for tools.iamdenny.com, games.iamdenny.com and modutt.kr, with campaign UTM parameters. GA4 `promotion_click` records partner and placement only when analytics consent is present. No ads are emitted on print/noindex or privacy/about routes.

Coupang channel `https://squishy.iamdenny.com` was saved and read back after reload. The owner explicitly authorized the provider's compliance confirmation. The provider issued `https://link.coupang.com/a/h3OyC5PWkm` for the observed “스퀴시 만들기 재료” search destination. The Korean-only static card includes the provider's commission disclosure and sponsored/nofollow relationships, with no ad SDK, iframe or provider image loaded. Registration and link issuance do not establish final approval or payout readiness; provider review screenshot remains a separate step. The site remains a free discovery/printing service with incidental advertising and no checkout.

2026-10-23: Added a device-local multi-image A4 print studio (PNG/JPG/WebP, up to 12 images, 15MB each), per-sheet removal and browser Print/Save PDF. Original templates can switch between color and coloring versions. Browser print preview confirmed two selected test images produce two pages; no physical printer test performed. Creator PDFs remain opened in their PDF viewer; creator previews are not presented as print-ready source files. Added official top/left/right banner placements alongside existing bottom banners; print routes exclude advertisements.

Coupang placement expansion: the existing issued supplies affiliate URL now appears in the top preparation strip, external-pattern supply checklist, and existing bottom supplies card. Every placement has the affiliate disclosure and sponsored/nofollow attributes; no affiliate scripts load. Placement names are recorded only for visitors who consent to analytics. Print pages contain no promotions.
