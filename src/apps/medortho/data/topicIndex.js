// Shared by the browser, prerenderer and sitemap generator.
export const topicKeywords = {
  bones: 'bone', joints: 'joint', muscles: 'muscle', ligaments: 'ligament',
  fractures: 'fractur', inflammation: 'inflam', 'chronic-conditions': 'chronic',
};

export function postsForTopic(posts, topic) {
  const keyword = topicKeywords[topic];
  if (!keyword) return [];
  return posts.filter(post => post.category === 'MedOrtho' && post.published !== false &&
    `${post.title || ''} ${post.excerpt || ''} ${post.content || ''}`.toLowerCase().includes(keyword));
}
