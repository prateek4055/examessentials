/** Shared by the browser and static renderer; never invent clinical claims. */
export function medicalDescription(title, indication = '') {
  const text = String(indication).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  const description = `${title}: ${text || 'Clinical reference on MedOrtho.'}`;
  return description.length > 160 ? description.slice(0, 157).replace(/\s+\S*$/, '') + '...' : description;
}
