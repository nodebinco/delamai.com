import type { PageServerLoad } from '../$types';
import { db, getCache, setCache } from '$lib/db';
import { error } from '@sveltejs/kit';

const ITEMS_PER_PAGE = 120;

export const load: PageServerLoad = async ({ params }) => {
  const slugParts = params.slug.split('/');

  if (slugParts.length > 2) {
    throw error(404, 'Not found');
  }

  const query = slugParts[0];
  const page = slugParts[1] ? parseInt(slugParts[1]) : 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const cacheKey = `search_${query}_${page}`;
  const cachedData = getCache(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  if (!query) {
    return {
      products: [],
      total: 0,
      currentPage: 1,
      totalPages: 1,
      query: ''
    };
  }

  const countResult = db
    .prepare(
      `
      SELECT COUNT(*) as total
      FROM products
      WHERE title LIKE ? OR description LIKE ?
    `
    )
    .get(`%${query}%`, `%${query}%`) as { total: number };

  const total = countResult.total;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const products = db
    .prepare(
      `
      SELECT *
      FROM products
      WHERE title LIKE ? OR description LIKE ?
      ORDER BY item_sold DESC
      LIMIT ? OFFSET ?
    `
    )
    .all(`%${query}%`, `%${query}%`, ITEMS_PER_PAGE, offset);

  const data = {
    products,
    total,
    currentPage: page,
    totalPages,
    query
  };

  setCache(cacheKey, data);

  return data;
};
