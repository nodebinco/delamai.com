import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './[page]/$types';
import { db, type Category, type Product } from '$lib/db';

const ITEMS_PER_PAGE = 12;

export const load: PageServerLoad = async ({ params }) => {
  const slugParts = params.slug.split('/');

  if (slugParts.length > 2) {
    throw error(404, 'Not found');
  }

  const categoryId = slugParts[0];
  const page = slugParts[1] ? parseInt(slugParts[1]) : 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(categoryId) as
    | Category
    | undefined;
  if (!category) {
    throw error(404, 'Category not found');
  }

  console.log(category);

  const totalCount = (
    db
      .prepare(
        `
    SELECT COUNT(*) as count 
    FROM products 
    WHERE global_catid1 = ? OR global_catid2 = ? OR global_catid3 = ?
  `
      )
      .get(categoryId, categoryId, categoryId) as { count: number }
  ).count;

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Get products for current page
  const products = db
    .prepare(
      `
    SELECT * FROM products 
    WHERE global_catid1 = ? OR global_catid2 = ? OR global_catid3 = ?
    ORDER BY item_sold DESC 
    LIMIT ? OFFSET ?
  `
    )
    .all(categoryId, categoryId, categoryId, ITEMS_PER_PAGE, offset) as Product[];

  return {
    categoryId,
    category,
    products,
    totalPages,
    totalCount,
    currentPage: page
  };
};
