import { error } from '@sveltejs/kit';
import type { Load, CountResult } from './$types';
import type { Product } from '$lib/db';
import { db } from '$lib/db';

const ITEMS_PER_PAGE = 12;

export const load: Load = async ({ params }: { params: { id: string; page?: string } }) => {
  const productId = params.id;
  const page = params.page ? parseInt(params.page) : 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  // Get product details
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId) as Product;
  if (!product) {
    throw error(404, 'Product not found');
  }

  // Get total products count for pagination
  const totalCount = (db.prepare(`
    SELECT COUNT(*) as count 
    FROM products
    WHERE category_id = ?
  `).get(product.category_id) as CountResult).count;
  
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Get related products from the same category
  const relatedProducts = db.prepare(`
    SELECT * FROM products 
    WHERE category_id = ? AND id != ?
    ORDER BY item_sold DESC 
    LIMIT ? OFFSET ?
  `).all(product.category_id, productId, ITEMS_PER_PAGE, offset) as Product[];

  return {
    product,
    relatedProducts,
    totalPages
  };
}; 