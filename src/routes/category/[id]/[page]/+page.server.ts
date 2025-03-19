import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

const ITEMS_PER_PAGE = 12;

export const load: PageServerLoad = async ({ params }) => {
  const categoryId = params.id;
  const page = parseInt(params.page) || 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  // Get category details
  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(categoryId);
  if (!category) {
    throw error(404, 'Category not found');
  }

  // Get total products count
  const totalCount = db.prepare(`
    SELECT COUNT(*) as count 
    FROM products 
    WHERE global_catid1 = ? OR global_catid2 = ? OR global_catid3 = ?
  `).get(categoryId, categoryId, categoryId).count;
  
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Get products for current page
  const products = db.prepare(`
    SELECT * FROM products 
    WHERE global_catid1 = ? OR global_catid2 = ? OR global_catid3 = ?
    ORDER BY item_sold DESC 
    LIMIT ? OFFSET ?
  `).all(categoryId, categoryId, categoryId, ITEMS_PER_PAGE, offset);

  return {
    category,
    products,
    totalPages
  };
}; 