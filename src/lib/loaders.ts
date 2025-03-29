import { error } from '@sveltejs/kit';
import type { Product, Tag, Brand, Category } from './db';
import { db, getCache, setCache } from './db';
import { omit } from 'ramda';

const ITEMS_PER_PAGE = 120;

type ExtendedProduct = Omit<Product, 'brand_id'> & {
  brand_id?: string;
  brand_name?: string;
  shared_tags?: number;
  same_brand?: number;
};

interface DbRecord {
  id: string;
}

export async function generateAllCache() {
  try {
    console.log('Generating cache...');

    // Cache products
    const products = db.prepare('SELECT id FROM products').all() as DbRecord[];
    console.log(`Caching ${products.length} products...`);
    for (const product of products) {
      try {
        await loadProduct(product.id);
      } catch (error) {
        console.error(`Error caching product ${product.id}:`, error);
      }
    }

    // Cache tags
    const tags = db.prepare('SELECT id FROM tags').all() as DbRecord[];
    console.log(`Caching ${tags.length} tags...`);
    for (const tag of tags) {
      try {
        await loadTag(tag.id);
      } catch (error) {
        console.error(`Error caching tag ${tag.id}:`, error);
      }
    }

    // Cache brands
    const brands = db.prepare('SELECT id FROM brands').all() as DbRecord[];
    console.log(`Caching ${brands.length} brands...`);
    for (const brand of brands) {
      try {
        await loadBrand(brand.id);
      } catch (error) {
        console.error(`Error caching brand ${brand.id}:`, error);
      }
    }

    // Cache categories
    const categories = db.prepare('SELECT id FROM categories').all() as DbRecord[];
    console.log(`Caching ${categories.length} categories...`);
    for (const category of categories) {
      try {
        await loadCategory(category.id);
      } catch (error) {
        console.error(`Error caching category ${category.id}:`, error);
      }
    }

    console.log('Cache generation complete.');
    return { success: true, message: 'Cache generation complete' };
  } catch (error) {
    console.error('Error generating cache:', error);
    return { success: false, message: 'Error generating cache' };
  }
}

export const loadProduct = async (productId: string) => {
  const cacheKey = `product_${productId}`;
  const cachedData = getCache(cacheKey);

  if (cachedData) {
    return cachedData;
  }

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

  let relatedProducts: Product[] = [];
  let categoryProducts: Product[] = [];
  relatedProducts = db
    .prepare(
      `
    WITH SameBrandProducts AS (
      SELECT 
        p.id, p.title, p.image_link, p.item_rating, p.item_sold, p.sale_price, p.product_link,
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
        p.id, p.title, p.image_link, p.item_rating, p.item_sold, p.sale_price, p.product_link,
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

  if (relatedProducts.length < ITEMS_PER_PAGE) {
    categoryProducts = db
      .prepare(
        `
        SELECT DISTINCT
        p.id, p.title, p.image_link, p.item_rating, p.item_sold, p.sale_price, p.product_link,
          b.id as brand_id,
          b.name as brand_name
        FROM products p
        LEFT JOIN brands b ON p.global_brand = b.name
        WHERE p.id != ?
          AND p.id NOT IN (${relatedProducts.map((p) => p.id).join(',') || '0'})
          AND (p.global_catid3 = ? OR p.global_catid2 = ?)
        ORDER BY 
          CASE 
            WHEN p.global_catid3 = ? THEN 2
            WHEN p.global_catid2 = ? THEN 1
          END DESC,
          item_sold DESC
        LIMIT ?
      `
      )
      .all(
        productId,
        product.global_catid3,
        product.global_catid2,
        product.global_catid3,
        product.global_catid2,
        ITEMS_PER_PAGE - relatedProducts.length
      ) as Product[];
  }

  relatedProducts = Array.from(
    new Map([...relatedProducts, ...categoryProducts].map((item) => [item.id, item])).values()
  )
    .slice(0, ITEMS_PER_PAGE)
    .map(
      (item) =>
        omit(
          ['brand_id', 'brand_name', 'shared_tags', 'same_brand'],
          item as ExtendedProduct
        ) as Product
    );

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

  const data = {
    product,
    tags,
    relatedProducts,
    categories
  };

  setCache(cacheKey, data);

  return data;
};

export async function loadTag(tagId: string, page: number = 1) {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const cacheKey = `tag_${tagId}_${page}`;
  const cachedData = getCache(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const tag = db.prepare('SELECT * FROM tags WHERE id = ?').get(tagId) as Tag;
  if (!tag) {
    throw error(404, 'Tag not found');
  }

  const totalCount = (
    db
      .prepare(
        `
    SELECT COUNT(id) as count 
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
    SELECT id, title, image_link, item_rating, item_sold, sale_price, product_link
    FROM products p
    JOIN product_tags pt ON p.id = pt.product_id
    WHERE pt.tag_id = ?
    ORDER BY p.item_sold DESC 
    LIMIT ? OFFSET ?
  `
    )
    .all(tagId, ITEMS_PER_PAGE, offset) as Product[];

  const data = {
    tag,
    products,
    totalPages,
    totalCount,
    currentPage: page,
    ITEMS_PER_PAGE
  };

  setCache(cacheKey, data);

  return data;
}

export async function loadBrand(brandId: string, page: number = 1) {
  if (isNaN(page) || page < 1) {
    throw error(400, 'Invalid page number');
  }

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
    db
      .prepare('SELECT COUNT(id) as count FROM products WHERE global_brand = ?')
      .get(brand.name) as {
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
    SELECT id, title, image_link, item_rating, item_sold, sale_price, product_link
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

  setCache(cacheKey, data);

  return data;
}

export async function loadCategory(categoryId: string, page: number = 1) {
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
}
