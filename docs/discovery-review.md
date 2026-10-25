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

## Broader sources and Pinterest discovery — October 23

Discovery now checks seven RSS feeds (including Leesaem Art) plus two reviewed public historical listings: Doran Doan's Korean squishy category and SquishyGuide's English download list. Listing adapters accept only exact same-origin pattern paths, preserve canonical identity, and cap each listing at 500 candidates. A changed/empty listing fails visibly instead of discarding the queue. The first inspection found 64 and 180 candidates respectively; these are candidates, not 244 approved printable entries.

All automatic publication shares the existing 24-page verification budget per run. Sources are interleaved so one large archive cannot monopolize that budget. Listing publication requires a squishy heading/title, a preview, a free-access statement, and a matching item-specific PDF/ZIP link on the expected origin. Only metadata and source-page links are stored. Newly published items use their original source language; no paid translation API is called. Rechecks downgrade free access to unknown when evidence disappears.

Curated source health checks now rotate through at most 24 oldest-attempted entries per collection run, recording full UTC attempts. This bounds collection work as the catalog grows; a failed page cannot monopolize all attempts. Individual last-confirmed dates remain intact, and only pages actually checked receive a new check date. This replaces the earlier check-every-extra-on-every-run policy. Primary listing collection and its 12-page original-file rotation are unchanged.

Pinterest search is an editorial discovery route, not an exhaustive or unattended Pinterest scraper. A public pin for Heedal's Sanrio donuts led to the creator's Naver article; the original article and its attached downloadable templates were verified, and the catalog retains the pin in `discoveredVia`. Three additional pins remain pending original-source verification. Unresolved pins are not represented as verified free templates. Leesaem's rabbit and 72PAGE's chip-bag article were separately verified and added as source links. Restricted pages are not bypassed. Other public creators can be added through reviewed source adapters; this does not claim coverage of the entire web.


## 500-more discovery pass (2026-10-24 KST)

Starting catalog: 318. This pass adds 308 source-verified entries, for 626 total: 223 further approved listing entries, 54 additional Sowony download products, and 31 Tistory archive articles. Existing source URLs are excluded; a bundle remains one catalog entry, and language/color variants are not multiplied. Sowony access uses the exact product `it_price` value rather than unrelated prices or free-shipping text elsewhere on the page. Archive records require in-article printable evidence and an explicit download/save/print instruction. The catalog stores metadata and source links only.

Another 245 unique Etsy listing IDs were discovered in public paper-squishy market listings marked Digital Download. These are **unverified candidates**, not 245 published patterns: a sampled detail request returned HTTP 403. They remain `pending_review` under `etsy-editorial`, which is not an approved automatic source. Naver RSS and Ko-fi blocked collection; no bypass was used. `data/500-more-results.json` records the exact verified IDs, candidate IDs and the 192-entry shortfall against 500 verified additions. No claim of 500 verified additions is made.

Existing twice-daily approved-source discovery and bounded detail checks remain active. This historical pass does not enable indiscriminate automatic publication of marketplace or Pinterest links. Shared UI translations are emitted as a versioned JavaScript module instead of duplicated in every HTML document; the 50 MiB site guard remains unchanged. Catalog snapshots carry a generation timestamp so an older cached remote catalog cannot replace the newer built-in list after deployment. Source-check timestamps retain their original meaning.


## Continued source review (2026-10-24 KST)

Added 14 individually reviewed SQUISHY IDEA template pages, five Etsy PDF listings and two FindYourFidget projects, bringing the catalog to 647 (329 additions from the 318 baseline; 171 still needed for 500 verified additions). SQUISHY IDEA requires an email on its own site for its currently free PDF downloads. No email was submitted and no file was downloaded. Detail pages disclose this condition in Korean, English and Japanese. The overlapping starter page is excluded.

The SQUISHY IDEA public listing is the tenth bounded discovery source. Automatic promotion requires the same-origin allowed template path, a squishy heading, HTTPS preview, an email input and explicit free-PDF/email-download text. Missing evidence keeps a candidate pending; periodic source checks downgrade the access classification if that evidence disappears. The existing global 24-review budget and request/storage caps remain unchanged.

Five Etsy originals displayed their sellers, paper-squishy PDFs and paid digital-download conditions in Chrome. Related products opened in new tabs; inspecting those tabs recovered three additional verifications after the user reported normal access. Some direct navigations still failed, and one further product tab was denied by the browser URL security policy. That product was not accessed through an alternate route. Remaining Etsy candidates stay unpublished. No blocking setting was disabled. The user-requested butter bundle was subsequently opened and its seller, four PDFs and paid access were verified; its 110 color/design variants count as one bundle. FindYourFidget butter and candy-bag pages were separately verified through their public free PDF links; color, paper-size and language variants count only once per project.

The homepage now emits the same first 24 cards that the interactive UI initially displays, while retaining the complete searchable catalog payload, individual detail pages, category links and sitemap. This removes redundant initial card HTML across three languages without increasing the 50 MiB quota.


## Public printable resources reviewed (2026-10-24 KST)

Squishy Butter offers a browser generator with 100 individually selectable butter wrapper designs and PDF output; it is cataloged as one generator resource to avoid multiplying a single tool. Cubi Mini DIY offers one free three-page bundle with six distinct fan-made squishies and two blind bags; the bundle is cataloged once. Funny Squishy publishes one free two-design dumpling-and-toast sheet; its separate butter sheet overlaps a resource already listed. These three pages state public access and linkable print resources; no source files were copied.

One Little Project's official article links six separately titled, two-page free templates (avocado, cupcake, strawberry, waffle, donut and pizza) and matching creator-hosted previews. Paper Squishy Brazil's official English page labels five one-page sample PDFs free and provides matching previews; its separate paid 100-model bundle is excluded. Each individual PDF is one verified resource. Catalog cards link directly to the original PDF and keep the article as provenance; no files were downloaded or copied.

The owner-opened Etsy butter bundle was rechecked in Chrome: YsnAit lists four paid PDFs, 110 designs in A4 and US Letter editions, and personal/classroom use only. It remains one catalog resource; the listing price is not stored because it can change.

Four Morongborong posts (/12 bag house, /10 bakery cafe, /9 hamburger shop and /8 ice-cream shop) were manually checked for original PDF/ZIP attachments and build instructions. The Tteokbokki post at /6 was already cataloged and the related /7 video post was not counted again. A bounded refresh reached all 10 configured feeds/listings. It also verified the Retro Arcade 3D SquishyGuide page: the creator's asset directory omits the article's `-template` suffix, so the same-origin file check now matches that exact resource stem and can keep publishing it automatically. Its color, coloring, assembly and ZIP variants remain one resource. Pinterest pins stay pending until their creator's printable page is confirmed. This update brought the working catalog to 667 items, with 349 verified additions against the frozen 318 baseline and 151 still needed for the 500-addition goal.


## Etsy listing verified (2026-10-24 KST)

KamsaShop's Halloween Paper Squishy listing was opened through Etsy search and reviewed in Chrome. The seller identifies one paid A4 PDF containing four pages and eight Halloween characters, with front/back designs and print, cut, fold and assembly instructions. The catalog links to the original listing and its Etsy-hosted preview image only; the PDF was not downloaded or copied. This is one bundle. Working totals after that listing were 668 catalog entries, 350 verified additions from the frozen 318 baseline, and 150 still needed for the 500-addition goal. The Etsy editorial queue then had 239 unverified listing candidates remaining.


