# MedOrtho: experience, SEO and revenue plan

Reviewed 17 October 2026. This is an initial code and live landing-page assessment, not a full live-site crawl or an analytics audit. Changes are local and have not been deployed.

## Business direction

Make MedOrtho a useful clinical learning destination in its own right. The repository combines educational notes commerce, MedPosterHub commerce, medical app acquisition, and advertising-supported medical reference pages. The current MedOrtho landing page primarily promotes the Android app; web readers need a direct path to the reference library.

International interest is an opportunity, but revenue depends on actual traffic, advertiser demand, device, consent, viewability and engagement. Medical knowledge has international relevance; clinical protocols and applicability still need context and expert review.

## Initial changes implemented

- Removed invented study populations, diagnostic statistics and calculated likelihood ratios from the article renderer. The original supplied accuracy text is preserved and sanitized; this does not verify that source content is medically correct.
- Removed simulated reader counts and the hardcoded November 2025 revision label.
- Removed automatically generated current-date modification/review claims from the active article metadata, schema helper and article prerender schema. Known update dates remain usable; publication and clinical review dates are not inferred from them.
- Corrected structured breadcrumb category slugs for Wrist & Hand and Ankle & Foot.
- Removed invented equipment and duration from procedure structured data.
- Added a mobile table of contents, contextual educational note and more realistic estimated reading time.
- Removed overlapping custom bottom ad and app promotion bars on MedOrtho routes. Existing inline ads remain. This changes inventory; its revenue impact is unknown until measured.
- Replaced the article's broken iOS email signup (missing client import and simulated success handling) with a browser-library link and coming-soon message.

## Priorities for the next release

| Priority | Evidence / issue | Action and success check |
| --- | --- | --- |
| 1 | Local web database has 292 tests; web directory metadata says 700+. App inventory may be different. | Derive web counts from the dataset; verify app claims independently. |
| 1 | Sources are present, but the renderer had manufactured evidence. | Have a qualified reviewer audit high-traffic articles, attach study-specific citations and accurate reviewer/date records. Never add unverifiable credentials. |
| 1 | Production build has a roughly 1.95 MB JS entry chunk (565 KB gzip). | Split storefront/admin/app routes; measure actual LCP, INP and CLS by device before and after. Bundle size alone is not a field performance score. |
| 1 | Prerender builds simplified HTML separately from React; template contains global structured data. Hosting has a catch-all rewrite. | Verify deployed article HTML and canonical tags with JS disabled; check schema duplication and serving of generated files. Do not assume the rewrite is broken without a deployment test. |
| 2 | Landing page is app-first. | Design a web-first hub with prominent test search, seven body-region links, recently viewed/bookmarked tests and a quieter app CTA. Preserve existing URLs. |
| 2 | Global physics purchase popups and WhatsApp widget also mount on medical routes. | Give MedOrtho a dedicated shell; remove unrelated purchase notifications and keep contact access in navigation/footer. |
| 2 | Ad component reuses a banner slot for fluid in-article output; all units request ads shortly after mount. | Confirm formats in AdSense, use dedicated measurable slots, request only eligible visible-width units, reserve responsive space and test SPA navigation. |
| 2 | Short articles can show three inline ad placements. | Test a smaller content-aware layout against baseline; avoid inserting an ad after only a sentence. Use supported AdSense anchor controls if testing anchors. |
| 3 | Article category lists provide a base for internal linking. | Improve existing region hubs and comparison resources based on actual search queries; add original clinically reviewed explanations rather than near-duplicate keyword pages. |

## Supplied AdSense baseline

The user supplied an AdSense dashboard screenshot during this review. The last-28-days cards show 809 pageviews, $1.27 page RPM, 1.98K impressions, 5 clicks, $0.21 CPC, 0.62% page CTR and $1.03 site earnings. Pageviews are up 256% and page RPM is up 140% against the preceding period, from a small baseline.

Country earnings shown: US $0.45, Canada $0.20, UK $0.04, Colombia $0.03 and Germany $0.03. US plus Canada represent approximately 63% of the displayed site revenue. This does not establish country-specific RPM or traffic share; country pageviews are missing. The user confirmed that ads are shown only on MedOrtho and its child pages, so this revenue is attributable to MedOrtho. Ads were enabled September 15, 2026; the baseline is still early.

The 28-day ad-unit card shows banner $0.47 and multiplex $0.22. A separate 30-day card shows $0.51 and $0.23; do not mix these periods. Revenue totals alone cannot establish which unit is more efficient without impressions and viewability.

Decision: prioritize qualified organic traffic, trustworthy article content and reader retention. Five clicks are too few for a confident placement-performance conclusion. At an unchanged $1.27 page RPM, 10,000 pageviews would yield approximately $12.70 and 100,000 approximately $127; these are arithmetic scenarios, not forecasts. Country mix and advertiser demand can change RPM as traffic grows.

