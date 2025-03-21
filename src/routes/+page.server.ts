import type { Load, PageData } from './$types';
import type { Product, Category } from '$lib/db';
import { db, getCache, setCache } from '$lib/db';

const ITEMS_PER_PAGE = 32;

export const load: Load = async () => {
  // Check cache first
  const cacheKey = 'home';
  const cachedData = getCache(cacheKey);

  if (cachedData) {
    return cachedData as PageData;
  }

  const featuredProducts = db
    .prepare(
      `
    SELECT * FROM products 
    ORDER BY item_sold DESC 
    LIMIT ?
  `
    )
    .all(ITEMS_PER_PAGE) as Product[];

  const heroProducts = featuredProducts.slice(0, 4);

  const categories = db
    .prepare(
      `
    SELECT c.*, COUNT(p.id) as product_count
    FROM categories c
    LEFT JOIN products p ON (c.id = p.global_catid1 OR c.id = p.global_catid2 OR c.id = p.global_catid3)
    WHERE c.parent_id IS NULL AND c.name_en != ''
    GROUP BY c.id
    ORDER BY product_count DESC
  `
    )
    .all() as Category[];

  const data = {
    featuredProducts,
    heroProducts,
    categories
  };

  // Cache the results
  setCache(cacheKey, data);

  return data;
};
