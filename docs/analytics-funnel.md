# Print discovery funnel

Added 2026-10-23. Events require both the existing adult confirmation and analytics consent; advertising consent is independent. No search text, local filename, uploaded file content, or query string is sent by these custom handlers. Page locations contain only origin and pathname.

| Event | Trigger | Main parameters |
| --- | --- | --- |
| `catalog_search` | Search submit or debounced text input | `results_count`, `has_results`, `access_filter`, `craft_type`, `printable_filter` |
| `catalog_filter` | Printable-original checkbox change | `printable_filter`, `results_count` |
| `pattern_view` | A static detail loads or a live detail successfully resolves, once per page | `pattern_id` |
| `original_open` | Creator-hosted verified JPG opened or own original SVG download clicked | `pattern_id`, `file_index` for JPG or `print_source: template` for SVG |
| `print_attempt` | A usable image invokes the browser print dialog | `pattern_id` where known, `print_source` (`preview`, `template`, `local_files`), local `page_count` |
| `creator_visit` | Creator article handoff | `pattern_id` |

`print_attempt` replaces the ambiguous `print_template` event. It does not prove paper was printed or a PDF saved. Printing after leaving for the creator's JPG is outside our measurement boundary. Own SVG clicks also retain the existing `file_download` event; do not sum it with `original_open` as separate conversions.

Use event names in GA4 funnel exploration: catalog_search → pattern_view → original_open. Analyze print_attempt separately, since in-site printing and external-original opening are alternative paths. Custom parameter breakdowns require event-scoped custom dimensions in GA4; the code release itself does not configure dashboard dimensions or prove receipt in Google reporting; see the subsequent account verification below. Event counts become useful after consented visits arrive. See [Google's event parameter documentation](https://developers.google.com/analytics/devguides/collection/ga4/event-parameters).

## Printable filter

`?printable=verified` works with search, category, creator, saved items and existing filters. It selects our own original templates plus approved creator original-file metadata, excluding sources confirmed unavailable. A thumbnail alone never qualifies. Static and live cards use the same predicate, and live catalog updates recompute results. At rollout, 39 entries qualify: 8 own templates and 31 creator listings. This is availability evidence at last check, not a permanent guarantee about the source.

## Validation

Node tests cover consent denial, revocation, detail-view deduplication, query-free custom event locations, original-open separation, failed-image print prevention, and intersecting filters. Browser checks cover URL restoration, combined search, reset, and the eight-file live detail. Google reporting receipt and physical printing are distinct from these implementation checks.

## Account verification — 2026-10-23 12:34 UTC

GA4 property 560105322 now has three event-scoped custom dimensions saved and read back in the owner UI: 도안 ID (`pattern_id`), 인쇄 방식 (`print_source`), 원본 인쇄 필터 (`printable_filter`). Existing analytics/ad consent preferences were not changed.

A controlled production visit searched for butter, opened the butter detail and followed its original JPG link. Realtime visibly received `catalog_search: 1`, `pattern_view: 1`, `original_open: 1`. These are QA visits, not organic acquisition or conversion growth. Realtime showed one active user.

Print-button testing on the preview and own strawberry template hit browser automation timeouts while invoking print. Test tabs were closed; no physical print was submitted. `print_attempt` was not visible in the final realtime snapshot, so its end-to-end Google receipt remains unverified. Existing unit coverage is not a substitute for this outstanding provider readback. No synthetic events were injected to manufacture receipt.

## Bounded print dispatch

Print buttons now allow the GA event queue to finish processing via `event_callback` before invoking the blocking print dialog. An independent 800 ms fallback opens printing even if the tag is blocked or never calls back; visitors without analytics consent print immediately. Repeated clicks during the wait and late callbacks cannot open duplicate dialogs. This improves dispatch opportunity, not a guarantee of delivery or a physical-print completion signal. See [Google control parameters](https://developers.google.com/tag-platform/gtagjs/reference/parameters) and [MDN print blocking behavior](https://developer.mozilla.org/en-US/docs/Web/API/Window/print).
