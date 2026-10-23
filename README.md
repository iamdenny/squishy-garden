# Squishy Garden · 말랑모아

Multilingual paper squishy pattern discovery, original A4 printables, browser-local search and favorites.

- Site: https://squishy.iamdenny.com
- Languages: Korean, English, Japanese
- Stack: dependency-free Node.js static generation and browser ES modules; GitHub Pages + the public GitHub raw CDN
- Run: `npm run verify`, `npm run dev` (127.0.0.1:4347)
- Collector tests: `python3 -m unittest discover -s tests -p '*_test.py'`

## Keeping it current

GitHub Actions refreshes the catalog every day at **06:23 Asia/Seoul** (21:23 UTC). GitHub may delay scheduled runs. The collector reads public listing pages from the approved Hyeriming catalog in three languages, discovers pagination, adds new templates and updates titles/links. It checks 12 rotating detail pages per run and the two other curated source pages. A successful check records `src/freshness.json`.

Each validated refresh commits the current catalog JSON and its source records to `main`. Pages fetch the public file at `https://raw.githubusercontent.com/iamdenny/squishy-garden/main/public/catalog.json` directly in the visitor's browser. The endpoint currently permits cross-origin reads and advertises a five-minute cache; after GitHub publishes an update, visitors normally see it within that cache window without a site rebuild or redeploy. GitHub schedule and CDN propagation are not guaranteed to run at an exact minute.

The site validates the response before rendering and keeps its embedded snapshot available if the network or GitHub is unavailable. New listings open a same-site information and preparation page first; the creator page is the final handoff. Search results, filters and favorites work locally in the browser. Search text is not sent to the catalog source.

The daily collector uses serial requests, a one-second interval, timeouts, retries, a page-count budget and a 20% disappearance guard. Any fetch/validation failure preserves the last good catalog. Only validated data changes are committed. No scheduled LLM usage, paid API, Cloudflare Worker, KV namespace, API token or custom DNS record is needed for catalog freshness.

SEO detail pages and the sitemap are rebuilt weekly, or immediately for a source-code change. The daily live catalog can be newer than the set of statically indexable detail pages until that next rebuild. Coverage is limited to configured providers. Listing checks do not prove that every download works, that its terms have not changed, or that the entire internet is covered. Prices and licenses remain authoritative on creator sites.

## Rights and analytics

Original template SVGs: CC BY 4.0. External files/images are not redistributed; catalog illustrations are original thematic artwork, explicitly labeled. Hero artwork is AI-generated studio imagery.

GA4 loads only after adult opt-in. Automatic enhanced measurement is disabled; only curated events are sent without raw search text. Source, analytics, DNS, serving revision, and search indexing are independently verified. See `docs/launch.md` for launch evidence.

## SEO/GEO

Static pages, per-language canonical/hreflang links, structured data, visible source attribution, sitemap, robots and llms.txt. These make content accessible to crawlers; they do not guarantee ranking or AI citation. Search Console submission is tracked separately.

## Operations

Use `ghr` for all GitHub CLI operations (`ghr.profile=iamdenny`). GitHub Actions handles releases from `main`. Revert a bad commit to roll back; verify `/release.json`, `/catalog.json`, and the custom-domain HTTPS response after deployment. GitHub disables scheduled workflows in inactive public repositories after 60 days, so monitor the daily Actions run and freshness timestamp.
