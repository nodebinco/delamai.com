import Database from 'better-sqlite3';
import { DATABASE_URL } from '$env/static/private';
import path from 'path';

const __dirname = path.resolve();
export const db = new Database(path.join(__dirname, DATABASE_URL));

// db.pragma('cache_size = -8000000');
// db.pragma('temp_store = MEMORY');
// db.pragma('mmap_size = 30000000000');
// db.pragma('synchronous = NORMAL');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('automatic_index = true');
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
  brand_name?: string;
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
  product_count?: number;
}
export interface ProductTag {
  product_id: string;
  tag_id: string;
}

export interface Cache {
  key: string;
  value: string;
}

export function getCache(key: string): any | null {
  try {
    const result = db.prepare('SELECT value, created_at FROM cache WHERE key = ?').get(key) as
      | { value: string; created_at: string }
      | undefined;

    if (!result) {
      return null;
    }

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
