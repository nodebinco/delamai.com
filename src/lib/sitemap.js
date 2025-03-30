import Database from 'better-sqlite3';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import { writeFile } from 'fs/promises';

const db = new Database('data.db');
db.pragma('journal_mode = WAL');

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
const stream = new SitemapStream({ hostname: 'https://delamai.com' });

const links = await generateSitemapLinks();

const sitemap = await streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
  data.toString()
);

await writeFile('build/client/sitemap.xml', sitemap);
