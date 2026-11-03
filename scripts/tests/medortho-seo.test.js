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

test('reference landing exposes region links and truthful collection metadata', () => {
  const html = fs.readFileSync('dist/medortho/index.html', 'utf8');
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.ok(html.includes(`${tests.length} tests in the web library`));
  assert.ok(!html.includes('700+'));
  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
  const library = schemas.find(s => s['@type'] === 'CollectionPage');
  assert.ok(library);
  assert.equal(library.mainEntity.itemListElement.length, 8);
  for (const item of library.mainEntity.itemListElement) {
    assert.ok(html.includes(`href="${new URL(item.url).pathname}"`));
  }
  assert.ok(!schemas.some(s => s['@type'] === 'MobileApplication'));
  const directory = fs.readFileSync('dist/medortho/special-tests/index.html', 'utf8');
  assert.ok(directory.includes('id="all-tests"'));
  for (const t of tests) assert.ok(directory.includes(`href="/medortho/tests/${testSlug(t.title)}"`));
});

test('Vercel SPA fallback uses an extensionless destination with clean URLs', () => {
  const config = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  assert.equal(config.cleanUrls, true);
  const fallback = config.rewrites.find(r => r.destination === '/index');
  assert.ok(fallback, 'client routes must resolve to the extensionless index');
  assert.ok(!config.rewrites.some(r => r.destination === '/index.html'));
});

test('empty topic collections are noindex in initial HTML', () => {
  const html = fs.readFileSync('dist/medortho/pathologies/inflammation/index.html', 'utf8');
  assert.ok(html.includes('name="robots" content="noindex, follow"'));
  assert.ok(!html.includes('name="googlebot" content="index, follow"'));
});

test('topic eligibility uses the same published MedOrtho posts as the browser', async () => {
  const { postsForTopic } = await import('../../src/apps/medortho/data/topicIndex.js');
  const rows = [
    { category: 'MedOrtho', title: 'Inflammation', published: true },
    { category: 'MedOrtho', title: 'Inflammation draft', published: false },
    { category: 'MedCardio', title: 'Inflammation', published: true },
    { category: 'MedOrtho', title: 'Other', content: 'Joint anatomy' },
  ];
  assert.deepEqual(postsForTopic(rows, 'inflammation'), [rows[0]]);
  assert.deepEqual(postsForTopic(rows, 'joints'), [rows[3]]);
  assert.deepEqual(postsForTopic(rows, 'unknown'), []);
});

test('CMS placeholders are distinguished from concise complete articles', async () => {
  const { isPlaceholderContent } = await import('../../src/lib/contentEligibility.js');
  assert.equal(isPlaceholderContent('Why Class 11 Physics is Foundation for NEET & JEE...'), true);
  assert.equal(isPlaceholderContent('<p>Introduction…</p>'), true);
  assert.equal(isPlaceholderContent(''), true);
  assert.equal(isPlaceholderContent('A concise but complete explanation.'), false);
  assert.equal(isPlaceholderContent('Detailed information. '.repeat(30) + '...'), false);
});


test('medical initial HTML does not add crawler-only medical claims', () => {
  for (const item of tests) {
    const html = fs.readFileSync(`dist/medortho/tests/${testSlug(item.title)}/index.html`, 'utf8');
    assert.ok(!html.includes('is a validated orthopedic special test used in the physical examination'));
    assert.ok(!html.includes('clinical utility supported by expert consensus and routine clinical use'));
  }
});
