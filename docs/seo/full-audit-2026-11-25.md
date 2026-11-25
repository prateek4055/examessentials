# Exam Essentials SEO audit — 25 November 2026

## Scope and methodology
Baseline taken before this change against https://examessentials.in and repository prateek4055/examessentials, main. Fetched the live sitemap index and all four child sitemaps, checked every submitted URL, and checked 14 additional route/negative-control URLs. Followed crawlable same-origin HTML links (no additional URLs discovered). This is an initial-HTML HTTP audit, not Googlebot rendering or proof of indexing. CSV contains an individual row for every checked URL. Low word counts are review signals, not Google's minimum word requirement. Duplicate descriptions are snippet-quality issues, not automatic indexing blockers.

## Coverage
- 356 submitted URLs, all returned 200.
- 370 total URLs checked; no fetch failures.
- All 356 submitted URLs had a title, description, matching canonical, one H1 and syntactically valid JSON-LD where supplied.
- 19 submitted URLs share meta descriptions.
- 29 pages have fewer than 100 words in initial HTML, including deliberately short utility pages.
- 10 additional routes inherit the homepage canonical; eight are account/transaction/private/invalid routes, two are public poster support pages.
- No missing alt attributes in fetched HTML; this excludes images added only by JavaScript and does not assess alt quality.

## Prioritized findings
| Priority | Finding / evidence | Correction |
|---|---|---|
| P0 | `/seo-audit-missing-page-20261125` returns 200, homepage title/body/canonical. Catch-all Vercel rewrite sends arbitrary paths to `/index`. | Serve real 404 responses for unknown routes while retaining explicit dynamic application routes. |
| P1 | `/medposterhub/bulk-orders` and `/medposterhub/contact` inherit homepage HTML. Five poster support routes absent from sitemap. | Add public support prerenders, sitemap entries and internal links. |
| P1 | `/neet-app`, account, admin, checkout and success routes initially claim homepage/indexability; private-preview client says noindex only after JS. | Add response-level noindex for private/transaction routes; keep them out of sitemap. |
| P1 | Medical prerender adds universal “validated” and “expert consensus” claims and guessed accuracy prose that are not in the React article. Previous audit says these were removed, but current source contains them again. | Remove template-only medical assertions; retain source article fields. Medical evidence and author/reviewer credentials require editorial review. |
| P1 | Poster Product schema uses stale `poster.price` (499/699/899) while actual price calculator returns 699/899 for matte and higher for other materials. Hardcoded ratings have no demonstrated review source. | Generate offers from actual pricing function; omit unsupported aggregate ratings. |
| P2 | 19 medical pages reuse descriptions because indications alone are used. | Include the actual test title in a shared description function used before and after JS. |
| P2 | 20 poster details expose only 32–45 words and no product imagery/offer markup before JS; poster directory has only 33 words. | Build initial content from typed poster source, actual image, sizes and current prices, and crawlable catalog links. |
| P2 | About/contact/notes landing pages are abbreviated initial-HTML stubs; Class 12 description still says 2025. | Improve initial content parity and crawlable category/product links; remove stale year references. |
| P2 | `/terms` is HTTP 200 with a client redirect and no H1. | Permanent server redirect to `/terms-and-conditions`. |
| Editorial | `/medortho/tests/anterior-cruciate-ligament` has only 23 words in initial HTML. Other concise clinical pages need usefulness and references review. | Complete verified clinical information or exclude placeholders; do not pad pages to a target word count. |

## Search Console and performance
OpenSEO is connected, but no Google account/property is connected as of the baseline. Therefore indexed/excluded counts, Google-selected canonicals, clicks, impressions, query rankings, manual actions and field Core Web Vitals are unverified. Historical repository reports are not current Search Console evidence.
Connect: https://app.openseo.so/p/48fe3768-d76c-4ecf-a1bb-17ae534b1655/search-performance
An additional OpenSEO audit with Lighthouse was requested; its plan caps crawling at 50 pages. This does not replace the complete 356-URL sitemap crawl. Lighthouse is lab evidence, not a field Core Web Vitals pass.

## Indexing strategy
Make every useful, public, canonical page crawlable and discoverable. Do not index administration, accounts, carts, checkouts, confirmations, private previews, empty placeholders or nonexistent URLs. After deployment, recrawl all sitemaps, inspect representative URLs in Search Console and submit the sitemap there. Track eligible pages against Google-selected canonicals and coverage reasons, then compare 28-day page/query performance over time. No implementation can require Google to index or rank every page.

## Limits and remaining review
This baseline is not a backlink database, keyword-volume estimate, manual review of every clinical statement, or accessibility/rendered-mobile audit. No fabricated Semrush score is assigned. Structured-data JSON parsing is not rich-result eligibility validation. Source changes require deployment and a fresh crawl before they can be called live fixes.

## Completed supplementary audit
OpenSEO completed a 50-page sample and 20 Lighthouse runs (ten URLs, desktop and mobile). Its 86 findings include 48 heading-order notices, 25 short-description notices, seven long-title notices, two duplicate-description notices, two thin-page warnings, one long-description notice and the crawl-limit notice. These sample counts must not be extrapolated to the whole site. Full evidence is saved alongside this report.