KamsaShop's Christmas Paper Squishy listing was separately opened from a visible related-item link and reviewed in Chrome. The seller describes ten Christmas characters and two PDFs for A4 and US Letter, with paid instant access. It links to the original Etsy page and seller-hosted preview only; no files were copied. This separate listing counts once. At that stage, working totals were 669 catalog entries, 351 verified additions from the frozen 318 baseline, 149 remaining toward 500, and 238 unverified Etsy candidates.


CraftyFileCo's Halloween paper-squishy listing was reviewed in Chrome. The seller lists ten Halloween designs in colored and coloring versions, mirrored front/back pieces and an assembly instruction page, with two PDFs and one PNG. Access is paid and limited to personal use. The catalog uses the original listing and its Etsy-hosted preview image; no files were copied. This is one bundle. Current working totals: 670 catalog entries, 352 verified additions from the frozen 318 baseline, 148 remaining toward 500, and 237 unverified Etsy candidates.


ItsAllPrintable's Paper Squishy Lunchbox Set listing was opened from Etsy search and reviewed in Chrome. The seller provides one PDF with patterns and step-by-step instructions for a lunchbox, sandwich, drinks, fruit, snacks and stickers, in colored, black-and-white and blank versions. The listing states personal-use-only terms. The catalog links to the Etsy listing and seller-hosted preview; no file was copied. This is one listing. Current working totals: 671 catalog entries, 353 verified additions from the frozen 318 baseline, 147 remaining toward 500, and 236 unverified Etsy candidates.


ItsAllPrintable's Ice Cream Set listing was reviewed in Chrome. The paid PDF covers nine flavors, three cones, three cups, an order card and a tub with lid, with colored, black-and-white and blank versions plus instructions. The seller states personal-use-only terms. It is separate from the lunchbox collection and is counted once. The catalog links to the original Etsy page and its hosted preview only. Current working totals: 672 catalog entries, 354 verified additions from the frozen 318 baseline, 146 remaining toward 500, and 235 unverified Etsy candidates.


ItsAllPrintable's Lasagna & Ravioli listing was reviewed in Chrome. One paid PDF contains an interactive set with ravioli, fillings, layers and casserole-dish pieces, in color and black-and-white versions with instructions. The seller states personal-use-only terms. The catalog points to the original Etsy listing and its seller-hosted preview only. Counted once. Current working totals: 673 catalog entries, 355 verified additions from the frozen 318 baseline, 145 remaining toward 500, and 234 unverified Etsy candidates.


ItsAllPrintable's Interactive Paper Squishy Smushers listing was reviewed in Chrome. One paid PDF contains printable designs with movable pieces, color and black-and-white versions, and assembly instructions; personal printing is permitted. The catalog links to the original Etsy listing and Etsy-hosted preview only. Counted once. Current working totals: 674 catalog entries, 356 verified additions from the frozen 318 baseline, 144 remaining toward 500, and 233 unverified Etsy candidates.


PogeunPaper's Kawaii Sushi Blind Bag listing was reviewed in Chrome. The paid two-PDF kit has color and coloring templates, creative worksheets and a step-by-step video; the seller provides A4 and US Letter printing notes and limits use to personal printing. The catalog links to the Etsy original and seller-hosted preview only. One resource counted. Current working totals: 675 catalog entries, 357 verified additions from the frozen 318 baseline, 143 remaining toward 500, and 232 unverified Etsy candidates.


PartyGecko's Giant Food Paper Squishies listing was found in Etsy search and reviewed in Chrome. The seller describes printable oversized squishies and provides assembly steps; the preview shows five designs: egg toast, watermelon, boba, avocado and peanut. The paid listing supplies two PDFs. The catalog links to Etsy and its seller-hosted preview only. Current working totals: 676 catalog entries, 358 verified additions from the frozen 318 baseline, 142 remaining toward 500, and 232 unverified Etsy candidates.


PartyGecko's K-Pop Paper Squishies listing was reviewed in Chrome. The seller describes five double-sided black-and-white coloring designs for A4; Etsy lists two PDF files and paid digital access. The seller notes some elements were created with AI. The catalog links to the source listing and its Etsy preview only. One resource counted. Current working totals: 677 catalog entries, 359 verified additions from the frozen 318 baseline, 141 remaining toward 500, and 231 unverified Etsy candidates.


PartyGecko's DIY Balloon Paper Squishies listing was reviewed in Chrome. The paid two-PDF kit contains five printable designs with a balloon-and-filling construction method and assembly instructions. The catalog links only to the original Etsy page and its hosted preview. Counted once. Current working totals: 678 catalog entries, 360 verified additions from the frozen 318 baseline, 140 remaining toward 500, and 230 unverified Etsy candidates.


STeacherPrints' Axolotl Paper Squishy listing was reviewed in Chrome. It has four pre-colored characters with front/back pieces and instructions; two PDFs provide the same designs in A4 and US Letter, six landscape pages each. The seller discloses AI-assisted illustrations. The catalog links to the original Etsy listing and its hosted preview only. Counted once. Current working totals: 679 catalog entries, 361 verified additions from the frozen 318 baseline, 139 remaining toward 500, and 229 unverified Etsy candidates.


STeacherPrints' Spa Paper Squishy listing was reviewed in Chrome. It contains four themed designs with front/back pieces, a four-page US Letter PDF and an illustrated assembly guide; Etsy lists three PDF files. The catalog links to the original listing and its hosted preview only. Counted once. Current working totals: 680 catalog entries, 362 verified additions from the frozen 318 baseline, 138 remaining toward 500, and 228 unverified Etsy candidates.


STeacherPrints' separate Bath Bomb Spa Squishies listing was opened from the seller's linked original spa set and reviewed in Chrome. It contains four new designs—bath bomb, perfume, nail polish and sleep mask—with front/back pieces, assembly instructions and A4/US Letter PDFs. AI assistance is disclosed. The catalog links to the Etsy listing and hosted preview only. Counted once. Current working totals: 681 catalog entries, 363 verified additions from the frozen 318 baseline, 137 remaining toward 500, and 228 unverified Etsy candidates.


KikPaperCo's Kawaii Animal Paper Squishies listing was found in Etsy's animal search and reviewed in Chrome. It contains 28 distinct animals with front/back pieces, A4 printing, cutting guides and instructions; the same designs come in color and black-and-white versions. Etsy lists three PDFs. The paid listing limits use to personal projects. The catalog links to the original Etsy page and its hosted preview only. One bundle counted. Current working totals: 682 catalog entries, 364 verified additions from the frozen 318 baseline, 136 remaining toward 500, and 228 unverified Etsy candidates.


KikPaperCo's Sweet Treats Paper Squishies listing was found in Etsy search and reviewed in Chrome. The paid bundle has 28 sweet-treat designs in color and black-and-white, matching front/back pieces, 14 printable sheets and assembly instructions. The seller limits use to personal projects. The catalog links to the original Etsy listing and its hosted preview only. Counted once. Current working totals: 683 catalog entries, 365 verified additions from the frozen 318 baseline, 135 remaining toward 500, and 228 unverified Etsy candidates.


