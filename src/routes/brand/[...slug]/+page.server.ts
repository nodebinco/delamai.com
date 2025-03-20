import { error } from '@sveltejs/kit';
import type { Load } from './$types';
import { db } from '$lib/db';
import type { Brand, Product } from '$lib/db';

const ITEMS_PER_PAGE = 12;

export const load: Load = async ({ params }) => {
  const slugParts = params.slug.split('/');

  if (slugParts.length > 2) {
    throw error(404, 'Not found');
  }

  const brandId = slugParts[0];
  const page = slugParts[1] ? parseInt(slugParts[1]) : 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const brand = db.prepare('SELECT * FROM brands WHERE id = ?').get(brandId) as Brand | undefined;
  if (!brand) {
    throw error(404, 'Brand not found');
  }

  const totalCount = (
    db.prepare('SELECT COUNT(*) as count FROM products WHERE global_brand = ?').get(brand.name) as {
      count: number;
    }
  ).count;

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const products = db
    .prepare(
      `
    SELECT *
    FROM products p
    WHERE p.global_brand = ? 
    ORDER BY p.item_sold DESC 
    LIMIT ? OFFSET ?
  `
    )
    .all(brand.name, ITEMS_PER_PAGE, offset) as Product[];

  return {
    brand,
    products,
    totalPages,
    currentPage: page
  };
};
