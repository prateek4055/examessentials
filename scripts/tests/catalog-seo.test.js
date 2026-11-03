import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// Run after npm run build, with the same published database used by the sitemap.
test('every submitted product has initial HTML with its own canonical, title and product schema', () => {
  const sitemap = fs.readFileSync('dist/sitemap-products.xml', 'utf8');
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]).filter(url => new URL(url).pathname.startsWith('/product/'));
  assert.ok(urls.length > 0);
  for (const url of urls) {
    const pathname = new URL(url).pathname;
    const html = fs.readFileSync(`dist${pathname}/index.html`, 'utf8');
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
    assert.ok(html.includes(`rel="canonical" href="${url}"`), pathname);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, pathname);
    assert.ok(!html.includes('name="robots" content="noindex'), pathname);
    const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
    assert.ok(schemas.some(s => s['@type'] === 'Product'), pathname);
    assert.ok(!schemas.some(s => s['@type'] === 'WebSite'), pathname);
  }
  const catalog = fs.readFileSync('dist/products/index.html', 'utf8');
  assert.ok(catalog.includes('rel="canonical" href="https://examessentials.in/products"'));
  for (const url of urls) assert.ok(catalog.includes(`href="${new URL(url).pathname}"`));
});