Artfulhabit's Japanese food cat paper squishies listing was found in Etsy animal search and reviewed in Chrome. The seller describes 24 designs with front/back pieces and four PDFs: full-color and color-your-own editions for A4 and US Letter, 14 pages each. Paid digital download; personal use only and redistribution prohibited. The catalog links to the original Etsy listing; no files or artwork were copied. Counted once. Current working totals: 684 catalog entries, 366 verified additions from the frozen 318 baseline, 134 remaining toward 500, and 227 unverified Etsy candidates.


STeacherPrints' Mini Grocery paper squishy listing was reviewed in Chrome. It contains four colored front/back designs—milk, cereal, jam and honey—with an assembly page; two PDFs provide six landscape pages each for US Letter and A4. Paid instant download, with AI-assisted illustrations disclosed. The catalog links to the Etsy original only. Counted once; no files copied. Current working totals: 685 catalog entries, 367 verified additions from the frozen 318 baseline, 133 remaining toward 500, and 226 unverified Etsy candidates.


RaycraftBySarah's Christmas Paper Squishy listing was found in Etsy search and reviewed in Chrome. The single US Letter PDF has 20 pages: 10 color and 10 black-and-white pages for the same 30 festive character designs, with matching fronts and backs. The seller describes Santa, gingerbread friends and winter animals. Paid instant download. Counted once; no file copied. Current working totals: 686 catalog entries, 368 verified additions from the frozen 318 baseline, 132 remaining toward 500, and 226 unverified Etsy candidates.


LittleJoyyCo's tech-themed paper squishy listing was found in Etsy animal search and reviewed in Chrome. The paid ZIP describes four A4, 300-DPI designs (phone, earbuds and case, instant camera, and smartwatch) plus an instruction guide. The seller allows personal, classroom and homeschool use and prohibits products for sale. The catalog links to Etsy only. Counted once; no files copied. Current working totals: 687 catalog entries, 369 verified additions from the frozen 318 baseline, 131 remaining toward 500, and 225 unverified Etsy candidates.


LittleJoyyCo's fast-food paper squishy listing was reviewed in Chrome. The paid A4 ZIP includes an instruction guide and 12 individually named templates (burger, sandwiches, fried chicken, fries, hotdog, mozzarella sticks, nachos, onion rings, soda and pizza). Its headline says 26 templates, while the detail names 12; the catalog uses the named count. Personal, classroom and homeschool use only. Counted once; no files copied. Current working totals: 688 catalog entries, 370 verified additions from the frozen 318 baseline, 130 remaining toward 500, and 224 unverified Etsy candidates.


LittleJoyyCo's flip-phone paper squishy listing was found among the seller's related products and reviewed in Chrome. The paid ZIP contains three A4, 300-DPI template pages and a step-by-step instruction guide. The seller allows personal, classroom and homeschool use and prohibits products for sale. It is a separate flip-phone design from the previously listed phone, earbuds, camera and smartwatch set. Counted once; no files copied. Current working totals: 689 catalog entries, 371 verified additions from the frozen 318 baseline, 129 remaining toward 500, and 223 unverified Etsy candidates.


LittleJoyyCo's Fruit Paper Squishy listing was reviewed in Chrome. The paid digital ZIP contains eight individually named fruit templates: strawberry, pineapple, dragon fruit, watermelon, mango, lychee, kiwi and pomegranate. The listing also includes materials and adult-supervision notes. The catalog links to Etsy only. Counted once; no files copied. Current working totals: 690 catalog entries, 372 verified additions from the frozen 318 baseline, 128 remaining toward 500, and 222 unverified Etsy candidates.


LittleJoyyCo's breakfast paper squishy listing was found among the seller's related sets and reviewed in Chrome. The paid ZIP lists 11 designs: egg, frying pan, pancakes, cereal, strawberry jam, salt and pepper, butter, orange juice, milk and toast. Its description explains the print, cut, tape, stuff and squish process. The catalog links to Etsy only. Counted once; no files copied. Current working totals: 691 catalog entries, 373 verified additions from the frozen 318 baseline, 127 remaining toward 500, and 221 unverified Etsy candidates.


DiGiTALZShirtNPrints' dumpling paper squishy listing was found in Etsy search and reviewed in Chrome. The paid single A4 PDF contains 20 distinct dumpling designs and is described for printing at 100% scale, cutting, folding and assembling. No additional file or license terms were stated in the reviewed description. The catalog links to the Etsy original only. Counted once; no file copied. Current working totals: 692 catalog entries, 374 verified additions from the frozen 318 baseline, 126 remaining toward 500, and 220 unverified Etsy candidates.


SeoulPencil's Korean Street Food Paper Squishy listing was found in Etsy search and reviewed in Chrome. The paid set has 30 foods in color and coloring versions, matching fronts/backs, a making guide and Korean food guide. Two 24-page PDFs cover A4 and US Letter. Personal/classroom use only, with redistribution prohibited; the seller discloses AI-assisted illustrations. The catalog links to Etsy only. Counted once; no files copied. Current working totals: 693 catalog entries, 375 verified additions from the frozen 318 baseline, 125 remaining toward 500, and 219 unverified Etsy candidates.


EllandOak's five-theme Paper Squishy Doll Craft Bundle was reviewed in Chrome. The paid download includes Rainbow, Ocean, Space, Unicorn and Candy sheets with front/back pieces, side strips, accessories and play scenes; the seller describes cutting, folding and stuffing them. Five PNG files, US Letter. The catalog links to Etsy only. Counted once; no files copied. Current working totals: 694 catalog entries, 376 verified additions from the frozen 318 baseline, 124 remaining toward 500, and 218 unverified Etsy candidates.


PartyGecko's magic glitter squishy listing was found in Etsy search and reviewed in Chrome. The paid two-PDF set has six pre-colored and two black-and-white fantasy designs (decorative bottles, a magic wand and a crystal ball) plus assembly instructions for sealed soap-and-glitter bags. AI-assisted elements are disclosed. The catalog links to Etsy only. Counted once; no files copied. Current working totals: 695 catalog entries, 377 verified additions from the frozen 318 baseline, 123 remaining toward 500, and 217 unverified Etsy candidates.


PartyGecko's glitter bear and cat paper squishy listing was found in the seller's related products and reviewed in Chrome. The paid set contains six pre-colored and two black-and-white designs with instructions for clear liquid-soap and glitter pouches; Etsy lists three PDFs. AI-created design elements are disclosed. The catalog links to Etsy only. Counted once; no files copied. Current working totals: 696 catalog entries, 378 verified additions from the frozen 318 baseline, 122 remaining toward 500, and 216 unverified Etsy candidates.


ChariboArtStudio's Skincare Routine Paper Squishy listing was reviewed in Chrome. It is a paid printable squishy book offered as two ZIP files with high-resolution PDF and JPEG files listed. The description explains printing, taping, cutting, stuffing and assembly, but does not state a design/page count. Personal use only; sharing, resale and commercial use are prohibited. The catalog links to Etsy only. Counted once; no files copied. Current working totals: 697 catalog entries, 379 verified additions from the frozen 318 baseline, 121 remaining toward 500, and 215 unverified Etsy candidates.


