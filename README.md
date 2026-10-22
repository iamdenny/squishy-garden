# Squishy Garden · 말랑모아

Multilingual paper squishy pattern discovery, original A4 printables, browser-local search and favorites.

- Site: https://squishy.iamdenny.com
- Languages: Korean, English, Japanese
- Stack: dependency-free Node.js static generation and browser ES modules; GitHub Pages
- Run: `npm run verify`, `npm run dev` (127.0.0.1:4347)
- Collector tests: `python3 -m unittest discover -s tests -p '*_test.py'`

## Keeping it current

GitHub Actions runs every day at **06:23 Asia/Seoul** (21:23 UTC). GitHub may delay scheduled runs. The same workflow can be dispatched with `refresh=true`.

The collector reads public listing pages from the approved Hyeriming catalog in three languages, discovers pagination, adds new templates and updates titles/links. It checks 12 rotating detail pages per run and the two other curated source pages. A successful check records `src/freshness.json`, exposed publicly and on the catalog page.

Robots directives, serial requests, a one-second interval, timeouts, retries, a page-count budget and a 20% disappearance guard protect collection. Any fetch/validation failure aborts the update and preserves the existing public site. Only validated data changes are committed; the same workflow builds and deploys them. Source failures appear in the Actions run and normal repository workflow notifications. No scheduled LLM usage or paid API is needed.

Coverage is limited to configured providers. Adding a new provider requires an adapter and rights review. Listing checks do not prove that every download works, that its terms have not changed, or that the entire internet is covered. Prices and licenses remain authoritative on creator sites.

## Rights and analytics

Original template SVGs: CC BY 4.0. External files/images are not redistributed; catalog illustrations are original thematic artwork, explicitly labeled. Hero artwork is AI-generated studio imagery.

GA4 loads only after adult opt-in. Automatic enhanced measurement is disabled; only curated events are sent without raw search text. Source, analytics, DNS, serving revision, and search indexing are independently verified. See `docs/launch.md` for launch evidence.

## SEO/GEO

Static pages, per-language canonical/hreflang links, structured data, visible source attribution, sitemap, robots and llms.txt. These make content accessible to crawlers; they do not guarantee ranking or AI citation. Search Console submission is tracked separately.

## Operations

Use `ghr` for all GitHub CLI operations (`ghr.profile=iamdenny`). GitHub Actions handles releases from main. Revert a bad commit to roll back; verify `/release.json` and the custom-domain HTTPS response after deployment. GitHub disables scheduled workflows in inactive public repos after 60 days; successful daily data-check commits keep this repository active, and Actions should still be monitored.
