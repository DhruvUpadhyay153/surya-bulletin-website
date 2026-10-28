
/**
 * News type
 * Purpose: Har news item mein kaun-si information honi chahiye,
 * ye TypeScript ko batana.
 *
 * Firebase connect hone par actual fields ko existing database
 * ke schema ke mutabik adjust karenge.
 */

export interface News {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  publishedAt: string;
}