CuteThingsByVita's Cute Paper Squishy Blind Bags listing was reviewed in Chrome and rejected from the printable catalog: it sells a physical mystery bag containing one finished squishy and offers no downloadable template or PDF. It was not added. Working totals remain 697 catalog entries and 379 verified additions; 121 remain toward 500, with 214 unverified Etsy candidates.


NERCraftcreations' Gum Paper Squishy listing was reviewed in Chrome. Its paid digital PDF contains four colored wrapper templates and instructions to print, cut, fold and assemble. The visible listing did not state reuse terms. The catalog links to Etsy only. Counted once; no files copied. Current working totals: 698 catalog entries, 380 verified additions from the frozen 318 baseline, 120 remaining toward 500, and 213 unverified Etsy candidates.


NERCraftcreations' Cheese Squishy listing was reviewed in Chrome. The paid PDF contains a yellow cheese template, a color-your-own version and step-by-step instructions; no physical item ships. The visible listing did not state broader reuse terms. The catalog links to Etsy only. Counted once; no files copied. Current working totals: 699 catalog entries, 381 verified additions from the frozen 318 baseline, 119 remaining toward 500, and 212 unverified Etsy candidates.


NERCraftcreations' NeeDoh-style paper squishy listing was reviewed in Chrome. It is a paid download with blue, pink, purple and color-your-own cube templates; Etsy highlights two PDFs while the description names one printable PDF. Personal use only; sharing, resale and redistribution are prohibited. The catalog links to Etsy only and does not imply brand affiliation. Counted once; no files copied. Current working totals: 700 catalog entries, 382 verified additions from the frozen 318 baseline, 118 remaining toward 500, and 211 unverified Etsy candidates.


TileCraftShop's Halloween Paper Squishy listing was reviewed in Chrome. The paid download lists 10 Halloween squishy designs and a separate 15-item printable-activity bonus, plus three PDFs and a ZIP. Only the 10 squishy designs count here. The seller states personal use only unless the shop license says otherwise. Counted once; no files copied. Current working totals: 701 catalog entries, 383 verified additions from the frozen 318 baseline, 117 remaining toward 500, and 210 unverified Etsy candidates.


ArtishaPrintables' 55+ Kawaii Squishy Toy Bundle was reviewed in Chrome. The paid bundle contains colored front/back templates in four US Letter PDFs, with food, animal, technology, space, sweet, fruit and drink themes, plus cutting and assembly guidance. The catalog links to Etsy only. Counted once; no files copied. Current working totals: 702 catalog entries, 384 verified additions from the frozen 318 baseline, 116 remaining toward 500, and 209 unverified Etsy candidates.


TileCraftShop's Christmas Paper Squishy bundle was reviewed in Chrome through the seller's related listing. It contains 20 Christmas squishy designs and five bonus sticker sheets in one paid PDF. The sticker sheets are not counted as squishy designs. The listing explains printing, cutting, folding, filling and assembling, and confirms no physical item ships. Counted once; no files copied. Current working totals: 703 catalog entries, 385 verified additions from the frozen 318 baseline, 115 remaining toward 500, and 209 unverified Etsy candidates.


ArtishaPrintables' five-piece café squishy listing now displays boba tea, donut, fries, cupcake and coffee designs. Its same-seller 55+ bundle covers the same broad themes, so the smaller listing remains pending until its exact designs can be distinguished. It is not counted among verified additions.

TenderCharmCreations' 60+ Paper Squishy Printables listing was reviewed in Chrome. The paid download has matching front/back designs in color and black-and-white, plus a mystery box, checklist and design-your-own activity. The seller limits use to personal projects and requires a commercial license for sales. The catalog links to Etsy only; no files copied. Counted once. Current working totals: 704 catalog entries, 386 verified additions from the frozen 318 baseline, 114 remaining toward 500, and 208 unverified Etsy candidates.

KikPaperCo's 172 Paper Squishies Mega Bundle was reviewed in Chrome. The five collections contain 93 main designs; color and black-and-white versions are separately counted in the advertised 172, alongside two lunch-box versions and skincare accessories. Some designs may overlap the seller's already listed animal and sweet-treat collections, so this remains one distinct bundle source and variants are not multiplied. Personal use only; redistribution is prohibited. The catalog links to Etsy only; no files copied. Current working totals: 705 catalog entries, 387 verified additions from the frozen 318 baseline, 113 remaining toward 500, and 207 unverified Etsy candidates.

KikPaperCo's 28 Paper Squishy Templates listing was reviewed in Etsy search. The paid 2-PDF bundle contains 28 color and black-and-white designs on 14 sheets with front/back pieces and instructions. It may overlap the seller's other 28-design collections; the listing is counted once as a resource. The catalog links to Etsy only; no files copied. Current working totals: 706 catalog entries, 388 verified additions from the frozen 318 baseline, 112 remaining toward 500, and 206 unverified Etsy candidates.

PartyGecko's Squishy Party printable was reviewed in Etsy search. The paid download lists five designs in color and pre-colored versions with assembly steps; the seller discloses AI-created elements. No broader reuse terms were visible. Counted once; no files copied. Current working totals: 707 catalog entries, 389 verified additions from the frozen 318 baseline, 111 remaining toward 500, and 205 unverified Etsy candidates.

TeoDoraColorings' editable chocolate-bar template was reviewed in Etsy search. The paid PDF links to a Canva template and making tutorial, with five hand-drawn flavors: chocolate, matcha, lemonade, cookies-and-cream and blueberry cheesecake. Personal use only unless otherwise stated. The catalog links to Etsy only and copies no files. Current working totals: 708 catalog entries, 390 verified additions from the frozen 318 baseline, 110 remaining toward 500, and 204 unverified Etsy candidates.

PartyGecko's Back-to-School paper squishies were reviewed in Etsy search. The listing names school bus, backpack, book, pencil, water bottle and cookie subjects and offers A4 and US Letter PDFs; its description says six designs while the included-files section says five templates, so the catalog does not infer a design count. AI-assisted elements are disclosed. Counted once; no files copied. Current working totals: 709 catalog entries, 391 verified additions from the frozen 318 baseline, 109 remaining toward 500, and 203 unverified Etsy candidates.

KarciDigital's skincare-themed paper-squishy kit was reviewed in Etsy search. It is a paid letter-size printable listing with two PDFs and print, cut, tape and fill instructions; the reviewed excerpt gives no design count or broader reuse terms. Counted once; no files copied. Current working totals: 710 catalog entries, 392 verified additions from the frozen 318 baseline, 108 remaining toward 500, and 202 unverified Etsy candidates.

HootCafe's Japanese Cafe set was opened from its Etsy page. Five PDFs cover six flavors in color and color-your-own versions, A4 and US Letter layouts, a scale bar and assembly instructions. Personal and classroom use only; redistribution and sales of finished items are prohibited. AI assistance is disclosed. Counted once; no files copied. Current working totals: 711 catalog entries, 393 verified additions from the frozen 318 baseline, 107 remaining toward 500, and 202 unverified Etsy candidates.

DdunddunToy's Hamster House squishy book was opened from Etsy. The paid listing is one PDF, and its preview describes nine activity pages with hamster rooms, food, furniture and cut-out play pieces. Personal use only; commercial use, resale and redistribution are prohibited. Counted once; no files copied. Current working totals: 712 catalog entries, 394 verified additions from the frozen 318 baseline, 106 remaining toward 500, and 202 unverified Etsy candidates.

