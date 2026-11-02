# MedOrtho competitor audit and design direction

Research date: 3 November 2026. Scope: local implementation, the two supplied directories, and representative Neer articles. This is not a full crawl, backlink analysis, clinical validation, or proof of the causes of search rankings. Medical source content and original images are outside the editing scope.

## Outcome

Local preview is running at http://127.0.0.1:8080/medortho. The strongest next change is a reference-first MedOrtho hub: search and body-region navigation should precede app promotion. Existing article URLs should remain stable.

## What the references do

| Reference | Observed structure | Useful lesson |
| --- | --- | --- |
| [Physiopedia directory](https://www.physio-pedia.com/Category:Special_Tests) | Sixteen linked subcategories; alphabetic article directory; 200 entries on the first page out of 246; next-page link. Includes finer anatomical divisions and functional/population categories. | Provide both region browsing and an A–Z route to known tests. Do not require users to guess a search term. Counts are a dated snapshot, not comparable totals of unique clinical tests. |
| [Physiopedia Neer article](https://www.physio-pedia.com/Neer_Test) | Named contributors, linked categories, purpose, technique, evidence tables, references and citation access. | Make navigation and existing references easy to locate. Show author/reviewer information only when genuine and verifiable. |
| [Orthofixar directory](https://orthofixar.com/special-test/) | Ten specialty links with counts, twelve article entries on the first page, linked titles/excerpts and numbered pagination extending to page 35. App promotion also appears in the footer. | Region hubs and persistent article links give readers multiple discovery paths. App acquisition can remain secondary to the reference library. |
| [Orthofixar Neer article](https://orthofixar.com/special-test/neer-test/) | Section navigation, procedure imagery/video, related-test links, diagnostic tables, references and visible revision information. | Improve scanning, image presentation and onward navigation without expanding the medical text. Do not imitate unverified reader counts or manufacture freshness. |

Physiopedia initially returned access errors; a later direct fetch successfully exposed both the main category and Neer article. Findings above use those successful reads rather than the earlier indexed snapshot. Competitor clinical statements have not been medically validated in this audit.

These structures plausibly support discovery, relevance and usability. Their ranking positions cannot be attributed to layout alone: links, reputation, query intent, geography, indexing and competing results are not established by this inspection.

## Current MedOrtho gaps

1. **Search intent mismatch.** The first screen emphasizes app branding, store badges and other apps; the web reference search appears later. The shared landing metadata is also app-oriented.
2. **Inventory credibility.** The repository contains 292 records and 291 unique article slugs, while web-directory UI/prerender text advertises 700+. App inventory may differ. Derive web counts from unique available routes and distinguish app claims.
3. **Artificial recency.** Landing cards use a fixed date array. Only genuine stored dates should produce date labels; dataset order does not prove recent publication.
4. **Directory navigation.** Region filters and pagination in `MedOrthoSpecialTestsIndex.tsx` are stateful buttons. Existing prerender links mitigate discovery, but persistent crawlable pagination would align browser and initial HTML behavior. Keep arbitrary search combinations out of the index.
5. **Rendering parity.** `scripts/prerender.js` still injects generic clinical introductions absent from the React article. This is a known unresolved content-parity concern. Do not silently rewrite medical text under a technical SEO change; resolve the rendering source deliberately within the user's content constraint.
6. **Theme evidence.** Available web tokens are navy `#1B3A5C`, blue `#2A5A8C`, accent `#4AADE4`, light accent `#7CC4ED`, and pale backgrounds. No Flutter source was located in this checkout; exact app-theme parity has not been verified.

Previous work already added route splitting, image dimensions, sitemap deduplication, metadata cleanup, accessible mobile navigation and content-aware ad placement. Preserve these improvements rather than rebuilding them unnecessarily.

## Proposed premium interface

### Landing page

- Compact MedOrtho header with library navigation and a restrained app link.
- Clear web-library heading and prominent test search in the first viewport.
- Body-region cards with dataset-derived counts; use the existing regions and URLs before proposing new taxonomy.
- A–Z access and a compact directory preview. Use existing titles and descriptions, with no invented popularity or publication labels.
- Quiet app promotion after the reference navigation.

### Region and article pages

- Region heading, breadcrumbs, search and readable test cards; each card has a meaningful linked title and an uncropped existing illustration where available.
- Desktop article: comfortable central reading column, section navigation alongside it, restrained supporting navigation.
- Mobile: one column, accessible expandable section navigation, large controls, no overlapping bottom bars. Tables may scroll within their own container.
- Keep original medical paragraphs and images. Improve spacing, typography, figure containers and reference presentation.
- Use navy for text and primary actions, blue accents sparingly, white surfaces and subtle borders. Avoid excessive gradients and decorative cards around every paragraph.
- Validate at 360, 390, 768, 1024 and 1440 px, with keyboard navigation and enlarged text. Check image/table overflow, drawer focus, sticky offsets and ad-space shifts.

## Technical SEO and AI discoverability

Priority order:

1. Align landing title, description and heading with the actual web reference purpose, retaining the MedOrtho brand.
2. Make directory pages addressable with real link destinations and matching initial HTML. Preserve existing indexed article paths. Google recommends crawlable pagination links rather than discovery that depends on clicking buttons. [Google pagination guidance](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading)
3. Verify production responses, canonicals, indexability, sitemap destinations and article/image access; a development-server response alone does not establish production indexing.
4. Use structured data that matches visible facts. Never add fictional medical reviewers, dates, ratings or clinical assertions to schema.
5. Preserve stable original image URLs and intrinsic dimensions. Improve loading priority and responsive display without replacing images; assess actual image-search landing pages in Search Console before changing URL patterns.
6. Audit crawler access by provider and purpose before changing robots rules. Search discovery and model-training permissions are different decisions; do not remove training restrictions as an assumed SEO fix.

Google says its ordinary SEO foundations apply to AI Overviews and AI Mode; there is no special AI schema or additional machine-readable file requirement. Eligibility does not guarantee selection or citation. This statement concerns Google's AI search products, not every AI provider. [Google AI search guidance](https://developers.google.com/search/docs/appearance/ai-features)

## Advertising and measurement

Keep monetization scoped to MedOrtho and descendants. Retain the current content-aware placements as the baseline while improving the UI; do not increase ad density simultaneously and then attribute results to the redesign.

For a later placement experiment, use clearly separated, labeled slots after meaningful content, preserve space to limit layout shifts, and keep ads away from navigation controls. Confirm actual account slot formats and Auto Ads exclusions, including navigation away from MedOrtho within the SPA. Development previews should not request live ads.

Measure MedOrtho organic landing sessions, image-search clicks, engaged sessions, page depth, ad viewability, page RPM and revenue per session. Segment by device and country; report traffic mix alongside revenue. Monitor field LCP, INP and CLS. With the small supplied baseline, short-term RPM changes are too noisy to claim a winning design. Do not optimize for accidental clicks or reading time inflated by unnecessary text.

## Implementation sequence

1. Build the reference-first landing and region layouts using the existing theme and unchanged medical content/assets.
2. Connect crawlable directory state, truthful inventory/date labels and web-oriented metadata; validate prerender parity.
3. Verify responsive behavior, accessibility, existing SEO regression checks and production build.
4. After release, establish a comparable baseline before an isolated ad-placement experiment.

This research pass starts the preview and records findings only. It does not deploy changes or alter application UI, medical data, image files or ad configuration.
