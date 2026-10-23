# Squishy Garden · 말랑모아

Multilingual paper squishy pattern discovery, original A4 printables, browser-local search and favorites.

- Site: https://squishy.iamdenny.com
- Languages: Korean, English, Japanese
- Stack: dependency-free Node.js static generation and browser ES modules; GitHub Pages + a read-only Cloudflare Workers/KV catalog API
- Run: `npm run verify`, `npm run dev` (127.0.0.1:4347)
- Collector tests: `python3 -m unittest discover -s tests -p '*_test.py'`

## Keeping it current

GitHub Actions refreshes the catalog every day at **06:23 Asia/Seoul** (21:23 UTC). GitHub may delay scheduled runs. Catalog refreshes update `public/catalog.json` without redeploying the SEO pages; the Cloudflare Worker copies the validated snapshot into KV at **08:30 Asia/Seoul** (23:30 UTC). SEO detail pages and the sitemap are rebuilt weekly, or immediately for a source-code change.

The collector reads public listing pages from the approved Hyeriming catalog in three languages, discovers pagination, adds new templates and updates titles/links. It checks 12 rotating detail pages per run and the two other curated source pages. A successful check records `src/freshness.json`, exposed publicly and on the catalog page.

Robots directives, serial requests, a one-second interval, timeouts, retries, a page-count budget and a 20% disappearance guard protect collection. Any fetch/validation failure preserves the last good catalog. Only validated data changes are committed. Source failures appear in the Actions run and normal repository workflow notifications. No scheduled LLM usage or paid API is needed.

The public API is `GET /v1/catalog` on the Worker `workers.dev` hostname. It reads one KV snapshot and allows browser access from `squishy.iamdenny.com`; `GET /healthz` reports Worker liveness. The daily refresh Worker reads only the public repository's generated `public/catalog.json`; no Cloudflare token is stored in GitHub. Missing or invalid source data never overwrites the last good snapshot. Set the GitHub repository variable `CATALOG_API_URL` to the deployed HTTPS endpoint so the site can read the live catalog. Until that variable is set, the pages use their embedded static catalog.

To deploy the Worker from a Cloudflare-authenticated machine:

1. Create a KV namespace named `CATALOG` with Wrangler and replace the placeholder namespace ID in `wrangler.jsonc`.
2. Run `npx wrangler deploy` from this repository, then set the `CATALOG_API_URL` repository variable to the printed `/v1/catalog` endpoint.
3. Seed the namespace once with the current generated catalog, then verify `/healthz` and `/v1/catalog` before enabling the site variable.

The free plan covers 100,000 Worker requests and 100,000 KV reads per day; KV also includes 1,000 writes per day and 1 GB. The daily refresh writes at most one catalog key. Requests and KV reads fail at the free quota instead of silently switching to paid usage. Static pages remain usable if the API is unavailable.

Coverage is limited to configured providers. Adding a new provider requires an adapter and rights review. Listing checks do not prove that every download works, that its terms have not changed, or that the entire internet is covered. Prices and licenses remain authoritative on creator sites.

## Rights and analytics

Original template SVGs: CC BY 4.0. External files/images are not redistributed; catalog illustrations are original thematic artwork, explicitly labeled. Hero artwork is AI-generated studio imagery.

GA4 loads only after adult opt-in. Automatic enhanced measurement is disabled; only curated events are sent without raw search text. Source, analytics, DNS, serving revision, and search indexing are independently verified. See `docs/launch.md` for launch evidence.

## SEO/GEO

Static pages, per-language canonical/hreflang links, structured data, visible source attribution, sitemap, robots and llms.txt. These make content accessible to crawlers; they do not guarantee ranking or AI citation. Search Console submission is tracked separately.

## Operations

Use `ghr` for all GitHub CLI operations (`ghr.profile=iamdenny`). GitHub Actions handles releases from main. Revert a bad commit to roll back; verify `/release.json`, `/catalog.json`, the Worker API, and the custom-domain HTTPS response after deployment. GitHub disables scheduled workflows in inactive public repos after 60 days; successful daily data-check commits keep this repository active, and Actions should still be monitored.