| Measurement | Baseline result |
|---|---|
| Homepage mobile performance / SEO | 65 / 100; 100 / 100 |
| Homepage mobile LCP / CLS | 9.37 seconds / 0 |
| Sample medical mobile performance | 55–67 / 100 |
| Sample medical mobile LCP | 6.43–9.23 seconds |
| Sample desktop performance | 87–96 / 100 |
| Homepage transferred payload | 14,458 KiB |
| Homepage estimated image savings | 13,191 KiB |

A Lighthouse SEO score of 100 does not establish indexation, high-quality medical content, or rankings. Its “critical” labels include developer diagnostics such as missing source maps, which are not indexing blockers. Homepage large JPEGs (up to 3.46 MB each), third-party ad/analytics scripts and late JavaScript content dominate the performance findings. INP and field CWV remain unmeasured.

Host checks: HTTP redirects 308 to HTTPS. The www host returns 200 rather than redirecting to the canonical non-www host. The repository homepage link `examessentials.vercel.app` returns 404; the working public domain is `examessentials.in`.

## Corrections prepared and verification
These are branch changes, not claimed production changes.

- Added the five public poster-support routes to the sitemap and supplied missing bulk-order/contact initial HTML and links.
- Replaced generic catch-all rewrites with explicit private application rewrites, generated a noindex 404 document, and added permanent `/terms` and www-host redirects. Public CMS URLs are build-generated: publishing new CMS content now requires a successful rebuild before its direct URL is served. Validate Vercel response statuses on preview/production before merging.
- Added initial noindex HTML and response headers for private/account/transaction routes. Checkout and admin functionality still boots the existing React route.
- Shared medical descriptions include test titles; removed template-only validation/expert-consensus prose, fixed skipped related-card heading levels and reserved hero-image dimensions in React.
- Rendered all poster details from the actual typed data, including images, sizes, price tables and Product schema; catalog links expose all posters before JavaScript. Poster prices now share the purchase calculator in both initial HTML and React. Removed unverified aggregate ratings from poster and notes-category structured data and fabricated expiry/shipping estimates for downloadable notes.
- Updated stale NEET 2025 labels and homepage metadata; added published-product links to initial homepage and notes-category HTML.
- Generated 15 WebP catalog/hover thumbnails totaling 1,117,190 bytes, while preserving full-resolution original images on detail pages. New/unavailable images safely fall back to originals. A new build regenerates the map. This is an asset-size improvement, not a measured post-change LCP result.
- Wiki fetch errors now stop sitemap/prerender builds instead of silently omitting published articles.

Production build passed. The standalone TypeScript check reports five existing errors, reproduced unchanged on main (4586f08): two Supabase table typing errors in MedAppPage, missing supabase in MedOrthoArticle, missing app_id in the legacy MedOrtho page, and missing Sparkles in Admin. No new TypeScript errors were introduced. All 16 SEO regression checks passed, including every generated sitemap URL, all poster offers, original medical images and noindex handling. All 355 currently generated sitemap URLs have matching initial canonicals, one H1 and indexable HTML; none shares a description. The difference from the live 356 is **five added support pages minus six pre-existing CMS placeholder blog entries**. The existing content-eligibility rule excludes those ellipsis/empty placeholder posts from the new sitemap and marks their generated pages noindex; their routes remain available. Complete their actual article content to make them eligible again.

### Remaining work that must not be called fixed
- Connect Google Search Console, inspect indexing/canonical reasons, read sitemap status, query/page performance, manual actions and field CWV where available. No Search Console submission or indexing request has been made in this session.
- Deploy reviewed changes, verify redirects/404 and private-route headers on Vercel, recrawl the live site, then rerun mobile Lighthouse. Third-party ads/analytics costs and hydration layout changes remain performance follow-ups.
- Complete the ACL stub and six placeholder blog posts with accurate useful content. Review clinical references, authors/reviewer credentials, overlapping test topics, and any claims such as “#1”, medically accurate, review counts, materials and delivery terms. No clinical information or testimonials were fabricated to fill gaps.
- About/contact/legal initial content is still abbreviated versus React. Full shared SSR would reduce future drift between the two templates. Those concise pages do not need arbitrary word-count padding.
- Backlink quality, competitor keyword gaps and country-specific keyword demand were not measured; this report makes no volume, difficulty or authority-score claims.

## Per-page review
Full machine-readable evidence: `seo-page-audit-2026-11-25.csv` and `seo-page-audit-2026-11-25.json`.

