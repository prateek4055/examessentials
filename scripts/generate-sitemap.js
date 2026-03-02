import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env if running locally
// In Vercel, these will be provided by the deployment environment
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Sitemap Generation Failed: Missing Supabase environment variables');
  console.error('- Ensure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set.');
  process.exit(1);
}

// If running locally on JIO network, Supabase domains might be blocked.
// We proxy the fetch request through the production domain.
const PROXIED_URL = "https://examessentials.in/supabase-api";
const isLocal = !process.env.VERCEL_ENV; // Vercel environment checks this
const baseUrlToUse = isLocal ? PROXIED_URL : SUPABASE_URL;

const supabase = createClient(baseUrlToUse, SUPABASE_ANON_KEY, {
  global: {
    fetch: (...args) => fetch(...args)
  }
});
const DOMAIN = 'https://examessentials.in';

async function generateSitemaps() {
  console.log('🔄 Starting dynamic sitemap generation...');

  try {
    // 1. Fetch all published products
    console.log('Fetching products from Supabase...');
    const { data: products, error } = await supabase
      .from('products')
      .select('id, updated_at')
      .eq('published', true);

    if (error) {
      throw error;
    }

    console.log(`✅ Found ${products?.length || 0} published products.`);

    const today = new Date().toISOString().split('T')[0];

    // 2. Generate Product Sitemap (sitemap-products.xml)
    let productSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}/products</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;

    if (products && products.length > 0) {
      products.forEach((product) => {
        // Use updated_at if available, otherwise fallback to today
        const lastmod = product.updated_at
          ? new Date(product.updated_at).toISOString().split('T')[0]
          : today;

        productSitemap += `
  <url>
    <loc>${DOMAIN}/product/${product.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });
    }

    productSitemap += `\n</urlset>`;

    // 3. Generate Static Pages Sitemap (sitemap-pages.xml)
    // Note: blog sitemap is already handling the dynamic blog posts if any
    const pagesSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${DOMAIN}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${DOMAIN}/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${DOMAIN}/posters</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

    // 4. Generate Main Sitemap Index (sitemap.xml)
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN}/sitemap-pages.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap-products.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap-blog.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

    // 5. Write files to the public directory
    const publicDir = path.resolve(process.cwd(), 'public');

    // Ensure public directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap-products.xml'), productSitemap);
    console.log('✅ Generated public/sitemap-products.xml');

    fs.writeFileSync(path.join(publicDir, 'sitemap-pages.xml'), pagesSitemap);
    console.log('✅ Generated public/sitemap-pages.xml');

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapIndex);
    console.log('✅ Generated public/sitemap.xml');

    console.log('🎉 Sitemap generation completed successfully!');

  } catch (error) {
    console.error('❌ Error generating sitemaps:', error);
    process.exit(1);
  }
}

generateSitemaps();
