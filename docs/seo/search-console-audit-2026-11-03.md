# Search Console and live-site SEO audit

Reviewed 3 November 2026 for the verified domain property examessentials.in. Search Console was inspected in the owner's existing signed-in window. No account settings, validation requests or deployments were submitted.

## Evidence

Indexing report, updated 23 October: 212 indexed, 186 excluded. Exclusions: 139 discovered/not indexed; 12 crawled/not indexed; 12 robots-blocked; 9 HTTP 404; 9 redirects; 3 alternate canonicals; 2 soft-404. These categories are not all errors. Examples of crawled exclusions include robots.txt and XML sitemaps, which do not need search-result listings. Robots-blocked examples are product-query variants, not MedOrtho articles.

Sitemap report: sitemap.xml successful, last read 29 October, 363 discovered URLs. Independent live crawl of all 363 submitted URLs found 352 HTTP 200 responses and 11 HTTP 404 responses. All 352 successful HTML responses had one H1 and a canonical matching the requested URL (trailing slash normalized). This verifies initial HTML only, not every rendered interaction or image. Full per-URL results are in live-sitemap-crawl-2026-11-03.json.

404s in submitted URLs: /products and ten /product/{id} routes. Additional Search Console examples /neet-app, /medposterhub/contact and /medposterhub/bulk-orders also return Vercel 404s live. These routes exist in React. Current published products are still returned by the database and sitemap generator; they must be reachable, not removed merely to hide errors.

Soft-404 examples: /medortho/pathologies/inflammation and /blog/class-11-physics-notes-quick-revision. The former has no matching published topic posts. The latter's actual article body is a ten-word placeholder ending in an ellipsis. The six published blog posts all currently have similar 5–10-word placeholder bodies. Their headings, author/date labels and claimed reading times do not make them complete articles.

Manual actions: no issues detected. Security issues: no issues detected. Core Web Vitals overview: insufficient/no field data on mobile and desktop, not a passing performance score. Overview reports zero invalid Product snippets, Merchant listings, Breadcrumbs and Review snippets; this does not establish the truth of every marked-up claim.

## Search performance: 1 August–31 October 2026

| Report | Clicks | Impressions | CTR | Average position |
| --- | ---: | ---: | ---: | ---: |
| Web | 131 | 7.92K | 1.7% | 24.9 |
| Image | 259 | 142K | 0.2% | 44.2 |

These are property-wide figures, not AdSense sessions or revenue. Web and image position metrics should not be treated as equivalent placements.

Top image landing pages: shoulder 50 clicks/45,974 impressions; elbow 45/19,524; Neer 34/8,106; Empty Can 28/6,985; Pivot Shift 19/4,234; hip 12/13,431; Lift-off 11/2,282; knee 9/16,299. Preserve these routes and original image URLs.

The property's Generative AI features (Beta) report displays 2.17K impressions in the same period: Lift-off 572, Neer 233, hip 194, Elbow Valgus Stress 137. This is observed existing Google AI visibility, not proof of clicks, revenue, all-provider recommendations or an effect of the new local changes.

## Fixes prepared locally

- Correct Vercel SPA fallback destination from /index.html to /index while retaining cleanUrls. Vercel explicitly requires extensionless rewrite destinations with cleanUrls. The live failure pattern is consistent with this mismatch; post-deployment HTTP checks are still required to confirm resolution. Existing generated files and Supabase proxy configuration remain intact.
- Share topic matching across browser, prerender and sitemap generation. Empty topic hubs receive noindex/follow and are omitted from the sitemap. Populated hubs get links to their actual published articles in initial HTML. Their medical text is unchanged.
- Detect empty/one-line ellipsis CMS placeholders; keep them accessible but noindex/follow in browser and generated HTML and omit them from blog sitemap. This is not a general minimum word-count policy. Complete concise content remains eligible.
- Remove automatically fabricated current-day lastmod values from static pages, listing pages and sitemap index. Preserve genuine database modification dates.
- Product text-search variants receive noindex/follow rather than competing with the main catalog. The local robots policy permits crawling those variants so Google can see the directive after deployment.
- Mark the NEET app's existing private-preview UI noindex; restoring its route does not imply it is a public indexable resource.
- Fail production sitemap/prerender generation if the blog database fetch fails, rather than mistaking an outage for empty content and publishing incorrect noindex signals.
- Regenerate sitemaps using current published database records. No source clinical data or original medical image was changed.

The prior MedOrtho UI, Inter font, collection metadata, site-name consistency and directory changes remain in the working tree.

## Verification and remaining work

Production npm run build succeeded, including current database reads, sitemap generation and prerender. Nine regression checks passed. Browser checks confirmed noindex on the empty inflammation hub and placeholder physics article. TypeScript checking still reports the pre-existing ios_notifications schema typing errors in MedAppPage and app_id mismatch in the legacy MedOrthoWikiArticlePage; no new type errors were reported.

Before calling the live problems resolved:

1. Deploy the reviewed changes to Vercel, verifying this repository/config and the normal production build are used.
2. Recheck all previously failing public URLs for HTTP 200 and actual content, including a direct reload. Confirm a MedOrtho article still serves its own initial HTML, canonical and image.
3. Check a placeholder blog and empty topic for noindex in initial and rendered HTML; confirm their absence from the regenerated sitemaps. Rebuild after those articles are completed so initial HTML and sitemaps become eligible together.
4. Inspect representative URLs in Search Console. Request indexing for repaired substantive pages; do not request indexing for intentional noindex pages, robots.txt, sitemaps, redirects or private screens. Validate a fix only after the live state is corrected.
5. Monitor recrawling and indexing over time. Discovered/not-indexed is not cleared by pressing Validate or adding more schema; useful original content, accurate evidence and internal discovery remain relevant.

Not completed: deployment, post-deployment route verification, field performance measurement, exhaustive backlink analysis, clinical evidence/image-license audit, or an audit of every query/redirect example. The older prerender-only generic medical introductions remain a known content-parity issue outside this no-content-edit pass. These limits must not be represented as a perfect SEO score or guaranteed ranking.

Sources: [Vercel rewrite configuration](https://vercel.com/docs/project-configuration/vercel-json), [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [Google crawling errors](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors).
