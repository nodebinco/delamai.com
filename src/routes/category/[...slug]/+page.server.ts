import { error } from '@sveltejs/kit';
import type { Load } from './$types';
import { db, getCache, setCache, type Category, type Product } from '$lib/db';

const ITEMS_PER_PAGE = 120;

export const load: Load = async ({ params }) => {
  const slugParts = params.slug.split('/');

  if (slugParts.length > 2) {
    throw error(404, 'Not found');
  }

  const categoryId = slugParts[0];
  const page = slugParts[1] ? parseInt(slugParts[1]) : 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const cacheKey = `category_${categoryId}_${page}`;
  const cachedData = getCache(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(categoryId) as
    | Category
    | undefined;
  if (!category) {
    throw error(404, 'Category not found');
  }

  const totalCount = (
    db
      .prepare(
        `
    SELECT COUNT(id) as count 
    FROM products 
    WHERE global_catid1 = ? OR global_catid2 = ? OR global_catid3 = ?
  `
      )
      .get(categoryId, categoryId, categoryId) as { count: number }
  ).count;

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const products = db
    .prepare(
      `
    SELECT id, title, image_link, item_rating, item_sold, sale_price, product_link
    FROM products 
    WHERE global_catid1 = ? OR global_catid2 = ? OR global_catid3 = ?
    ORDER BY item_sold DESC 
    LIMIT ? OFFSET ?
  `
    )
    .all(categoryId, categoryId, categoryId, ITEMS_PER_PAGE, offset) as Product[];

  const data = {
    categoryId,
    category,
    products,
    totalPages,
    totalCount,
    currentPage: page,
    ITEMS_PER_PAGE
  };

  setCache(cacheKey, data);

  return data;
};
