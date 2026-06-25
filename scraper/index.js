import 'dotenv/config'
import Parser from 'rss-parser'
import { createClient } from '@supabase/supabase-js'

/* ---------------- CONFIG ---------------- */

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (RSS Bot; +https://github.com/prateekgoyal4055)',
  },
})

/* ---------------- HELPERS ---------------- */

function normalizeUrl(url = '') {
  return url
    .trim()
    .replace(/[#?].*$/, '')
    .replace(/\/$/, '')
    .toLowerCase()
}

function parseDate(date) {
  const d = new Date(date)
  return isNaN(d.getTime()) ? null : d
}

/* ---------------- MAIN LOGIC ---------------- */

async function run() {
  console.log('🚀 RSS → Supabase job started')

  const { data: sources, error } = await supabase
    .from('rss_sources')
    .select('*')
    .eq('is_active', true)

  if (error) {
    console.error('❌ Failed to load rss_sources:', error.message)
    return
  }

  let totalItems = 0
  let inserted = 0

  for (const source of sources) {
    console.log(`\n📡 Fetching: ${source.site_name}`)

    try {
      const feed = await parser.parseURL(source.feed_url)

      console.log(`   🧾 Items found: ${feed.items.length}`)
      totalItems += feed.items.length

      for (const item of feed.items) {
        const link = normalizeUrl(item.link)
        if (!link) continue

        const published =
          parseDate(item.isoDate) ||
          parseDate(item.pubDate) ||
          new Date()

        const { data: exists } = await supabase
          .from('external_articles')
          .select('id')
          .eq('article_url', link)
          .limit(1)

        if (exists.length > 0) continue

        const { error: insertError } = await supabase
          .from('external_articles')
          .insert({
            source_id: source.id,
            title: item.title || 'Untitled',
            summary: item.contentSnippet || '',
            article_url: link,
            image_url: item.enclosure?.url || null,
            category: source.category || null,
            published_at: published.toISOString(),
            is_active: true,
          })

        if (insertError) {
          console.error('   ❌ Insert failed:', insertError.message)
        } else {
          inserted++
          console.log('   ✅ Inserted:', link)
        }
      }
    } catch (err) {
      console.error(`   ❌ Feed failed: ${err.message}`)
    }
  }

  console.log('\n🎉 DONE')
  console.log('Total items seen:', totalItems)
  console.log('Inserted:', inserted)
}

run()
console.log('🧹 Cleaning old articles (keeping latest 5 per source)...')

await supabase.rpc('cleanup_old_articles')

console.log('✅ Cleanup completed')
