import { error } from '@sveltejs/kit';
import type { Load } from './$types';
import type { Product, Tag } from '$lib/db';
import { db } from '$lib/db';

const ITEMS_PER_PAGE = 12;

export const load: Load = async ({ params }) => {
  const productId = params.id;

  // Get product details with brand and category info
  const product = db
    .prepare(
      `
    SELECT 
      p.*,
      b.id as brand_id,
      b.name as brand_name,
      c1.name_th as category1_th,
      c2.name_th as category2_th,
      c3.name_th as category3_th
    FROM products p
    LEFT JOIN brands b ON p.global_brand = b.name
    LEFT JOIN categories c1 ON p.global_catid1 = c1.id
    LEFT JOIN categories c2 ON p.global_catid2 = c2.id
    LEFT JOIN categories c3 ON p.global_catid3 = c3.id
    WHERE p.id = ?
  `
    )
    .get(productId) as Product & {
    category1_th?: string;
    category2_th?: string;
    category3_th?: string;
  };

  if (!product) {
    throw error(404, 'Product not found');
  }

  const tags = db
    .prepare(
      `
    SELECT 
      t.*,
      COUNT(pt2.product_id) as product_count
    FROM tags t
    JOIN product_tags pt ON t.id = pt.tag_id
    LEFT JOIN product_tags pt2 ON t.id = pt2.tag_id
    WHERE pt.product_id = ?
    GROUP BY t.id
  `
    )
    .all(productId) as Tag[];

  const relatedProducts = db
    .prepare(
      `
    WITH SameBrandProducts AS (
      SELECT 
        p.*,
        b.id as brand_id,
        b.name as brand_name,
        0 as shared_tags,
        1 as same_brand
      FROM products p
      LEFT JOIN brands b ON p.global_brand = b.name
      WHERE p.global_brand = ? AND p.id != ? AND p.global_brand != 'NoBrand'
      LIMIT ?/2
    ),
    SharedTagProducts AS (
      SELECT 
        p.*,
        b.id as brand_id,
        b.name as brand_name,
        COUNT(pt2.tag_id) as shared_tags,
        0 as same_brand
      FROM products p
      LEFT JOIN brands b ON p.global_brand = b.name
      JOIN product_tags pt1 ON pt1.product_id = ?
      JOIN product_tags pt2 ON pt2.tag_id = pt1.tag_id AND pt2.product_id = p.id
      WHERE p.id != ? AND p.global_brand != ?
      GROUP BY p.id
      ORDER BY shared_tags DESC, p.item_sold DESC
      LIMIT ?/2
    )
    SELECT * FROM SameBrandProducts
    UNION ALL
    SELECT * FROM SharedTagProducts
    ORDER BY same_brand DESC, shared_tags DESC, item_sold DESC
  `
    )
    .all(
      product.global_brand,
      productId,
      ITEMS_PER_PAGE,
      productId,
      productId,
      product.global_brand,
      ITEMS_PER_PAGE
    ) as Product[];

  const categories = [
    product.category1_th && product.global_catid1
      ? { id: product.global_catid1, name_th: product.category1_th }
      : null,
    product.category2_th && product.global_catid2
      ? { id: product.global_catid2, name_th: product.category2_th }
      : null,
    product.category3_th && product.global_catid3
      ? { id: product.global_catid3, name_th: product.category3_th }
      : null
  ].filter((cat): cat is { id: number; name_th: string } => cat !== null);

  return {
    product,
    tags,
    relatedProducts,
    categories
  };
};
