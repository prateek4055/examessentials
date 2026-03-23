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
    // 0. Fetch static blog posts from source code to ensure they are in the sitemap
    console.log('Reading static blog posts from blogData.ts...');
    let staticBlogSlugs = [];
    try {
      const blogDataPath = path.resolve(process.cwd(), 'src/lib/blogData.ts');
      if (fs.existsSync(blogDataPath)) {
        const blogDataContent = fs.readFileSync(blogDataPath, 'utf8');
        // Extract IDs using regex to avoid complex parsing of TS in JS
        const matches = [...blogDataContent.matchAll(/id:\s*["']([^"']+)["']/g)];
        staticBlogSlugs = matches.map(m => m[1]);
        console.log(`✅ Found ${staticBlogSlugs.length} static blog posts.`);
      }
    } catch (e) {
      console.warn('⚠️ Could not read static blog posts:', e.message);
    }

    // 1. Fetch all published products
    console.log('Fetching products from Supabase...');
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('id, updated_at')
      .eq('published', true);

    if (productError) {
      throw productError;
    }

    console.log(`✅ Found ${products?.length || 0} published products.`);

    // 2. Fetch all published blog posts
    console.log('Fetching blog posts from Supabase...');
    const { data: dbBlogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('published', true);

    if (blogError) {
      console.warn('⚠️ Could not fetch blog posts from Supabase (this is okay if table doesn\'t exist yet):', blogError.message);
    }

    const today = new Date().toISOString().split('T')[0];

    // 3. Generate Product Sitemap (sitemap-products.xml)
    let productSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}/products</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

    if (products && products.length > 0) {
      products.forEach((product) => {
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

    // 4. Generate Blog Sitemap (sitemap-blog.xml)
    let blogSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;

    // Add static blog posts
    staticBlogSlugs.forEach(slug => {
      blogSitemap += `
  <url>
    <loc>${DOMAIN}/blog/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    // Add DB blog posts (avoid duplicates if slug matches static ID)
    if (dbBlogPosts && dbBlogPosts.length > 0) {
      dbBlogPosts.forEach(post => {
        if (!staticBlogSlugs.includes(post.slug)) {
          const lastmod = post.updated_at
            ? new Date(post.updated_at).toISOString().split('T')[0]
            : today;
          
          blogSitemap += `
  <url>
    <loc>${DOMAIN}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
        }
      });
    }

    blogSitemap += `\n</urlset>`;

    // 5. Generate Static Pages Sitemap (sitemap-pages.xml)
    const staticPages = [
      { path: '/', priority: '1.0', changefreq: 'daily' },
      { path: '/about', priority: '0.7', changefreq: 'monthly' },
      { path: '/contact', priority: '0.7', changefreq: 'monthly' },
      { path: '/class-11-notes', priority: '0.9', changefreq: 'weekly' },
      { path: '/class-12-notes', priority: '0.9', changefreq: 'weekly' },
      { path: '/neet-notes', priority: '0.9', changefreq: 'weekly' },
      // Sub-Apps
      { path: '/medposterhub', priority: '0.8', changefreq: 'weekly' },
      { path: '/medortho', priority: '0.8', changefreq: 'weekly' },
      { path: '/medcardio', priority: '0.6', changefreq: 'monthly' },
      { path: '/medneuro', priority: '0.6', changefreq: 'monthly' },
      { path: '/medphysio', priority: '0.6', changefreq: 'monthly' },
      { path: '/medradio', priority: '0.6', changefreq: 'monthly' },
      { path: '/medpharma', priority: '0.6', changefreq: 'monthly' },
      // Legal
      { path: '/privacy-policy', priority: '0.3', changefreq: 'monthly' },
      { path: '/terms-and-conditions', priority: '0.3', changefreq: 'monthly' },
      { path: '/refund-policy', priority: '0.3', changefreq: 'monthly' },
      { path: '/shipping-policy', priority: '0.3', changefreq: 'monthly' },
    ];

    let pagesSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    staticPages.forEach(page => {
      pagesSitemap += `
  <url>
    <loc>${DOMAIN}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    pagesSitemap += `\n</urlset>`;

    // 6. Generate Main Sitemap Index (sitemap.xml)
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

    // 7. Write files to the public directory
    const publicDir = path.resolve(process.cwd(), 'public');

    // Ensure public directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap-products.xml'), productSitemap);
    console.log('✅ Generated public/sitemap-products.xml');

    fs.writeFileSync(path.join(publicDir, 'sitemap-blog.xml'), blogSitemap);
    console.log('✅ Generated public/sitemap-blog.xml');

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
