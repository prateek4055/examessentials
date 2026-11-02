/** Detect empty bodies and the one-line ellipsis placeholders currently in the CMS.
 * This is not a minimum word count for SEO: concise complete articles remain eligible.
 */
export function isPlaceholderContent(content) {
  const text = (content || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return !text || (text.length < 160 && /(?:\.\.\.|…)\s*$/.test(text));
}