TutorSpotDesigns' Mushroom Squishy template was reviewed on Etsy. One PDF has a color and black-and-white mushroom with front/back pieces, dashed cut lines and assembly instructions; the listing recommends printing at 100%. Personal and classroom use only; copying and redistribution are prohibited. Counted once; no files copied. Current working totals: 713 catalog entries, 395 verified additions from the frozen 318 baseline, 105 remaining toward 500, and 201 unverified Etsy candidates.

TutorSpotDesigns' Kawaii Food Squishy bundle was opened on Etsy. Its paid one-PDF set has seven food designs in color and black-and-white, matching front/back pieces and assembly instructions. Personal use or one classroom only; resale, sharing, copying and redistribution are prohibited. Counted once; no files copied. Current working totals: 714 catalog entries, 396 verified additions from the frozen 318 baseline, 104 remaining toward 500, and 201 unverified Etsy candidates.

TutorSpotDesigns' Butter, Strawberry & Cheese Box bundle was opened on Etsy. The paid PDF includes pink and yellow salted-butter boxes, strawberry butter and a cheese box, plus black-and-white variants and assembly steps. Personal/classroom use only; redistribution is prohibited. One review reports a download delay although the listing says instant download. Counted once; no files copied. Current working totals: 715 catalog entries, 397 verified additions from the frozen 318 baseline, 103 remaining toward 500, and 200 unverified Etsy candidates.

Mary's Printables' free Paper Squishy Template Maker was reviewed. It offers 24 finished designs (11 food, 7 animals, 6 fun objects) plus two draw-your-own blanks, mirrored fronts/backs, three sizes, A4 and US Letter, and color, color-in and ink-saver output. Personal, home and classroom use are allowed; selling printed sheets is not. Counted as one source; no files copied. Current working totals: 716 catalog entries, 398 verified additions from the frozen 318 baseline, 102 remaining toward 500, and 200 unverified candidates.

Paper Squishy's paid 100-template collection page was reviewed. The Basic pack has two PDFs for 100 main designs across eight themes, with color and color-in versions and front/back pieces. The optional Super Pack adds three 50-template play kits in both versions. Five free sample PDFs from the same seller are already listed separately; variants and sample overlap are not multiplied. The page shows no broader reuse terms. Counted once; no files copied. Current working totals: 717 catalog entries, 399 verified additions from the frozen 318 baseline, 101 remaining toward 500, and 200 unverified candidates.

## Chohwa source review (2026-10-24)

Ten pre-existing zzoangland feed entries were reviewed directly in Chrome: seven distinct Halloween butter-squishy templates (Frankenstein, black cat, pumpkin, ghost, bat candy, mummy and eyeball) and three fruit variants (blueberry, kiwi and passion fruit). Each source article has its own printable image. The creator states personal hobby/craft use only and prohibits commercial use, resale of modified work and unauthorized redistribution. To honor those terms, no source files were copied; the full-pattern thumbnails were removed from these ten catalog rows, and users print from the creator page. Korean, English and Japanese topic tags were added. These rows were already present before the 500-addition pass and are not counted toward its target.

Working totals remain 717 catalog entries; 399/500 verified additions from the frozen 318 baseline; 101 remain. The 200 unverified candidate URLs remain separate from the verified count.

## Etsy bundle reviewed (2026-10-24)

EllandOak's public Etsy listing was opened in Chrome. It offers one paid instant-download PDF with 12 printable 8.5 × 11 inch pages and assembly instructions. The preview shows animal, food, seasonal, dinosaur, ocean, doll and pet themes. Four doll sheets overlap the seller's previously listed five-theme bundle; those overlaps are disclosed and not multiplied. The listing did not state broader reuse terms in the visible description. The catalog links to the Etsy page and its own hosted preview only; no files were copied. This is one separate bundle.

Working totals: 718 catalog entries; 400/500 verified additions from the frozen 318 baseline; 100 remain. 199 candidate URLs are still unverified.

## New Zealand bird set reviewed (2026-10-24)

KiaoraKiwi's Etsy listing was reviewed in Chrome. The paid ZIP contains seven named New Zealand native bird paper-squishy designs, with color and black-and-white editions and A4/US Letter sizes. The seller permits repeated personal printing and says resale as a whole or in pieces is not allowed; the wording is unclear, so broader use terms are not inferred. The catalog links to the original listing and its public preview only. No file was copied; variants count once as one resource.

Working totals: 719 catalog entries; 401/500 verified additions from the frozen 318 baseline; 99 remain. 198 candidate URLs are still unverified.

## Space adventure bundle reviewed (2026-10-24)

PrintableGamesForYou's Etsy listing was reviewed in Chrome. The paid instant download offers 12 distinct space-themed squishy templates in two 13-page US Letter PDFs: pre-colored and color-your-own, with assembly directions. The seller explicitly clarifies that the two editions are the same 12 designs, not 24, and discloses AI assistance in development and listing backgrounds. The seller's shop FAQ permits personal use within one household and teacher classroom use, and prohibits digital or hardcopy distribution to others. The catalog links to the Etsy listing and its public preview only; no files were copied. Counted once.

Working totals: 720 catalog entries; 402/500 verified additions from the frozen 318 baseline; 98 remain. 197 candidate URLs are still unverified.

## Woodland animals set reviewed (2026-10-24)

MagnoraStudio's Etsy listing was reviewed in Chrome. The paid two-PDF set has six separately named animals—fox, bear, raccoon, hedgehog, bunny and deer—with front/back pieces, dotted cut lines and visual assembly instructions. The seller permits reprinting for personal use and recommends 100%/Actual Size; broader reuse terms were not visible. The catalog links to the Etsy listing and its public preview only; no file was copied. Counted once.

Working totals: 721 catalog entries; 403/500 verified additions from the frozen 318 baseline; 97 remain. 196 candidate URLs are still unverified.

## Pumpkin squishy set reviewed (2026-10-24)

PartyPrintsbyCortney's Etsy listing was reviewed in Chrome. The paid set contains eight named pumpkin squishies plus blank design-your-own pumpkins; the seller describes ten squishies total. A4 and US Letter PDFs include full-color and black-and-white pages plus a how-to. Seller terms limit use to personal and classroom use and prohibit sharing or resale. The creator discloses that finished example photos were AI-assisted. The catalog links to the Etsy listing and its public preview only; no files were copied. Counted once.

Working totals: 722 catalog entries; 404/500 verified additions from the frozen 318 baseline; 96 remain. 195 candidate URLs are still unverified.

## Cozy pets bundle reviewed (2026-10-24)

PrintableGamesForYou's Etsy listing was reviewed in Chrome. The paid instant download has 12 distinct pet-themed designs in two US Letter PDFs: pre-colored and color-your-own, each with assembly instructions. The seller discloses AI assistance in development and listing backgrounds. The seller's shop FAQ permits personal use within one household and teacher classroom use, and prohibits digital or hardcopy distribution to others. The catalog links to the Etsy listing and its public preview only; no files were copied. Counted once.

Working totals: 723 catalog entries; 405/500 verified additions from the frozen 318 baseline; 95 remain. 194 candidate URLs are still unverified.

## Christmas treats bundle reviewed (2026-10-24)

