import Database from 'better-sqlite3';
import { DATABASE_URL } from '$env/static/private';
import path from 'path';

const __dirname = path.resolve();
export const db = new Database(path.join(__dirname, DATABASE_URL));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Database types
export interface Product {
  id: string;
  price: number;
  sale_price: number;
  title: string;
  description: string;
  short_description: string;
  item_sold: number;
  image_link: string;
  item_rating: number;
  brand_id: string;
  global_brand: string;
  brand_name?: string; // From JOIN with brands table
  global_category1: string;
  global_category2: string;
  global_category3: string;
  global_catid1: number;
  global_catid2: number;
  global_catid3: number;
  product_link: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name_th: string;
  name_en: string;
  parent_id: string | null;
}

export interface Brand {
  id: string;
  name: string;
  name_th?: string;
  description?: string;
  image_link?: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  product_count?: number; // Optional count of products for this tag
}

export interface ProductTag {
  product_id: string;
  tag_id: string;
}

export interface Cache {
  key: string;
  value: string;
}

// Helper function to get brand with product count
export function getBrandWithProductCount(brandId: string): Brand & { product_count: number } {
  const result = db
    .prepare(
      `
    SELECT b.*, COUNT(p.id) as product_count
    FROM brands b
    LEFT JOIN products p ON b.id = p.brand_id
    WHERE b.id = ?
    GROUP BY b.id
  `
    )
    .get(brandId) as Brand & { product_count: number };

  if (!result) {
    throw new Error(`Brand with id ${brandId} not found`);
  }

  return result;
}

// Helper function to get tag with product count
export function getTagWithProductCount(tagId: string): Tag & { product_count: number } {
  const result = db
    .prepare(
      `
    SELECT t.*, COUNT(pt.product_id) as product_count
    FROM tags t
    LEFT JOIN product_tags pt ON t.id = pt.tag_id
    WHERE t.id = ?
    GROUP BY t.id
  `
    )
    .get(tagId) as Tag & { product_count: number };

  if (!result) {
    throw new Error(`Tag with id ${tagId} not found`);
  }

  return result;
}

// Cache helper functions
export function getCache(key: string): any | null {
  const result = db.prepare('SELECT value, created_at FROM cache WHERE key = ?').get(key) as
    | { value: string; created_at: string }
    | undefined;

  if (!result) {
    return null;
  }

  const cacheDate = new Date(result.created_at);
  const now = new Date();
  const diffDays = (now.getTime() - cacheDate.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays > 5) {
    db.prepare('DELETE FROM cache WHERE key = ?').run(key);
    return null;
  }

  try {
    return JSON.parse(result.value);
  } catch {
    return null;
  }
}

export function setCache(key: string, value: any): void {
  const jsonValue = JSON.stringify(value);
  const now = new Date().toISOString();

  db.prepare(
    `
    INSERT OR REPLACE INTO cache (key, value, created_at) 
    VALUES (?, ?, ?)
  `
  ).run(key, jsonValue, now);
}
