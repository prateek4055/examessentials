/** Shared by the browser and static renderer; never invent clinical claims. */
export function medicalDescription(title, indication = '') {
  const entities = { nbsp: ' ', amp: '&', quot: '"', apos: "'", lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', ndash: '–', mdash: '—', deg: '°', lt: '<', gt: '>' };
  const text = String(indication).replace(/<[^>]*>/g, ' ')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, name) => {
      if (!name.startsWith('#')) return entities[name.toLowerCase()] ?? entity;
      const code = name[1].toLowerCase() === 'x' ? parseInt(name.slice(2), 16) : Number(name.slice(1));
      return code > 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff) ? String.fromCodePoint(code) : entity;
    }).replace(/\s+/g, ' ').trim();
  const description = `${title}: ${text || 'Clinical reference on MedOrtho.'}`;
  return description.length > 160 ? description.slice(0, 157).replace(/\s+\S*$/, '') + '...' : description;
}