## Measurement and experiments

Obtain the last 28 and 90 days of MedOrtho-only data:

- Search Console: landing pages, queries, countries, devices, clicks, impressions, CTR, indexed/excluded URLs and Core Web Vitals.
- AdSense: estimated revenue, pageviews, page RPM, ad units, Active View viewability, coverage, device and country breakdowns where available.
- Analytics: organic sessions, engaged sessions, related-test navigation and app-download clicks. Verify SPA pageviews before using reports.

Use revenue per 1,000 sessions as a primary business comparison, supported by page RPM, pages per session and engagement. Page revenue = pageviews / 1,000 × page RPM. A higher RPM can still mean lower total revenue if traffic or engagement falls.

Establish a baseline before deployment. Test one placement change at a time with comparable country/device/source traffic. Keep an experiment only when revenue improves without a material usability regression. Choose duration and sample size from actual traffic; a fixed two-week test is not automatically conclusive. Do not manufacture ad clicks or repeatedly refresh live ads during QA.

## Validation and limits

Production bundling passed (`npx vite build`). The Neer Impingement Test route rendered locally; mobile-style table-of-contents expansion and original diagnostic text were checked. No fabricated study table or reader count appeared. This is not full mobile-device, accessibility or medical-content validation.

Full TypeScript validation remains blocked by existing `ios_notifications` schema mismatches in MedAppPage and the unused legacy MedOrthoWikiArticlePage's article type mismatch. The full sitemap/prerender pipeline was not run, to avoid overwriting the user's already modified sitemap files. The prerender script passed syntax validation.

## References

- [Google: helpful, reliable content and health-topic trust](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google: page experience, Core Web Vitals and intrusive ads](https://developers.google.com/search/docs/appearance/page-experience)
- [AdSense: placement best practices](https://support.google.com/adsense/answer/1282097)
- [AdSense: page RPM definition](https://support.google.com/adsense/answer/112030?hl=en)


## Scope correction and implementation — 18 October 2026

The user explicitly limited this release to SEO, UI and ad placement. No edits were made to the medical source dataset or original image files. Further medical-content expansion and illustration replacement are out of scope.

Implemented:

- Route-level lazy loading; main JS entry fell from 1,951 KB to approximately 657 KB uncompressed. Additional route/shared chunks still load; this is not a field Core Web Vitals measurement.
- One canonical and description per rendered page; Helmet ownership now replaces initial metadata during client navigation. Prerendered articles no longer inherit homepage app/FAQ schemas.
- Image dimensions read directly from 301 original WebP files. Article images reserve intrinsic space, receive high fetch priority, and have matching social-image dimensions. MedicalWebPage markup identifies the primary image. Original URLs and pixels are unchanged.
- Wiki sitemap builder deduplicates URLs, preserves real dates, omits fabricated dates and removes deprecated image title/caption sitemap fields. Source sitemaps modified before this task were not overwritten during offline validation; the next normal build regenerates them.
- Found 292 records but 291 unique article slugs. Prerender and sitemap now use the first matching record, consistent with the existing browser route. Neither duplicate record was edited.
- Neurological prerender listing now matches the browser's subcategory filtering.
- Search in the sidebar now submits to the directory and preserves the query in the URL. Search-result pages are noindex/follow with a clean canonical. Invalid nested category routes no longer masquerade as category pages.
- Wider reading area, accessible mobile drawer, skip link, working FAQ expanded state, uncropped image thumbnails, reference footer and no unrelated commerce overlays on MedOrtho.
- First ad follows the clinical body, multiplex follows references, and a middle slot appears only for articles with at least 600 words. This threshold is a layout choice, not a Google requirement or revenue guarantee. Existing slot IDs remain. The banner slot uses its responsive display format rather than being relabeled as a fluid in-article unit.
- Ad units wait until near the viewport with a measurable width; each route gets a fresh unit and re-renders do not refresh ads. Development previews do not request ads. The ad loader starts only on MedOrtho in production. Existing AdSense Auto Ads account settings still apply and must retain their route exclusions if enabled; loading a script in an SPA does not unload it on subsequent route changes.

Validation: production bundling passed; local-only prerender completed; four regression tests cover all 291 article outputs, sitemap deduplication/dates/images and neurological links. Browser checks verified search, single canonical/description, query noindex, drawer close after navigation, and narrow-screen overflow. Intrinsic dimensions were independently checked against Pillow. Full TypeScript validation still reports the pre-existing MedAppPage notification-table typing and legacy article-page type errors. No deployment or live ad experiment was performed.

The prerendered generic clinical paragraphs identified in the audit remain unchanged because the user excluded content edits. This content-parity issue needs a separate content decision; technical metadata fixes alone do not resolve it.
