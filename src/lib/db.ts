import Database from 'better-sqlite3';

export const db = new Database('src/lib/data.db');

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
  global_brand: string;
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
}

export interface Tag {
  id: string;
  name: string;
}

export interface ProductTag {
  product_id: string;
  tag_id: string;
}

export interface Cache {
  key: string;
  value: string;
}
