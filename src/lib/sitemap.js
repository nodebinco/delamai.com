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

  return links;
}

await writeFile('build/client/sitemap.xml', sitemap);
