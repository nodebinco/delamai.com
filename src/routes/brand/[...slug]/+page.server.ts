import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db, getCache, setCache } from '$lib/db';
import type { Brand, Product } from '$lib/db';

const ITEMS_PER_PAGE = 120;

export const load: PageServerLoad = async ({ params }) => {
  const slugParts = params.slug.split('/');

  if (slugParts.length > 2) {
    throw error(404, 'Not found');
  }

  const brandId = slugParts[0];
  const page = slugParts[1] ? parseInt(slugParts[1]) : 1;

  if (isNaN(page) || page < 1) {
    throw error(400, 'Invalid page number');
  }

  // Check cache first
  const cacheKey = `brand_${brandId}_${page}`;
  const cachedData = getCache(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

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

  if (page > totalPages && totalPages > 0) {
    throw error(404, 'Page not found');
  }

  const products = db
    .prepare(
      `
    SELECT *
    FROM products
    WHERE global_brand = ? 
    ORDER BY item_sold DESC 
    LIMIT ? OFFSET ?
  `
    )
    .all(brand.name, ITEMS_PER_PAGE, offset) as Product[];

  const data = {
    brand,
    products,
    totalPages,
    currentPage: page,
    totalCount,
    ITEMS_PER_PAGE
  };

  // Cache the results
  setCache(cacheKey, data);

  return data;
};
