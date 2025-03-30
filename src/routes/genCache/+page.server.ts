import { db } from '$lib/db';
import { loadProduct, loadTag, loadBrand, loadCategory } from '$lib/loaders';
import type { Product, Tag, Brand, Category } from '$lib/db';

interface DbRecord {
  id: string;
}

interface ItemCount extends DbRecord {
  count: number;
}

const CHUNK_SIZE = 100;
const ITEMS_PER_PAGE = 120;

async function processChunk<T extends DbRecord>(
  items: T[],
  processor: (id: string) => Promise<{ product: Product; tags: Tag[]; relatedProducts: Product[]; categories: { id: number; name_th: string }[] }>,
  type: string,
  totalCount: number
): Promise<void> {
  const chunks = [];
  for (let i = 0; i < items.length; i += CHUNK_SIZE) {
    chunks.push(items.slice(i, i + CHUNK_SIZE));
  }

  let processedCount = 0;
  for (const chunk of chunks) {
    await Promise.all(
      chunk.map(async (item) => {
        try {
          await processor(item.id);
          processedCount++;
          console.log(`Cached ${type} ${item.id} (${processedCount}/${totalCount})`);
        } catch (error) {
          console.error(`Error caching ${type} ${item.id}:`, error);
        }
      })
    );
  }
}

async function processChunkWithPagination<T extends ItemCount>(
  items: T[],
  processor: (id: string, page: number) => Promise<{ tag?: Tag; brand?: Brand; category?: Category; products: Product[]; totalPages: number; currentPage: number; totalCount: number; ITEMS_PER_PAGE: number }>,
  type: string,
  totalCount: number
): Promise<void> {
  const chunks = [];
  for (let i = 0; i < items.length; i += CHUNK_SIZE) {
    chunks.push(items.slice(i, i + CHUNK_SIZE));
  }

  let processedCount = 0;
  for (const chunk of chunks) {
    await Promise.all(
      chunk.map(async (item) => {
        try {
          const totalPages = Math.ceil(item.count / ITEMS_PER_PAGE);
          
          // Cache all pages
          for (let page = 1; page <= totalPages; page++) {
            await processor(item.id, page);
            console.log(`Cached ${type} ${item.id} page ${page}/${totalPages} (${processedCount + 1}/${totalCount})`);
          }
          processedCount++;
        } catch (error) {
          console.error(`Error caching ${type} ${item.id}:`, error);
        }
      })
    );
  }
}

export const load = async () => {
  try {
    console.log('Generating cache...');

    // Cache products (no pagination needed)
    const products = db.prepare('SELECT id FROM products').all() as DbRecord[];
    console.log(`Caching ${products.length} products...`);
    await processChunk(products, loadProduct, 'product', products.length);

    // Cache tags with pagination
    const tags = db.prepare(`
      SELECT t.id, COUNT(pt.product_id) as count 
      FROM tags t 
      LEFT JOIN product_tags pt ON t.id = pt.tag_id 
      GROUP BY t.id
    `).all() as ItemCount[];
    console.log(`Caching ${tags.length} tags...`);
    await processChunkWithPagination(tags, loadTag, 'tag', tags.length);

    // Cache brands with pagination
    const brands = db.prepare(`
      SELECT b.id, COUNT(p.id) as count 
      FROM brands b 
      LEFT JOIN products p ON p.global_brand = b.name 
      GROUP BY b.id
    `).all() as ItemCount[];
    console.log(`Caching ${brands.length} brands...`);
    await processChunkWithPagination(brands, loadBrand, 'brand', brands.length);

    // Cache categories with pagination
    const categories = db.prepare(`
      SELECT c.id, COUNT(p.id) as count 
      FROM categories c 
      LEFT JOIN products p ON p.global_catid1 = c.id OR p.global_catid2 = c.id OR p.global_catid3 = c.id 
      GROUP BY c.id
    `).all() as ItemCount[];
    console.log(`Caching ${categories.length} categories...`);
    await processChunkWithPagination(categories, loadCategory, 'category', categories.length);

    console.log('Cache generation complete.');
    return { success: true, message: 'Cache generation complete' };
  } catch (error) {
    console.error('Error generating cache:', error);
    return { success: false, message: 'Error generating cache' };
  }
};