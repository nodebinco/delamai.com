import { error } from '@sveltejs/kit';
import type { Load } from './$types';
import type { Product, Tag } from '$lib/db';
import { db } from '$lib/db';

const ITEMS_PER_PAGE = 12;

export const load: Load = async ({ params }) => {
  console.log(params);
  const slugParts = params.slug.split('/');

  if (slugParts.length > 2) {
    throw error(404, 'Not found');
  }

  const tagId = slugParts[0];
  const page = slugParts[1] ? parseInt(slugParts[1]) : 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  // Get tag details
  const tag = db.prepare('SELECT * FROM tags WHERE id = ?').get(tagId) as Tag;
  if (!tag) {
    throw error(404, 'Tag not found');
  }
  console.log(tag);

  // Get total products count
  const totalCount = (
    db
      .prepare(
        `
    SELECT COUNT(*) as count 
    FROM products p
    JOIN product_tags pt ON p.id = pt.product_id
    WHERE pt.tag_id = ?
  `
      )
      .get(tagId) as { count: number }
  ).count;

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const products = db
    .prepare(
      `
    SELECT p.* 
    FROM products p
    JOIN product_tags pt ON p.id = pt.product_id
    WHERE pt.tag_id = ?
    ORDER BY p.item_sold DESC 
    LIMIT ? OFFSET ?
  `
    )
    .all(tagId, ITEMS_PER_PAGE, offset) as Product[];

  return {
    tag,
    products,
    totalPages,
    totalCount,
    currentPage: page
  };
};
