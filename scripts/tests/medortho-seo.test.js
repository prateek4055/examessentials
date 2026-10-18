import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildWikiSitemap, testSlug } from '../medortho-seo-utils.js';
const records = JSON.parse(fs.readFileSync('public/medortho/tests/tests_data.json'));
const tests = records.filter((item, i) => records.findIndex(t => testSlug(t.title) === testSlug(item.title)) === i);
const dimensions = JSON.parse(fs.readFileSync('src/apps/medortho/data/imageMetadata.json'));

test('sitemap preserves all local article/image URLs without invented dates', () => {
  const xml = buildWikiSitemap([], records);
  assert.equal((xml.match(/<url>/g) || []).length, tests.length);
  assert.equal((xml.match(/<image:loc>/g) || []).length, tests.length);
  assert.ok(!xml.includes('<lastmod>'));
  assert.ok(!xml.includes('<image:caption>'));
  for (const t of tests) {
    assert.ok(xml.includes(`/tests/${testSlug(t.title)}</loc>`));
    const filename = t.image1.split('/').pop();
    assert.ok(dimensions[filename].width > 0 && dimensions[filename].height > 0);
  }
});
test('sitemap deduplicates local/DB pages and preserves genuine DB dates', () => {
  const xml = buildWikiSitemap([
    { app_id: 'medortho', slug: testSlug(tests[0].title), updated_at: '2026-10-01' },
    { app_id: 'medortho', slug: 'database-page', updated_at: '2026-09-15T12:00:00Z' },
  ], [tests[0]]);
  assert.equal((xml.match(/<url>/g) || []).length, 2);
  assert.ok(xml.includes('<lastmod>2026-09-15</lastmod>'));
  assert.ok(!xml.includes('2026-10-01'));
});
test('every prerendered test has unique route metadata and original image dimensions', () => {
  for (const t of tests) {
    const slug = testSlug(t.title);
    const html = fs.readFileSync(`dist/medortho/tests/${slug}/index.html`, 'utf8');
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1, slug);
    assert.equal((html.match(/name="description"/g) || []).length, 1, slug);
    assert.ok(html.includes(`href="https://examessentials.in/medortho/tests/${slug}"`));
    const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
    assert.ok(schemas.some(s => s['@type'] === 'MedicalWebPage' && s.primaryImageOfPage));
    assert.ok(!schemas.some(s => s['@type'] === 'MobileApplication'), slug);
    const size = dimensions[t.image1.split('/').pop()];
    assert.ok(html.includes(`width="${size.width}" height="${size.height}"`), slug);
  }
});
test('neurological prerender includes matching subcategories', () => {
  const html = fs.readFileSync('dist/medortho/neurological/index.html', 'utf8');
  for (const t of tests.filter(t=>/neuro/i.test(`${t.category} ${t.subCategory || ''}`))) {
    assert.ok(html.includes(`/medortho/tests/${testSlug(t.title)}`));
  }
});
