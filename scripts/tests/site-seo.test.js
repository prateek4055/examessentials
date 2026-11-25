import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadPosterData } from '../load-poster-data.js';
import { medicalDescription } from '../../src/lib/medicalSeo.js';
const { posters, calculateVariantPrice, buildPosterProductSchema } = await loadPosterData();
const read = route => fs.readFileSync(`dist/${route}/index.html`, 'utf8');

test('all sitemap URLs resolve to generated indexable HTML with their own canonical', () => {
  for (const file of ['pages','products','blog','wiki']) {
    for (const [,url] of fs.readFileSync(`dist/sitemap-${file}.xml`, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const route = new URL(url).pathname.slice(1);
      const html = route ? read(route) : fs.readFileSync('dist/index.html','utf8');
      assert.ok(html.includes(`rel="canonical" href="${url}"`), url);
      assert.equal((html.match(/<h1[ >]/g) || []).length, 1, url);
      assert.ok(!/name="robots" content="noindex/.test(html), url);
    }
  }
});

test('all posters expose original imagery, current prices and no unsupported ratings', () => {
  const catalog = read('medposterhub');
  for (const p of posters) {
    const html = read(`medposterhub/${p.slug}`);
    assert.ok(catalog.includes(`href="/medposterhub/${p.slug}"`));
    assert.ok(html.includes(`src="${p.image}"`));
    const schema = buildPosterProductSchema(p);
    const prices = p.sizes.flatMap(size => ['matte','framed','acrylic'].map(material => calculateVariantPrice(p.price,material,size)));
    assert.equal(schema.offers.lowPrice, Math.min(...prices));
    assert.equal(schema.offers.highPrice, Math.max(...prices));
    assert.equal(schema.offers.offerCount, prices.length);
    assert.ok(!html.includes('aggregateRating'));
    assert.ok(html.includes('"@type": "Product"'));
  }
});

test('similar medical indications retain unique descriptions without synthetic ellipses', () => {
  assert.notEqual(medicalDescription('Phalen test', 'Carpal tunnel assessment.'), medicalDescription('Reverse Phalen test', 'Carpal tunnel assessment.'));
  assert.equal(medicalDescription('Test', 'Short purpose.'), 'Test: Short purpose.');
  assert.equal(medicalDescription('Pivot Shift Test', '<p>Replicates &ldquo;giving way&rdquo; at 30&deg;.</p>'), 'Pivot Shift Test: Replicates “giving way” at 30°.');
  assert.equal(medicalDescription('Test', '&#x2019; &#39; &#99999999;'), "Test: ’ ' &#99999999;");
  assert.ok(medicalDescription('Test', 'Long indication '.repeat(30)).length <= 160);
});

test('private routes and 404 document have initial noindex; terms redirects permanently', () => {
  for (const route of ['auth','profile','cart','admin','neet-app','medposterhub/checkout','medposterhub/success']) {
    const html = read(route);
    assert.ok(html.includes('name="robots" content="noindex, follow"'), route);
    assert.ok(!html.includes('name="googlebot" content="index, follow"'), route);
  }
  const notFound = fs.readFileSync('dist/404.html','utf8');
  assert.ok(notFound.includes('noindex, follow'));
  assert.ok(!notFound.includes('rel="canonical"'));
  const config=JSON.parse(fs.readFileSync('vercel.json'));
  assert.ok(config.redirects.some(r => r.source === '/terms' && r.destination === '/terms-and-conditions' && r.permanent));
});

test('public poster support pages are linked and submitted', () => {
  const sitemap = fs.readFileSync('dist/sitemap-pages.xml','utf8');
  const catalog = read('medposterhub');
  for(const slug of ['shipping','returns','bulk-orders','contact','privacy-terms']) {
    const route = `medposterhub/${slug}`;
    assert.ok(sitemap.includes(`/${route}</loc>`));
    assert.ok(catalog.includes(`href="/${route}"`));
    assert.ok(read(route).includes(`href="https://examessentials.in/${route}"`));
  }
});