| URL path | Initial words | Findings |
|---|---:|---|
| / | 121 | Baseline checks passed |
| /about | 43 | Under 100 words (review intent) |
| /admin | 121 | Canonical mismatch or count |
| /auth | 121 | Canonical mismatch or count |
| /blog | 262 | Baseline checks passed |
| /blog/best-handwritten-notes-class-12-biology | 261 | Baseline checks passed |
| /blog/class-11-physics-notes-quick-revision | 251 | Baseline checks passed |
| /blog/how-to-score-330-neet-biology | 595 | Baseline checks passed |
| /blog/last-month-revision-strategy-boards | 248 | Baseline checks passed |
| /blog/neet-chemistry-preparation-tips | 261 | Baseline checks passed |
| /blog/why-toppers-use-handwritten-notes | 269 | Baseline checks passed |
| /cart | 121 | Canonical mismatch or count |
| /class-11-notes | 46 | Under 100 words (review intent) |
| /class-12-notes | 41 | Under 100 words (review intent) |
| /contact | 37 | Under 100 words (review intent) |
| /medcardio | 143 | Baseline checks passed |
| /medneuro | 143 | Baseline checks passed |
| /medortho | 122 | Baseline checks passed |
| /medortho/ankle-foot | 739 | Baseline checks passed |
| /medortho/elbow | 557 | Baseline checks passed |
| /medortho/hip | 598 | Baseline checks passed |
| /medortho/knee | 675 | Baseline checks passed |
| /medortho/neurological | 313 | Baseline checks passed |
| /medortho/shoulder | 566 | Baseline checks passed |
| /medortho/special-tests | 2023 | Baseline checks passed |
| /medortho/spine | 658 | Baseline checks passed |
| /medortho/tests/90-90-straight-leg-raise | 369 | Baseline checks passed |
| /medortho/tests/abduction-test-hart-s-sign | 357 | Baseline checks passed |
| /medortho/tests/ac-shear-test-paxinos-sign | 373 | Baseline checks passed |
| /medortho/tests/active-compression-test-o-brien-s | 380 | Baseline checks passed |
| /medortho/tests/adson-s-test | 361 | Baseline checks passed |
| /medortho/tests/alar-ligament-test | 379 | Baseline checks passed |
| /medortho/tests/allen-test-shoulder | 346 | Baseline checks passed |
| /medortho/tests/allen-test-vascular | 393 | Baseline checks passed |
| /medortho/tests/anatomical-snuffbox-tenderness | 382 | Baseline checks passed |
| /medortho/tests/ankle-anterior-drawer-test | 433 | Baseline checks passed |
| /medortho/tests/ankle-clonus-test | 340 | Baseline checks passed |
| /medortho/tests/ankle-posterior-drawer-test | 400 | Baseline checks passed |
| /medortho/tests/ankle-range-of-motion | 395 | Baseline checks passed |
| /medortho/tests/anterior-cruciate-ligament | 23 | Under 100 words (review intent) |
| /medortho/tests/anterior-drawer-test-knee | 398 | Baseline checks passed |
| /medortho/tests/anterior-impingement-test-molloy-bendall | 414 | Baseline checks passed |
| /medortho/tests/anterior-release-test-surprise-test | 362 | Baseline checks passed |
| /medortho/tests/anterior-slide-test | 361 | Baseline checks passed |
| /medortho/tests/apley-s-compression-test | 352 | Baseline checks passed |
| /medortho/tests/apley-s-distraction-test | 351 | Baseline checks passed |
| /medortho/tests/apprehension-and-relocation-test | 350 | Baseline checks passed |
| /medortho/tests/arc-sign | 392 | Baseline checks passed |
| /medortho/tests/babinski-sign | 354 | Baseline checks passed |
| /medortho/tests/barlow-s-test | 342 | Baseline checks passed |
| /medortho/tests/beevor-sign | 366 | Baseline checks passed |
| /medortho/tests/biceps-crease-interval-bci | 364 | Baseline checks passed |
| /medortho/tests/biceps-reflex-test | 367 | Baseline checks passed |
| /medortho/tests/bicipital-aponeurosis-flex-test | 378 | Baseline checks passed |
| /medortho/tests/bounce-home-test | 362 | Baseline checks passed |
| /medortho/tests/boyes-test | 387 | Baseline checks passed |
| /medortho/tests/bragard-test | 362 | Baseline checks passed |
| /medortho/tests/brush-stroke-test-swipe-test | 397 | Baseline checks passed |
| /medortho/tests/buerger-s-test | 393 | Baseline checks passed |
| /medortho/tests/bunnel-littler-test | 370 | Baseline checks passed |
| /medortho/tests/calcaneal-squeeze-test | 423 | Baseline checks passed |
| /medortho/tests/capillary-refill-test | 362 | Baseline checks passed |
| /medortho/tests/carrying-angle-measurement | 344 | Baseline checks passed |
| /medortho/tests/chair-test | 352 | Baseline checks passed |
| /medortho/tests/chest-expansion-test | 361 | Baseline checks passed |
| /medortho/tests/childress-sign-duck-walk-test | 368 | Baseline checks passed |
| /medortho/tests/clunk-test | 344 | Baseline checks passed |
| /medortho/tests/cmc-grind-test | 388 | Baseline checks passed |
| /medortho/tests/coleman-block-test | 399 | Baseline checks passed |
| /medortho/tests/compression-rotation-test | 350 | Baseline checks passed |
| /medortho/tests/coracoid-impingement-sign | 343 | Baseline checks passed |
| /medortho/tests/costoclavicular-syndrome-test-military-brace | 362 | Baseline checks passed |
| /medortho/tests/cotton-test | 367 | Baseline checks passed |
| /medortho/tests/cozen-s-test | 352 | Baseline checks passed |
| /medortho/tests/craig-s-test-ryder-method | 379 | Baseline checks passed |
| /medortho/tests/craniocervical-flexion-test-ccft | 378 | Baseline checks passed |
| /medortho/tests/crank-test | 340 | Baseline checks passed |
| /medortho/tests/cross-body-adduction-test | 338 | Baseline checks passed |
| /medortho/tests/crossed-leg-test | 388 | Baseline checks passed |
| /medortho/tests/crossed-over-lasegue-well-leg-raise | 399 | Baseline checks passed |
| /medortho/tests/crossover-test-arnold | 363 | Baseline checks passed |
| /medortho/tests/deltoid-ligament-test | 407 | Baseline checks passed |
| /medortho/tests/derbolowsky-test | 362 | Baseline checks passed |
| /medortho/tests/dial-test-tibial-external-rotation | 389 | Baseline checks passed |
| /medortho/tests/distraction-test | 372 | Baseline checks passed |
| /medortho/tests/dorsiflexion-compression-test | 412 | Baseline checks passed |
| /medortho/tests/dorsiflexion-maneuver | 372 | Baseline checks passed |
| /medortho/tests/durkan-s-test-carpal-compression | 380 | Duplicate description |
| /medortho/tests/ege-s-test | 345 | Baseline checks passed |
| /medortho/tests/elbow-extension-test | 358 | Baseline checks passed |
| /medortho/tests/elbow-flexion-test | 354 | Baseline checks passed |
| /medortho/tests/elbow-general-examination | 287 | Baseline checks passed |
| /medortho/tests/elbow-lateral-pivot-shift-test | 394 | Baseline checks passed |
| /medortho/tests/elbow-range-of-motion | 366 | Baseline checks passed |
| /medortho/tests/elbow-valgus-stress-test | 404 | Baseline checks passed |
| /medortho/tests/elbow-varus-stress-test | 382 | Baseline checks passed |
| /medortho/tests/elson-test | 368 | Baseline checks passed |
| /medortho/tests/elvey-test-upper-limb-tension-test | 394 | Baseline checks passed |
| /medortho/tests/ely-s-test-duncan-ely | 360 | Baseline checks passed |
| /medortho/tests/empty-can-test-jobe-s | 357 | Baseline checks passed |
| /medortho/tests/external-rotation-recurvatum-test | 369 | Baseline checks passed |
| /medortho/tests/external-rotation-test | 386 | Baseline checks passed |
| /medortho/tests/faddir-test | 359 | Baseline checks passed |
| /medortho/tests/feagin-test | 341 | Baseline checks passed |
| /medortho/tests/femoral-nerve-stretch-test | 371 | Baseline checks passed |
| /medortho/tests/fibular-translation-test | 394 | Baseline checks passed |
| /medortho/tests/figure-eight-measurement | 405 | Baseline checks passed |
| /medortho/tests/finger-extension-test-shuck-test | 374 | Baseline checks passed |
| /medortho/tests/finkelstein-s-test | 367 | Baseline checks passed |
| /medortho/tests/flamingo-test | 338 | Baseline checks passed |
| /medortho/tests/fluctuation-test | 354 | Baseline checks passed |
| /medortho/tests/foot-ankle-general-examination | 320 | Baseline checks passed |
| /medortho/tests/froment-s-sign | 382 | Baseline checks passed |
| /medortho/tests/fulcrum-test | 350 | Baseline checks passed |
| /medortho/tests/functional-hallux-limitus-test | 419 | Baseline checks passed |
| /medortho/tests/gaenslen-s-test | 362 | Duplicate description |
| /medortho/tests/gaenslen-test | 359 | Baseline checks passed |
| /medortho/tests/galeazzi-sign-allis-sign | 380 | Baseline checks passed |
| /medortho/tests/gamekeeper-s-test-ucl-stress | 382 | Baseline checks passed |
| /medortho/tests/garrick-test | 332 | Baseline checks passed |
| /medortho/tests/gillet-s-test-marching-test | 385 | Baseline checks passed |
| /medortho/tests/golfer-s-elbow-test | 350 | Duplicate description |
| /medortho/tests/grip-strength-dynamometry | 379 | Baseline checks passed |
| /medortho/tests/halstead-maneuver | 339 | Duplicate description |
| /medortho/tests/hand-range-of-motion | 360 | Baseline checks passed |
| /medortho/tests/hawkins-kennedy-test | 346 | Duplicate description |
| /medortho/tests/heel-strike-test-anvil-test | 362 | Baseline checks passed |
| /medortho/tests/heel-thump-test | 408 | Baseline checks passed |
| /medortho/tests/hip-general-examination | 284 | Baseline checks passed |
| /medortho/tests/hip-range-of-motion | 361 | Baseline checks passed |
| /medortho/tests/hip-scour-test-quadrant | 370 | Baseline checks passed |
| /medortho/tests/hoffmann-s-sign | 352 | Baseline checks passed |
| /medortho/tests/homans-sign | 389 | Baseline checks passed |
| /medortho/tests/hook-test | 381 | Baseline checks passed |
| /medortho/tests/hoover-test | 381 | Baseline checks passed |
| /medortho/tests/hornblower-s-sign | 340 | Baseline checks passed |
| /medortho/tests/hughston-s-plica-test | 344 | Baseline checks passed |
| /medortho/tests/indentation-test | 348 | Baseline checks passed |
| /medortho/tests/internal-rotation-resistance-stress-test-irrst | 365 | Baseline checks passed |
| /medortho/tests/ischiofemoral-impingement-test | 342 | Baseline checks passed |
| /medortho/tests/jack-test | 421 | Baseline checks passed |
| /medortho/tests/jackson-s-compression-test | 344 | Baseline checks passed |
| /medortho/tests/jeanne-s-sign | 352 | Baseline checks passed |
| /medortho/tests/jerk-test-of-hughston | 385 | Baseline checks passed |
| /medortho/tests/jerk-test-posterior | 348 | Baseline checks passed |
| /medortho/tests/kemp-s-test-quadrant-test | 362 | Baseline checks passed |
| /medortho/tests/kernig-s-sign | 333 | Baseline checks passed |
| /medortho/tests/kim-test | 341 | Baseline checks passed |
| /medortho/tests/knee-general-examination | 289 | Baseline checks passed |
| /medortho/tests/knee-range-of-motion | 348 | Duplicate description |
| /medortho/tests/lachman-test | 398 | Baseline checks passed |
| /medortho/tests/lasegue-drop-test | 367 | Baseline checks passed |
| /medortho/tests/lasegue-test-straight-leg-raise | 399 | Baseline checks passed |
| /medortho/tests/lateral-scapular-slide-test-kibler | 363 | Baseline checks passed |
| /medortho/tests/latissimus-dorsi-length-test | 358 | Baseline checks passed |
| /medortho/tests/leg-length-measurement-true-vs-apparent | 373 | Baseline checks passed |
| /medortho/tests/lever-sign-lelli-s-test | 402 | Baseline checks passed |
| /medortho/tests/lhermitte-sign | 361 | Baseline checks passed |
| /medortho/tests/lichtman-test | 360 | Baseline checks passed |
| /medortho/tests/lift-off-test-gerber-s | 346 | Baseline checks passed |
| /medortho/tests/linburg-comstock-anomaly-test | 381 | Baseline checks passed |
| /medortho/tests/load-and-shift-test | 350 | Baseline checks passed |
| /medortho/tests/log-roll-test | 351 | Baseline checks passed |
| /medortho/tests/loomer-s-posterolateral-rotary-instability-test | 368 | Baseline checks passed |
| /medortho/tests/losee-test | 359 | Baseline checks passed |
| /medortho/tests/lunotriquetral-ballottement-test | 392 | Baseline checks passed |
| /medortho/tests/matles-test | 379 | Baseline checks passed |
| /medortho/tests/maudsley-s-test | 349 | Baseline checks passed |
| /medortho/tests/mccarthy-sign | 336 | Baseline checks passed |
| /medortho/tests/mcconnell-test | 353 | Baseline checks passed |
| /medortho/tests/mcmurray-s-test-lateral | 357 | Baseline checks passed |
| /medortho/tests/mcmurray-s-test-medial | 366 | Baseline checks passed |
| /medortho/tests/medial-plica-test-mital-hayden | 363 | Baseline checks passed |
| /medortho/tests/medial-subtalar-glide-test | 398 | Baseline checks passed |
| /medortho/tests/milking-maneuver | 371 | Baseline checks passed |
| /medortho/tests/mill-s-test | 356 | Baseline checks passed |
| /medortho/tests/modified-milking-maneuver | 375 | Baseline checks passed |
| /medortho/tests/mortons-neuroma-test | 382 | Baseline checks passed |
| /medortho/tests/moving-valgus-stress-test | 384 | Baseline checks passed |
| /medortho/tests/mulder-s-sign | 398 | Baseline checks passed |
| /medortho/tests/murphy-s-sign-lunate | 377 | Baseline checks passed |
| /medortho/tests/navicular-drop-test | 390 | Baseline checks passed |
| /medortho/tests/neer-impingement-test | 366 | Baseline checks passed |
| /medortho/tests/noble-compression-test | 361 | Baseline checks passed |
| /medortho/tests/noyes-flexion-rotation-drawer-test | 384 | Baseline checks passed |
| /medortho/tests/ober-s-test | 392 | Baseline checks passed |
| /medortho/tests/olecranon-manubrium-percussion-test | 362 | Baseline checks passed |
| /medortho/tests/ortolani-s-test | 360 | Baseline checks passed |
| /medortho/tests/ottawa-ankle-rules | 416 | Baseline checks passed |
| /medortho/tests/pain-provocation-test-mimori | 362 | Baseline checks passed |
| /medortho/tests/paper-grip-test | 412 | Baseline checks passed |
| /medortho/tests/passive-pronation-test | 350 | Baseline checks passed |
| /medortho/tests/patellar-apprehension-test-fairbank-s | 361 | Baseline checks passed |
| /medortho/tests/patellar-pubic-percussion-test | 364 | Baseline checks passed |
| /medortho/tests/patellar-tap-ballottement-test | 363 | Baseline checks passed |
| /medortho/tests/patellofemoral-grind-test-clarke-s-sign | 384 | Baseline checks passed |
| /medortho/tests/patrick-s-test-faber | 380 | Baseline checks passed |
| /medortho/tests/pectoralis-major-contracture-test | 349 | Baseline checks passed |
| /medortho/tests/pectoralis-minor-length-test | 368 | Baseline checks passed |
| /medortho/tests/pelvic-drop-test-step-down | 357 | Baseline checks passed |
| /medortho/tests/pelvic-ligament-stress-tests | 366 | Baseline checks passed |
| /medortho/tests/peroneal-tendon-dislocation-test | 417 | Baseline checks passed |
| /medortho/tests/phalen-s-test | 373 | Duplicate description |
| /medortho/tests/piano-key-sign | 365 | Baseline checks passed |
| /medortho/tests/pinch-strength-test | 375 | Baseline checks passed |
| /medortho/tests/pivot-shift-test | 399 | Baseline checks passed |
| /medortho/tests/plica-stutter-test | 353 | Baseline checks passed |
| /medortho/tests/polk-s-test | 363 | Baseline checks passed |
| /medortho/tests/popliteal-angle-test | 340 | Baseline checks passed |
| /medortho/tests/posterior-drawer-test-knee | 379 | Baseline checks passed |
| /medortho/tests/posterior-impingement-sign | 348 | Baseline checks passed |
| /medortho/tests/posterior-labral-tear-test | 352 | Baseline checks passed |
| /medortho/tests/posterior-sag-sign-godfrey-s-test | 378 | Baseline checks passed |
| /medortho/tests/posterolateral-apprehension-test | 368 | Baseline checks passed |
| /medortho/tests/posterolateral-rotatory-drawer-test | 372 | Baseline checks passed |
| /medortho/tests/press-test-sit-to-stand | 389 | Baseline checks passed |
| /medortho/tests/pressure-provocation-test | 353 | Baseline checks passed |
| /medortho/tests/prone-anterior-drawer-test | 437 | Baseline checks passed |
| /medortho/tests/prone-knee-flexion-test | 367 | Baseline checks passed |
| /medortho/tests/prone-lachman-test | 377 | Baseline checks passed |
| /medortho/tests/prone-push-up-test | 352 | Baseline checks passed |
| /medortho/tests/q-angle-measurement | 341 | Baseline checks passed |
| /medortho/tests/quadriceps-active-test | 369 | Baseline checks passed |
| /medortho/tests/ramirez-test | 388 | Baseline checks passed |
| /medortho/tests/rectus-femoris-contracture-test | 372 | Baseline checks passed |
| /medortho/tests/rent-test-transdeltoid-palpation | 358 | Baseline checks passed |
| /medortho/tests/resisted-supination-test | 356 | Baseline checks passed |
| /medortho/tests/reverse-cozen-test | 357 | Duplicate description |
| /medortho/tests/reverse-mill-s-test | 338 | Duplicate description |
| /medortho/tests/reverse-phalen-s-test | 367 | Duplicate description |
| /medortho/tests/reverse-pivot-shift-test-jakob | 376 | Baseline checks passed |
| /medortho/tests/romberg-test | 356 | Baseline checks passed |
| /medortho/tests/roos-test-east | 343 | Duplicate description |
| /medortho/tests/royal-london-hospital-test | 426 | Baseline checks passed |
| /medortho/tests/ruland-biceps-squeeze-test | 381 | Baseline checks passed |
| /medortho/tests/sacral-thrust-sacral-compression | 373 | Duplicate description |
| /medortho/tests/scaphoid-compression-test | 362 | Baseline checks passed |
| /medortho/tests/schober-sign | 365 | Baseline checks passed |
| /medortho/tests/scratch-collapse-test | 363 | Baseline checks passed |
| /medortho/tests/segmental-instability-test | 372 | Baseline checks passed |
| /medortho/tests/semmes-weinstein-monofilament-test | 388 | Baseline checks passed |
| /medortho/tests/sharp-purser-test | 388 | Baseline checks passed |
| /medortho/tests/shin-palpation-test | 397 | Baseline checks passed |
| /medortho/tests/shoulder-abduction-test-bakody | 376 | Baseline checks passed |
| /medortho/tests/shoulder-anterior-drawer-test | 364 | Baseline checks passed |
| /medortho/tests/shoulder-general-examination | 286 | Baseline checks passed |
| /medortho/tests/shoulder-press-test | 366 | Baseline checks passed |
| /medortho/tests/si-joint-compression-test | 374 | Duplicate description |
| /medortho/tests/si-joint-distraction-test | 374 | Duplicate description |
| /medortho/tests/silfverski-ld-test | 398 | Baseline checks passed |
| /medortho/tests/single-leg-heel-raise | 424 | Baseline checks passed |
| /medortho/tests/slocum-test-rotatory-drawer | 391 | Baseline checks passed |
| /medortho/tests/slump-test | 386 | Baseline checks passed |
| /medortho/tests/soto-hall-test | 364 | Baseline checks passed |
| /medortho/tests/speed-s-test | 333 | Baseline checks passed |
| /medortho/tests/spine-range-of-motion | 367 | Baseline checks passed |
| /medortho/tests/spinous-process-tap-test | 362 | Baseline checks passed |
| /medortho/tests/springing-test | 354 | Baseline checks passed |
| /medortho/tests/spurling-s-test | 394 | Baseline checks passed |
| /medortho/tests/squeeze-test | 383 | Baseline checks passed |
| /medortho/tests/staheli-test-prone-hip-extension | 379 | Baseline checks passed |
| /medortho/tests/standing-flexion-test | 367 | Baseline checks passed |
| /medortho/tests/stinchfield-test | 331 | Baseline checks passed |
| /medortho/tests/stork-test-one-leg-standing-extension | 369 | Baseline checks passed |
| /medortho/tests/subtalar-neutral | 435 | Baseline checks passed |
| /medortho/tests/sulcus-sign | 337 | Baseline checks passed |
| /medortho/tests/supination-lift-test | 376 | Baseline checks passed |
| /medortho/tests/supine-to-sit-test-long-sitting-test | 385 | Baseline checks passed |
| /medortho/tests/sweater-finger-sign | 379 | Baseline checks passed |
| /medortho/tests/tabletop-relocation-test | 386 | Baseline checks passed |
| /medortho/tests/talar-tilt-test | 387 | Baseline checks passed |
| /medortho/tests/telescoping-sign-piston-test | 369 | Baseline checks passed |
| /medortho/tests/test-for-extrinsic-tightness | 382 | Baseline checks passed |
| /medortho/tests/test-for-intrinsic-tightness | 380 | Baseline checks passed |
| /medortho/tests/tfcc-load-test | 382 | Baseline checks passed |
| /medortho/tests/the-chair-push-up-test | 388 | Baseline checks passed |
| /medortho/tests/thessaly-test | 363 | Baseline checks passed |
| /medortho/tests/thigh-thrust-test | 365 | Baseline checks passed |
| /medortho/tests/thigh-thrust-test-posterior-shear | 381 | Duplicate description |
| /medortho/tests/thomas-test | 386 | Baseline checks passed |
| /medortho/tests/thompson-s-test | 383 | Baseline checks passed |
| /medortho/tests/three-phase-hyperextension-test | 373 | Baseline checks passed |
| /medortho/tests/tinel-s-sign-ankle | 375 | Baseline checks passed |
| /medortho/tests/tinel-s-sign-elbow | 347 | Baseline checks passed |
| /medortho/tests/tinel-s-sign-wrist | 375 | Baseline checks passed |
| /medortho/tests/too-many-toes-sign | 433 | Baseline checks passed |
| /medortho/tests/trendelenburg-s-test | 356 | Baseline checks passed |
| /medortho/tests/triceps-reflex-test | 361 | Baseline checks passed |
| /medortho/tests/triceps-squeeze-test | 346 | Baseline checks passed |
| /medortho/tests/triple-compression-stress-test | 421 | Baseline checks passed |
| /medortho/tests/tubercle-sulcus-angle | 357 | Baseline checks passed |
| /medortho/tests/tuning-fork-test | 412 | Baseline checks passed |
| /medortho/tests/two-point-discrimination-static | 373 | Baseline checks passed |
| /medortho/tests/ulnar-fovea-sign | 384 | Baseline checks passed |
| /medortho/tests/ulnocarpal-abutment-test | 377 | Baseline checks passed |
| /medortho/tests/ultt-1-median-nerve-bias | 365 | Baseline checks passed |
| /medortho/tests/ultt-2a-median-nerve-bias | 342 | Baseline checks passed |
| /medortho/tests/ultt-2b-radial-nerve-bias | 348 | Baseline checks passed |
| /medortho/tests/ultt-3-ulnar-nerve-bias | 349 | Baseline checks passed |
| /medortho/tests/upper-cut-test | 351 | Baseline checks passed |
| /medortho/tests/valgus-extension-overload-test | 350 | Baseline checks passed |
| /medortho/tests/valgus-stress-test-knee | 382 | Baseline checks passed |
| /medortho/tests/varus-stress-test-knee | 376 | Baseline checks passed |
| /medortho/tests/vertebral-artery-test-vbi | 409 | Baseline checks passed |
| /medortho/tests/waldron-s-test | 332 | Baseline checks passed |
| /medortho/tests/wartenberg-s-sign | 371 | Baseline checks passed |
| /medortho/tests/watson-test-scaphoid-shift | 406 | Baseline checks passed |
| /medortho/tests/weber-barstow-maneuver | 371 | Baseline checks passed |
| /medortho/tests/whipple-test | 345 | Baseline checks passed |
| /medortho/tests/wilson-s-test | 359 | Baseline checks passed |
| /medortho/tests/wright-s-test-hyperabduction | 339 | Baseline checks passed |
| /medortho/tests/wrinkle-test-shrivel-test | 375 | Baseline checks passed |
| /medortho/tests/wrist-hand-general-examination | 324 | Baseline checks passed |
| /medortho/tests/wrist-range-of-motion | 357 | Duplicate description |
| /medortho/tests/yeoman-s-test | 336 | Duplicate description |
| /medortho/tests/yeoman-test | 356 | Duplicate description |
| /medortho/tests/yergason-s-test | 340 | Baseline checks passed |
| /medortho/tests/yokum-test | 338 | Duplicate description |
| /medortho/wrist-hand | 531 | Baseline checks passed |
| /medpharma | 142 | Baseline checks passed |
| /medphysio | 130 | Baseline checks passed |
| /medposterhub | 33 | Under 100 words (review intent) |
| /medposterhub/anatomy-injuries-of-the-hip | 36 | Under 100 words (review intent) |
| /medposterhub/anatomy-injuries-of-the-knee | 38 | Under 100 words (review intent) |
| /medposterhub/anatomy-injuries-of-the-shoulder | 37 | Under 100 words (review intent) |
| /medposterhub/anatomy-of-the-brain-neuro-physio | 40 | Under 100 words (review intent) |
| /medposterhub/anatomy-of-the-spine-vertebral-column | 35 | Under 100 words (review intent) |
| /medposterhub/bulk-orders | 121 | Canonical mismatch or count |
| /medposterhub/checkout | 121 | Canonical mismatch or count |
| /medposterhub/circulatory-system-arteries-veins | 36 | Under 100 words (review intent) |
| /medposterhub/contact | 121 | Canonical mismatch or count |
| /medposterhub/dermatomes-sensory-nerve-supply | 36 | Under 100 words (review intent) |
| /medposterhub/digestive-system-gi-tract-anatomy | 38 | Under 100 words (review intent) |
| /medposterhub/disorders-of-the-spine-clinical-conditions | 37 | Under 100 words (review intent) |
| /medposterhub/endocrine-system-hormone-glands | 32 | Under 100 words (review intent) |
| /medposterhub/female-reproductive-system-anatomical-chart | 36 | Under 100 words (review intent) |
| /medposterhub/ligaments-of-the-joints-ortho-reference | 38 | Under 100 words (review intent) |
| /medposterhub/lymphatic-system-vessels-nodes | 38 | Under 100 words (review intent) |
| /medposterhub/male-reproductive-system-anatomical-chart | 36 | Under 100 words (review intent) |
| /medposterhub/muscular-system-full-body-anatomy | 45 | Under 100 words (review intent) |
| /medposterhub/nervous-system-central-peripheral | 41 | Under 100 words (review intent) |
| /medposterhub/pregnancy-and-birth-obstetrics-reference | 37 | Under 100 words (review intent) |
| /medposterhub/privacy-terms | 158 | Baseline checks passed |
| /medposterhub/respiratory-system-lungs-airways | 37 | Under 100 words (review intent) |
| /medposterhub/returns | 145 | Baseline checks passed |
| /medposterhub/shipping | 156 | Baseline checks passed |
| /medposterhub/skeletal-system-bones-human-body | 45 | Under 100 words (review intent) |
| /medposterhub/spinal-cranial-nerves-neuro-map | 41 | Under 100 words (review intent) |
| /medposterhub/success | 121 | Canonical mismatch or count |
| /medradio | 140 | Baseline checks passed |
| /neet-app | 121 | Canonical mismatch or count |
| /neet-notes | 39 | Under 100 words (review intent) |
| /privacy-policy | 72 | Under 100 words (review intent) |
| /product/11f19d8e-905a-4765-bf8f-e355e002e892 | 141 | Baseline checks passed |
| /product/4160bfd6-48f4-44ac-960b-1cc50b62ea9a | 144 | Baseline checks passed |
| /product/44da155e-81e6-4c38-ae54-9839fdc17e36 | 145 | Baseline checks passed |
| /product/5bb3bc4b-15e3-4d23-85c0-4916c85ffc89 | 182 | Baseline checks passed |
| /product/61ea5286-382c-4245-858b-9c5392072636 | 113 | Baseline checks passed |
| /product/7061cab8-2090-42b4-938e-d6223609a981 | 121 | Baseline checks passed |
| /product/8598ac04-0d9b-42b2-8024-de5150206c20 | 172 | Baseline checks passed |
| /product/8846b3dc-a774-4800-8a59-9ccda767c235 | 170 | Baseline checks passed |
| /product/c6e0c1c3-2181-40a3-a601-8efc706e8bec | 106 | Baseline checks passed |
| /product/e576288a-6328-409e-95ee-31fd4e00fea8 | 147 | Baseline checks passed |
| /products | 1269 | Baseline checks passed |
| /profile | 121 | Canonical mismatch or count |
| /refund-policy | 303 | Baseline checks passed |
| /seo-audit-missing-page-20261125 | 121 | Canonical mismatch or count |
| /shipping-policy | 216 | Baseline checks passed |
| /terms | 9 | H1 count 0; Under 100 words (review intent) |
| /terms-and-conditions | 360 | Baseline checks passed |