TheCultureCaddy's Etsy listing was reviewed in Chrome. The paid set contains 30 front/back holiday-treat templates, six coloring outlines, a guide, supply list and checklist. A4 and US Letter PDFs are format editions of the same bundle, with a ZIP containing both. The seller allows personal, family, classroom and single-workplace printing and prohibits sharing or reselling the PDFs. The catalog links to the original listing and its public preview only; no files were copied. Counted once.

Working totals: 724 catalog entries; 406/500 verified additions from the frozen 318 baseline; 94 remain. 193 candidate URLs are still unverified.

## Ocean animals bundle reviewed (2026-10-24)

PartyPrintsbyCortney's Etsy listing was reviewed in Chrome. The paid two-PDF set has 12 sea-animal squishies across six paired sheets, with color-your-own and ready-colored versions and assembly steps. A4 and US Letter editions are included. The seller allows personal, family, party and classroom printing and prohibits sharing or reselling the files. Finished-squishy examples are disclosed as AI-generated. The catalog links to the original Etsy listing and its public preview only; no files were copied. Counted once.

Working totals: 725 catalog entries; 407/500 verified additions from the frozen 318 baseline; 93 remain. 192 candidate URLs are still unverified.

## Winter friends bundle reviewed (2026-10-24)

PartyPrintsbyCortney's Etsy listing was reviewed in Chrome. The paid set contains 12 winter-themed squishies across six paired sheets, with color-your-own and ready-colored versions, instructions and supply list. Both A4 and US Letter are provided. Seller terms allow personal use only and prohibit file sharing/resale; the artwork and finished examples are disclosed as AI-assisted. The catalog links to the Etsy listing and its public preview only; no files were copied. Counted once.

Working totals: 726 catalog entries; 408/500 verified additions from the frozen 318 baseline; 92 remain. 191 candidate URLs are still unverified.

## Valentine bundle reviewed (2026-10-24)

PartyPrintsbyCortney's Etsy listing was reviewed in Chrome. The paid bundle has 12 Valentine squishies across six paired sheets, with ready-colored and color-your-own versions, instructions, and A4 and US Letter editions. Seller terms allow personal use only and prohibit file sharing/resale; finished example photos are disclosed as AI-generated. The catalog links to the original listing and its public preview only; no files were copied. Counted once.

Working totals: 727 catalog entries; 409/500 verified additions from the frozen 318 baseline; 91 remain. 190 candidate URLs are still unverified.

## Thanksgiving bundle reviewed (2026-10-24)

PrintableGamesForYou's Etsy listing was reviewed in Chrome. The paid bundle has 12 distinct Thanksgiving food and kitchen designs in two US Letter PDFs: pre-colored and color-your-own, with paired fronts/backs and illustrated assembly steps. AI assistance in development and listing backgrounds is disclosed. The seller's shop FAQ permits personal use within one household and teacher classroom use, and prohibits digital or hardcopy distribution to others. The catalog links to the Etsy listing and its public preview only; no files were copied. Counted once.

Working totals: 728 catalog entries; 410/500 verified additions from the frozen 318 baseline; 90 remain. 189 candidate URLs are still unverified.

## New Year bundle reviewed (2026-10-24)

PrintableGamesForYou's Etsy listing was reviewed in Chrome. The paid download contains 12 distinct New Year designs in two 13-page US Letter PDFs: pre-colored and color-your-own, with paired fronts/backs and illustrated assembly steps. AI assistance in development and listing backgrounds is disclosed. The seller's shop FAQ permits personal use within one household and teacher classroom use, and prohibits digital or hardcopy distribution to others. The catalog links to the Etsy listing only; no files copied. Counted once.

Working totals: 729 catalog entries; 411/500 verified additions from the frozen 318 baseline; 89 remain. 188 candidate URLs are still unverified.

## Halloween bundle reviewed (2026-10-24)

Chrome listing review: paid instant download with 12 distinct Halloween designs in two US Letter PDFs, one pre-colored and one color-your-own; paired front/back pieces and illustrated assembly steps. The seller discloses AI assistance in development and listing backgrounds. The seller's shop FAQ permits personal use within one household and teacher classroom use, and prohibits digital or hardcopy distribution to others. Counted once; no files copied. The catalog links to the Etsy listing only; no files copied. Counted once.

Working totals: 730 catalog entries; 412/500 verified additions from the frozen 318 baseline; 88 remain. 187 candidate URLs are still unverified.

## Autumn bundle reviewed (2026-10-24)

Chrome listing review: paid instant download with 12 distinct autumn designs in five US Letter PDFs: four pre-colored parts and one color-your-own file. The listing says 29 pages total because the instruction page repeats across the four parts. Paired front/back pieces and illustrated assembly steps are included. The seller discloses AI assistance in development and listing backgrounds. The seller's shop FAQ permits personal use within one household and teacher classroom use, and prohibits digital or hardcopy distribution to others. Counted once; no files copied. The catalog links to the Etsy listing only; no files copied. Counted once.

Working totals: 731 catalog entries; 413/500 verified additions from the frozen 318 baseline; 87 remain. 186 candidate URLs are still unverified.

## Birthday party bundle reviewed (2026-10-24)

Chrome listing review: paid instant download with 12 distinct birthday-party designs in two US Letter PDFs, one pre-colored and one color-your-own; paired front/back pieces and illustrated assembly steps. The seller discloses AI assistance in development and listing backgrounds. The seller's shop FAQ permits personal use within one household and teacher classroom use, and prohibits digital or hardcopy distribution to others. Counted once; no files copied. The catalog links to the Etsy listing only; no files copied. Counted once.

Working totals: 732 catalog entries; 414/500 verified additions from the frozen 318 baseline; 86 remain. 185 candidate URLs are still unverified.

## Cute cafe bundle reviewed (2026-10-24)

PrintableGamesForYou's Etsy listing was reviewed in Chrome. The paid download has 12 distinct cafe and food designs in two 13-page US Letter PDFs: pre-colored and color-your-own, with paired fronts/backs and illustrated assembly steps. AI assistance in development and listing backgrounds is disclosed. The seller's shop FAQ permits personal use within one household and teacher classroom use, and prohibits digital or hardcopy distribution to others. The catalog links to the Etsy listing only; no files copied. Counted once.

Working totals: 733 catalog entries; 415/500 verified additions from the frozen 318 baseline; 85 remain. 185 candidate URLs are still unverified.


## Kwanzaa bundle reviewed (2026-10-24)

PrintableGamesForYou's Etsy listing was reviewed in Chrome. The paid download contains 12 distinct Kwanzaa designs in two 13-page US Letter PDFs: pre-colored and color-your-own, with paired fronts/backs and illustrated assembly steps. AI assistance in development and listing backgrounds is disclosed. The seller's shop FAQ permits personal use within one household and teacher classroom use, and prohibits digital or hardcopy distribution to others. The catalog links to the Etsy listing only; no files copied. Counted once.

## Christmas bundle reviewed (2026-10-24)

PrintableGamesForYou's Etsy listing was reviewed in Chrome. The paid download contains 12 distinct Christmas designs in two 13-page US Letter PDFs: pre-colored and color-your-own, with paired fronts/backs and illustrated assembly steps. AI assistance in development and listing backgrounds is disclosed. The seller's shop FAQ permits personal use within one household and teacher classroom use, and prohibits digital or hardcopy distribution to others. The catalog links to the Etsy listing only; no files copied. Counted once.

