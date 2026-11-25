import fs from 'node:fs';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const origin = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
if (!origin || !key) throw new Error('Product thumbnails require the published catalog environment.');
const client = createClient(process.env.USE_PROXIED_SUPABASE === 'true' ? 'https://examessentials.in/supabase-api' : origin, key);
const { data, error } = await client.from('products').select('images').eq('published', true);
if (error) throw new Error('Cannot read published product images.');
const manifest = {};
fs.mkdirSync('public/catalog-thumbnails', { recursive: true });
for (const source of new Set(data.flatMap(p => (p.images || []).slice(0, 4)))) {
  try {
    const url = new URL(source, `${origin}/storage/v1/object/public/product-images/`);
    // Download public image objects only, without credentials or arbitrary hosts.
    if (url.origin !== new URL(origin).origin || !url.pathname.startsWith('/storage/v1/object/public/product-images/')) continue;
    const download = `https://examessentials.in/supabase-api${url.pathname}`;
    const response = await fetch(download, { signal: AbortSignal.timeout(30000), redirect: 'error' });
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error('Image unavailable');
    const input = Buffer.from(await response.arrayBuffer());
    const hash = crypto.createHash('sha256').update(input).digest('hex').slice(0, 20);
    const filename = `/catalog-thumbnails/${hash}.webp`;
    await sharp(input).rotate().resize({ width: 640, height: 850, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toFile(`public${filename}`);
    manifest[source] = filename;
  } catch {
    console.warn('A catalog image could not be resized; the original remains available.');
  }
}
fs.writeFileSync('src/lib/productThumbnails.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(`Generated ${Object.keys(manifest).length} catalog thumbnails; full-size originals preserved.`);
