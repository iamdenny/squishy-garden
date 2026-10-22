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
