import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

const ITEMS_PER_PAGE = 12;

export const load: PageServerLoad = async ({ params }) => {
  const brandId = params.id;
  const page = parseInt(params.page) || 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  // Get brand details
  const brand = db.prepare('SELECT * FROM brands WHERE id = ?').get(brandId);
  if (!brand) {
    throw error(404, 'Brand not found');
  }

  // Get total products count
  const totalCount = db.prepare('SELECT COUNT(*) as count FROM products WHERE global_brand = ?').get(brandId).count;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Get products for current page
  const products = db.prepare(`
    SELECT * FROM products 
    WHERE global_brand = ? 
    ORDER BY item_sold DESC 
    LIMIT ? OFFSET ?
  `).all(brandId, ITEMS_PER_PAGE, offset);

  return {
    brand,
    products,
    totalPages
  };
}; 