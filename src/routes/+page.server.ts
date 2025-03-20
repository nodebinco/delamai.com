import type { Load } from './$types';
import type { Product, Category } from '$lib/db';
import { db } from '$lib/db';

const ITEMS_PER_PAGE = 32;

export const load: Load = async () => {
  const featuredProducts = db
    .prepare(
      `
    SELECT * FROM products 
    ORDER BY item_sold DESC 
    LIMIT ?
  `
    )
    .all(ITEMS_PER_PAGE) as Product[];

  // Get hero products (top 4 products)
  const heroProducts = featuredProducts.slice(0, 4);

  // Get categories for showcase
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

  return {
    featuredProducts,
    heroProducts,
    categories
  };
};
