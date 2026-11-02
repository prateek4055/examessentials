export const escapeXml = (value) => String(value).replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]));
export const testSlug = title => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const domain = 'https://examessentials.in';

export function buildWikiSitemap(dbArticles, localTests) {
  const entries = new Map();
  for (const article of dbArticles) {
    if (!article.slug || !article.app_id) continue;
    entries.set(`${article.app_id}/tests/${article.slug}`, article);
  }
  // Local content is also the first source used by the active React route.
  const seenLocal = new Set();
  for (const test of localTests) {
    if (!test.title) continue;
    const route = `medortho/tests/${test.slug || testSlug(test.title)}`;
    if (seenLocal.has(route)) continue;
    seenLocal.add(route);
    entries.set(route, test);
  }
  const urls = [...entries].map(([route, article]) => {
    const date = article.lastUpdated || article.updated_at;
    const validDate = date && /^\d{4}-\d{2}-\d{2}/.test(date) && Number.isFinite(Date.parse(date));
    const lastmod = validDate ? `\n    <lastmod>${new Date(date).toISOString().slice(0, 10)}</lastmod>` : '';
    const filename = article.image1?.split('/').pop();
    // Keep indexed source URLs stable. Image title/caption sitemap tags are deprecated.
    const image = filename ? `\n    <image:image><image:loc>${escapeXml(`${domain}/medortho/tests/images/${encodeURIComponent(filename)}`)}</image:loc></image:image>` : '';
    return `  <url>\n    <loc>${escapeXml(`${domain}/${route}`)}</loc>${lastmod}${image}\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join('\n')}\n</urlset>\n`;
}
