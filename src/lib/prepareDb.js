import Database from 'better-sqlite3';

const db = new Database('src/lib/data.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    price REAL,
    sale_price REAL,
    title TEXT,
    description TEXT,
    short_description TEXT,
    item_sold INTEGER,
    image_link TEXT,
    item_rating REAL,
    global_brand TEXT,
    global_category1 TEXT,
    global_category2 TEXT,
    global_category3 TEXT,
    global_catid1 INTEGER,
    global_catid2 INTEGER,
    global_catid3 INTEGER,
    product_link TEXT,
    updated_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name_th TEXT,
    name_en TEXT,
    parent_id TEXT,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS brands (
    id TEXT PRIMARY KEY,
    name TEXT
  );

  CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    name TEXT
  );

  CREATE TABLE IF NOT EXISTS product_tags (
    product_id TEXT,
    tag_id TEXT,
    PRIMARY KEY (product_id, tag_id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
  );

  CREATE TABLE IF NOT EXISTS cache (
    key TEXT PRIMARY KEY,
    value JSONB,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
