import Database from 'better-sqlite3';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import { writeFile } from 'fs/promises';

const db = new Database('data.db');
db.pragma('journal_mode = WAL');

async function fetchUrl(url) {
  console.log(url);

  try {
    const response = await fetch(`http://localhost:5173${url}`);
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
    }
    return response.ok;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return false;
  }
}

async function generateSitemapLinks() {
  const links = [{ url: '/', changefreq: 'daily', priority: 0.3 }];

  // Add product URLs
  const products = db.prepare('SELECT id FROM products').all();
  for (const product of products) {
    links.push({
      url: `/products/${product.id}`,
      changefreq: 'weekly',
      priority: 0.8
    });
  }

  // Add brand URLs
  const brands = db.prepare('SELECT id FROM brands').all();
  for (const brand of brands) {
    if (brand.id == '') continue;
    links.push({
      url: `/brand/${brand.id}`,
      changefreq: 'weekly',
      priority: 0.6
    });
  }

  // Add category URLs
  const categories = db.prepare('SELECT id FROM categories').all();
  for (const category of categories) {
    if (category.id == '') continue;
    links.push({
      url: `/category/${category.id}`,
      changefreq: 'weekly',
      priority: 0.6
    });
  }

  // Add tag URLs
  const tags = db.prepare('SELECT id FROM tags').all();
  for (const tag of tags) {
    if (tag.id == '') continue;
    links.push({
      url: `/tags/${tag.id}`,
      changefreq: 'weekly',
      priority: 0.5
    });
  }

  return links;
}

async function generateCache(links) {
  console.log('Fetching URLs to generate cache...');

  const CHUNK_SIZE = 50;
  let successCount = 0;
  let processedCount = 0;

  for (let i = 0; i < links.length; i += CHUNK_SIZE) {
    const chunk = links.slice(i, i + CHUNK_SIZE);
    const fetchPromises = chunk.map((link) => fetchUrl(link.url));
    const results = await Promise.all(fetchPromises);
    successCount += results.filter(Boolean).length;
    processedCount += chunk.length;

    console.log(`Processed ${processedCount}/${links.length} URLs (${successCount} successful)`);
  }

  console.log(
    `Cache generation complete. Successfully fetched ${successCount} out of ${links.length} URLs`
  );
}

const stream = new SitemapStream({ hostname: 'https://delamai.com' });

const links = await generateSitemapLinks();

const sitemap = await streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
  data.toString()
);

await writeFile('build/client/sitemap.xml', sitemap);

await generateCache(links);
