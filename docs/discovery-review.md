# New-pattern discovery and review

The daily 06:23 Asia/Seoul workflow refreshes the existing catalog and then checks three approved public RSS feeds: Gripipi, Rosazzing and Ryong. Feed URLs are recorded in `scripts/discover.py`; robots rules and the existing request budget apply. The initial live check found nine unpublished candidates, with all three feeds reachable.

`data/discovery-queue.json` contains titles, original links, source publication dates and first/last discovery timestamps. It is an editorial queue, not a public catalog. No full articles or pattern images are copied. Published canonical URLs are excluded; mobile URLs, fragments and tracking parameters are normalized. Existing review decisions survive reruns. A source failure preserves its previous queue and is recorded in `data/discovery-health.json` rather than being mistaken for no new posts.

Review each pending candidate:

1. Open the original page. Confirm it actually provides a printable paper squishy or book pattern, not just a finished product or a review.
2. Check access (free, paid, or unknown), creator attribution, usage terms, preview and any clearly stated format. Do not infer page counts, difficulty or exact assembly instructions.
3. Add the reviewed metadata to `src/catalog-extra.json` using the existing three-language schema. Use a unique stable ID and HTTPS source URL, `rights: source-only`, actual review date, and factual search tags. Keep any external image remote.
4. Run the collector, Python tests and `npm run verify`. On the next discovery run, the candidate becomes `published` automatically when its URL is present in the catalog. For an unsuitable candidate, set `status: rejected` and add a short `reviewNote`; rejection persists on later feed checks.
5. Inspect the generated detail page, commit and deploy, then verify the public release.

This is incremental discovery of the most recent 50 posts in each feed, not an exhaustive historical crawl. Older posts and new creators require separate review. Candidate discovery does not change public prices, translations or availability by itself. Do not claim that every creator's new post is automatically published.

## Source health in discovery

Default discovery ranks confirmed 404/410 sources after other matching patterns. Exact searches and saved items still retain these entries and their detail pages, so saved links do not disappear. Explicit name/newest sorting remains unchanged. A timeout, rate limit or robots restriction does not establish deletion. The collector records the latest attempt separately from `lastConfirmedStatus` and `lastConfirmedAt`; a transient error cannot erase a previous confirmed unavailable state, and a successful source check restores normal ordering. Legacy health records migrate on their next check.

Naver post identities are normalized across desktop/mobile `/{blogId}/{logNo}` and `PostView.naver` / `PostView.nhn` URLs. CI checks source identity uniqueness across both external catalogs. This normalization is used for deduplication only and does not rewrite creator handoff URLs. Naver RSS endpoints for the four reviewed creators exclude this collector in robots rules, so their feeds are not enabled; their registered PostView source pages remain part of individual health checks.

## Twice-daily verified growth (2026-10-23)

Six approved feeds are now checked: the original three plus Sunny Utube, zzoangland and Morongborong. These three new sources have been inspected for creator attribution, original templates and personal-use restrictions. `scripts/catalog_growth.py` permits metadata-only automatic publication for these explicitly enabled sources, at most 24 candidate article checks per run. It requires matching feed/page titles, an explicit free-template claim in the title, squishy relevance, and an attached file or high-resolution A4-shaped image inside the actual article. Paid-template wording blocks publication. Failure or ambiguity preserves `pending_review`; rejected decisions are never reconsidered automatically. Original article and pattern binaries are not stored.

New rows retain their Korean source title in all locale interfaces, marked `titleLanguage: ko` and disclosed on non-Korean detail pages, instead of inventing a translation or calling a paid API. Human editorial translations can replace these later without being overwritten by discovery. Each automatic addition records its verification method and timestamp. Source publication dates remain distinct from catalog addition dates. This is bounded RSS discovery, not an exhaustive historical crawl or a promise of completeness.

Refresh runs at 06:23 and 18:23 Asia/Seoul. Successful refresh workflows trigger the SEO Pages workflow, so newly added pages and sitemap entries no longer wait for the weekly build. The raw JSON is still available without a Pages build. Failed collection saves the previous usable catalog and source health, then fails the workflow visibly. An independent public-readback schedule at 12:47 and 00:47 Asia/Seoul detects a catalog older than 72 hours or failed source checks. `/ko/status/` (also en/ja) fetches live health from the same catalog API, with an explicit saved-status fallback. GitHub schedules can be delayed or disabled; these checks expose failures and do not guarantee uninterrupted scheduling.

All jobs use standard Ubuntu runners in the public repository. Pages artifacts are retained for one day. No paid search, translation, LLM, database or server service was added. Existing domain registration costs are outside this infrastructure setup. Hosting remains subject to GitHub Pages and Actions limits; free infrastructure is not unlimited capacity.

Auto-published rows are rechecked on every collection run. If the original free-template title or printable evidence changes, access becomes `unknown` until the original evidence is restored or an editor reviews it. A network failure preserves the last confirmed metadata and is reported separately. Unrecognized character crafts default to the broad play category instead of being assumed to be food.

## Free-infrastructure guardrails

All three workflows skip execution if the repository becomes private; all runners remain standard `ubuntu-24.04`. Collection is limited to 15 minutes per job. Each Python collector process permits at most 240 HTTP attempts and 64 MiB of response bodies, including retries; an oversized individual response (4 MB) fails rather than being parsed partially. These are workload limits, not a claim that GitHub prices requests individually.

`npm run verify` rejects sites above 50 MiB or catalog JSON above 2 MiB. Before a Pages artifact upload, `quota_guard.py --remote` inventories this repository's non-expired artifacts and rejects a projected total above 150 MiB (using the uncompressed site plus a 1 MiB allowance as a conservative estimate). Inventory errors block uploads. Artifact retention remains one day, with no automatic deletion of existing artifacts. The existing site/data stays available if a collection or deployment limit is hit; automatic growth pauses until size or retention conditions are resolved.

The repository guard does not measure account-wide Actions/Packages storage or accrued billing. On October 23, the owner billing UI for `iamdenny` confirmed account-level Actions and Packages budgets at $0 with `Usage blocked`, protecting against additional paid usage. Existing budgets were not changed. GitHub Pages bandwidth is provider-limited, and the published policy describes throttling/service restrictions rather than automatic paid hosting upgrades. No paid DB, server or API is configured. Paseo collection is an alternative if hosting economics change, but it introduces dependence on the local computer being online and does not by itself enforce a remote database's free quota.

## Detail-check rotation

Primary detail checks select at most 12 entries per run, prioritizing missing or invalid check dates and then the oldest successful check. Full UTC timestamps distinguish same-day runs; legacy date-only records remain supported. This replaces a date-based offset that repeated the same sample twice daily. Existing request and byte ceilings are unchanged. Failed primary batches preserve the previous catalog so they are retried rather than marked checked.
