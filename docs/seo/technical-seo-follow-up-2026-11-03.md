# Technical SEO follow-up — 3 November 2026

This pass addresses findings from the deployed-site audit, with original medical records and image files preserved.

## Confirmed issues and fixes

- Eleven submitted URLs (catalog and ten products) returned HTTP 200 but inherited the homepage canonical and body before JavaScript. Published catalog/product routes now receive initial HTML with individual canonicals, titles, descriptions, product information and crawlable links. Product fetch failure stops prerender rather than publishing incorrect metadata. Product canonical stays on the requested route while client data loads.
- MedOrtho prerender injected generic clinical claims absent from the React page, including universal validation and expert-consensus statements. Removed the template-only introduction, preserving original clinical fields and image paths. This resolves a crawler/reader content mismatch without rewriting source articles.
- Product structured data asserted the same 4.8 rating and 150 reviews for every product and a fixed expiry date without a data source. Removed these assertions from catalog and detail metadata. Actual product names, descriptions and prices remain database-driven.

## Validation

Production build and 11 regression checks pass, including every generated MedOrtho test's canonical/image metadata and all product sitemap entries' initial HTML. The catalog links to every published product. Existing clinical JSON and original image assets are unchanged.

## Search Console and remaining limits

Search Console's native window was retried but did not respond to its Search button. No new validation submission is claimed. Previous /products indexing request was accepted; 404/soft-404 validation, sitemap resubmission and selected homepage/MedOrtho indexing requests remain pending until the UI is usable. Historical excluded counts are not instant live diagnostics.

Clinical evidence, reviewer credentials and image licensing have not been certified in this technical pass. Core Web Vitals still require field data. No ranking, search-result site name, AI citation or ad revenue outcome is guaranteed. Catalog data changes require a new build to keep static HTML current.

References: [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [Google site names](https://developers.google.com/search/docs/appearance/site-names).

## Post-deployment evidence

Implementation commit `7f38f23` deployed successfully to production. A fresh crawl of all 356 current sitemap URLs found 356 HTTP 200 responses, zero canonical mismatches, zero missing titles and exactly one H1 on each page. Per-URL evidence: `follow-up-live-crawl-2026-11-03.json`. All 367 generated HTML documents also had exactly one canonical and valid JSON-LD. The live Matles page retained its clinical fields and illustration while the template-only claims were absent. These are technical checks, not evidence of an immediate ranking change.

## Search Console submissions completed in Chrome

On 3 November 2026, the owner opened Search Console in regular Chrome and controls worked. Confirmed actions:

- Restarted Not found (404) validation: status “Validation started”, nine pending URLs, zero failed in the new validation.
- Submitted Soft 404 validation: status “Validation started”, two affected URLs.
- Resubmitted https://examessentials.in/sitemap.xml: “Sitemap submitted successfully”; table status Success, submitted/read 3 November. The displayed discovered count was still 363; the independent current sitemap crawl has 356 URLs.
- Inspected /medortho and /: both reported “URL is on Google” and “Page is indexed”. Requested indexing for each; Google accepted both into the priority crawl queue.

These actions supersede the earlier UI-blocked pending-submission notes. Validation results and recrawls remain pending with Google. The overall indexing report was still dated 23 October, so its old counts are not proof that deployed fixes failed. Expected redirects and alternate canonicals were not indiscriminately submitted as errors.