Working totals: 735 catalog entries; 417/500 verified additions from the frozen 318 baseline; 83 remain. 184 candidate URLs are still unverified.


## Under the Sea bundle reviewed (2026-10-24)

PrintableGamesForYou's Etsy listing was reviewed in Chrome. The paid download contains 12 distinct sea-life designs in two 13-page US Letter PDFs: pre-colored and color-your-own, with paired fronts/backs and illustrated assembly steps. The seller discloses AI assistance. The shop FAQ permits one-household personal and classroom use and prohibits digital or hardcopy distribution to others. The catalog links to the Etsy listing only; no files copied. Counted once.

## Girls volleyball bundle reviewed (2026-10-24)

PrintableGamesForYou's Etsy listing was reviewed in Chrome. The paid download contains 12 distinct volleyball and sports designs in two 13-page US Letter PDFs: pre-colored and color-your-own, with paired fronts/backs and illustrated assembly steps. The seller discloses AI assistance. The shop FAQ permits one-household personal and classroom use and prohibits digital or hardcopy distribution to others. The catalog links to the Etsy listing only; no files copied. Counted once.

## Cheer bundle reviewed (2026-10-24)

PrintableGamesForYou's Etsy listing was reviewed in Chrome. The paid download contains 12 distinct cheer-themed designs in two 13-page US Letter PDFs: pre-colored and color-your-own, with paired fronts/backs and illustrated assembly steps. The seller discloses AI assistance. The shop FAQ permits one-household personal and classroom use and prohibits digital or hardcopy distribution to others. The catalog links to the Etsy listing only; no files copied. Counted once.

Working totals: 738 catalog entries; 420/500 verified additions from the frozen 318 baseline; 80 remain. 183 candidate URLs are still unverified.


## Sleepover bundle reviewed (2026-10-24)

KikPaperCo's Etsy listing was reviewed in Chrome. It offers 14 sleepover-themed paper squishies and instant digital files. The description specifies a color PDF and black-and-white PDF with eight pages each, while Etsy metadata reports three PDFs; the discrepancy is recorded without guessing. The seller permits personal use only and prohibits file sharing, redistribution and resale. The catalog links to the listing; no files copied. Counted once.

## Cute food and tech bundle reviewed (2026-10-24)

ElysianTemplates' Etsy listing was reviewed in Chrome. The paid, non-editable 8.5 × 11 inch PDF is described as a 25+ paper-squishy template bundle with front/back designs and an instruction guide. Its preview shows food and technology themes. Personal use only; sharing, resale, redistribution and commercial reproduction are prohibited. The exact total is not stated beyond 25+; counted once. No files copied.

## Kawaii food set reviewed (2026-10-24)

CraftyFileCo's Etsy listing was reviewed in Chrome. The paid set contains 10 named food squishies, each with front/back pieces, dotted cut outlines, a marked filling opening and visual instructions. The seller prohibits resale or redistribution, website uploads, claiming the artwork, and selling copies. The catalog links to the original listing only; no files copied. Counted once.

## Foodie edition reviewed (2026-10-24)

HuxmayPrint's Etsy listing was reviewed in Chrome. One paid PDF contains 10 food designs in colored and black-and-white versions, 20 printable pages total, with assembly instructions. The listing states personal use, with no broader redistribution terms visible. The catalog links to the original listing only; no files copied. Counted once.

Working totals: 742 catalog entries; 424/500 verified additions from the frozen 318 baseline; 76 remain. 179 candidate URLs are still unverified.


## Patamundo mini books reviewed (2026-10-24)

CriativeMundo's Etsy listing offers three interactive fold-up paper mini books featuring capybara, bunny and salamander characters, and says they can also be used as paper-squishy books. The listing description says three PDFs while Etsy metadata reports two. A4 or Letter paper, folding and glue are specified. The seller permits personal and classroom use only and prohibits digital sharing, resale, modification for sale or distribution. One bundle counted; no files copied.

## Sandwich squishy pattern reviewed (2026-10-24)

ItsAllPrintable's paid Etsy PDF includes color, black-and-white and blank sandwich pieces, three bread options and several fillings, plus step-by-step instructions. The seller permits personal use only and prohibits distribution, transfer or sale. The catalog links to the source; no file copied. Counted once.

## Mega food squishy bundle reviewed (2026-10-24)

LittleJoyyCo's listing describes 55+ food-themed templates in five ZIP files. It covers ramen, pizza, burgers, tacos, sushi, fries, donuts, cupcakes, breakfast foods, fruit, snacks and drinks, with print-cut-tape-fill instructions. The seller marks all rights reserved, with no broader re-use permission visible. Counted once as a bundle; no files copied.

Working totals: 745 catalog entries; 427/500 verified additions from the frozen 318 baseline; 73 remain. 176 candidate URLs are still unverified.


## Sweet Shop bundle reviewed (2026-10-24)

StellaMiaFun's Etsy listing has nine named sweet-treat squishies, matching front/back pieces, two bonus coloring pages, and A4/US Letter printing guidance at 100% Actual Size. Personal use only. A second seller listing with the same nine designs and instructions was excluded as a duplicate. No files copied. Counted once.

## Pastel butter set reviewed (2026-10-24)

TeoDoraColorings' paid Etsy set offers five pastel butter squishy designs in a PDF that links to A4/US Letter print files and a video tutorial. Personal use and gifting only; sharing, resale and commercial redistribution are prohibited. The catalog links to the Etsy listing only; no files copied. Counted once.

## Taba paw template reviewed (2026-10-24)

HosannaStyle's paid Etsy download contains one paw-shaped paper-squishy design with colored and color-your-own Letter PDFs, front/back pieces and assembly steps. The seller says personal use only. The catalog links to the source; no files copied. Counted once.

## Skincare play set reviewed (2026-10-24)

KikPaperCo's listing describes 10 skincare activity/template pages plus a cover, with front/back pieces for pretend-play products. Etsy metadata says two PDFs while the description says one. Personal use only; file sharing, copying, resale and redistribution are prohibited. Counted once; no files copied.

## Bible story bundle reviewed (2026-10-24)

CraftyFileCo's paid bundle includes five named Bible-themed black-and-white squishy designs with front/back pieces, A4 and US Letter formats, and 100% printing guidance. No broader reuse terms were visible. Counted once; no files copied.

## Holiday characters set reviewed (2026-10-24)

SuzanneUrbanArt's paid set contains five printable holiday characters: an Easter bunny, Halloween pumpkin, snowman, Valentine bear and St. Patrick's leprechaun hat. Each sheet has instructions for coloring, cutting, joining and lightly filling. The illustrator retains copyright and excludes resale; licensing is offered by the creator. Counted once; no files copied.

A separate Christmas candidate was not counted because the Etsy listing was unavailable.

Working totals: 751 catalog entries; 433/500 verified additions from the frozen 318 baseline; 67 remain. 168 candidate URLs are still unverified.


## Recent Etsy source review (2026-10-24)

