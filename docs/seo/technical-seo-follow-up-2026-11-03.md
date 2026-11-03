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
