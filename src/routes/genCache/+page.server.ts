import { db } from '$lib/db';
import { loadProduct, loadTag, loadBrand, loadCategory } from '$lib/loaders';

interface DbRecord {
  id: string;
}

const CHUNK_SIZE = 100;

async function processChunk<T extends DbRecord>(
  items: T[],
  processor: (id: string) => Promise<any>,
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

export const load = async () => {
  try {
    console.log('Generating cache...');

    // Cache products
    const products = db.prepare('SELECT id FROM products').all() as DbRecord[];
    console.log(`Caching ${products.length} products...`);
    await processChunk(products, loadProduct, 'product', products.length);

    // Cache tags
    const tags = db.prepare('SELECT id FROM tags').all() as DbRecord[];
    console.log(`Caching ${tags.length} tags...`);
    await processChunk(tags, loadTag, 'tag', tags.length);

    // Cache brands
    const brands = db.prepare('SELECT id FROM brands').all() as DbRecord[];
    console.log(`Caching ${brands.length} brands...`);
    await processChunk(brands, loadBrand, 'brand', brands.length);

    // Cache categories
    const categories = db.prepare('SELECT id FROM categories').all() as DbRecord[];
    console.log(`Caching ${categories.length} categories...`);
    await processChunk(categories, loadCategory, 'category', categories.length);

    console.log('Cache generation complete.');
    return { success: true, message: 'Cache generation complete' };
  } catch (error) {
    console.error('Error generating cache:', error);
    return { success: false, message: 'Error generating cache' };
  }
};