- **Halloween character template:** KittenKatStudio listing names six motifs with front/back artwork, print/cut/tape/fill steps and personal/classroom terms. The title says 12 characters but the description names six; cataloged as six motifs.
- **Butter box squishies:** Dane1903 bundle offers six flavors, colored/coloring versions, A4/Letter and fold/glue/fill instructions; personal use only.
- **Sixteen-template bundle:** PrintsofFaithByHana lists 16 squishy templates, optional editable Canva template and A4/Letter; personal/classroom use only.
- **Fall bundle:** EllandOak offers acorn, pumpkin pie, hedgehog, squirrel and apple-cider mug pages with instructions; US Letter PNG. No broader use terms were visible.
- **Halloween 14-design bundle:** Dane1903 lists colored and black-and-white front/back versions, A4/Letter and assembly steps; personal/classroom use only. Etsy file metadata differs from the seller's file description.
- **Lunch-box bundle:** KikPaperCo lists 12 food motifs plus separate folded lunch-box pieces in color and black-and-white; personal use only.

The same-seller Halloween listing at 4597332513 repeats the same six-design description and terms as 4597333727, so it was excluded as a duplicate. Listing 4597086717 was unavailable and excluded. No files were copied.

Working totals: 757 catalog entries; 439/500 verified additions from the frozen 318 baseline; 61 remain. 160 candidate URLs are still unverified.


## More Etsy paper-squishy sources reviewed (2026-10-24)

- WonderFoldPaper: five fast-food designs with front/back, color, 100% printing and assembly guidance; personal/hobby/classroom terms.
- LittleJoyyCo spa role-play set: three product-shaped templates and a guide; all rights reserved.
- BrainyyBoutique: listing image claims 10 templates and two US Letter PDFs, while its text gives few assembly details; retained as one cautiously described source.
- TutorSpotDesigns: 13 named sweets, color/B&W fronts and backs, guide and party/classroom instructions; personal/single-classroom use only.
- STeacherPrints: separate four-design and five-character Halloween sets; counted as distinct bundles because the named designs differ.
- ArtishaPrintables unicorn bundle: 10 designs with assembly guide.
- OviboopPaperArt: five Halloween designs in color and coloring forms; Etsy file metadata conflicts with description.
- PrintNplayCOStore Thanksgiving bundle: six characters and assembly guide.
- HomeMadeSquishyNL seasonal library: separate 50-template autumn and 50-template Christmas bundles, plus a 50-template Italian-food themed bundle. Each is a separate listing, but each bundle counts once. The listing text is Dutch.
- nikkiidesignsshop back-to-school sushi lunch: 11 food designs with size variants and instructions.
- PartyPrintsbyCortney winter set: six characters in color and black-and-white with assembly guide.

A fruit project was excluded because the instructions center on foam/sponge and puff paint rather than paper-folded and paper-filled squishies. No files were copied.

Working totals: 771 catalog entries; 453/500 verified additions from the frozen 318 baseline; 47 remain. 144 candidate URLs are still unverified.


## Additional Etsy sources and overlap review (2026-10-24)

- HerCustomStory advertises 25+ templates in a US Letter PDF, but the text does not enumerate designs and describes the included item singularly; retained with a quantity caveat and counted once.
- JustForMePrints lists 25 full-color front/back templates with print, tape and filling instructions.
- HooksyPatterns lists five A4 food templates with front/back pieces; personal use only.
- EyeOfThePrint lists three paper-cheese flavors with labels and instructions; construction details are sparse.
- DdunddunToy’s Squishy Farm page identifies a printable paper-squishy book PDF and personal-use terms, but does not explain the content; retained as a cautious source link.
- STeacherPrints’ butter bundle contains four designs with A4/US Letter editions and illustrated folding instructions.
- A second LittleJoyyCo food-template page appears to overlap the seller’s already listed 26-template fast-food set; excluded rather than double-counted.

Working totals: 777 catalog entries; 459/500 verified additions from the frozen 318 baseline; 41 remain. 138 candidate URLs are still unverified.


## Korean creator and Pinterest-linked sources reviewed (2026-10-24)

- 햇님유뚜비’s Tistory post describes BT21/Kirby squishy patterns and materials, asks for attribution, and prohibits unauthorized reposting, modification and commercial use.
- morongborong shares a free tteokbokki-shop squishy-book ZIP with a build video. The creator prohibits commercial use and modifications. The file was not downloaded.
- Two Pinterest pins led to creator YouTube pages: Nyang crafts’ transparent Sanrio box video and Yul Teacher’s house/skincare squishy-book video. Both descriptions identify free pattern routes, but link onward to Naver; those downstream pages were not opened, so the catalog keeps the accessible video pages and notes the access limitation.

Working totals: 781 catalog entries; 463/500 verified additions from the frozen 318 baseline; 37 remain. 138 candidate URLs are still unverified.


## New animal, seasonal and mixed bundles reviewed (2026-10-24)

- PartyPrintsbyCortney offers 12 axolotl designs with matching backs in color and coloring versions.
- TheCultureCaddy provides 16 original food and holiday characters with A4/Letter editions and a collection chart.
- GrivoCrafts lists 43 designs across flat squishies, fold-up boxes and a Christmas bonus; a separate eight-design Christmas listing is included in that bundle and was excluded as a duplicate.
- DigitalZooStudioArts advertises 50 colorful pages across animals, treats and fantasy themes, but does not enumerate them or specify paper size.
- ThenextchapterByKara offers 30 Christmas designs plus 3D and puffy variants and three blank design pages.
- Dane1903 offers 19 Halloween-costumed and 19 plain baby animals with fronts/backs and A4/Letter files.

Working totals: 787 catalog entries; 469/500 verified additions from the frozen 318 baseline; 31 remain. 131 candidate URLs are still unverified.


## New product-form and educational bundles reviewed (2026-10-24)

- PackLabStudio advertises a Spanish-language mega kit with a seller-claimed 300+ templates and future updates; designs are not enumerated and the download uses multiple links. Counted once with a quantity caveat.
- ArtishaPrintables provides five fold-and-fill dumpling designs.
- ForJuneStudio’s Halloween butter bar includes four variants; the page conflicts on page count.
- ItsAllPrintable’s viral set lists 33 variations across seven food shapes in color, black-and-white and blank forms.
- szkbcrafts offers a single folded paper ice-cube template.
- NortNestStudio’s back-to-school set includes pencil, notebooks, dice and laptop templates.
- PartyGecko’s bedtime routine book includes six care-item squishies and US Letter/A4 pages.

Working totals: 794 catalog entries; 476/500 verified additions from the frozen 318 baseline; 24 remain. 124 candidate URLs are still unverified.

## Verified 500-addition target reached (2026-10-24 KST)

The catalog now contains 818 entries: 318 in the frozen baseline plus 500 individually verified, unique source additions. During closeout, the same Tistory post was found under both a mobile URL and its already-listed RSS URL. The duplicate mobile record was removed and replaced in the verified-additions tally with ElysianTemplates' separately reviewed paper-squishy listing. The final source review promoted 24 Etsy candidates and added one PartyGecko morning-routine listing from a related-item link; 100 Etsy candidates remain unverified. No listing files or images were copied.

Each bundle counts once, regardless of color, paper-size, language, or file variants. A snack listing whose title says 16 but description specifies 12 designs is recorded as 12; a 24-design bundle with 96 PDF variants is counted once; and a seller's unenumerated “30+” claim is labeled as a seller claim. A4/US Letter support, licensing notes, creator attribution and known AI-assisted design disclosures are recorded only where the product page states them. The additions are local catalog data and have not been deployed.
