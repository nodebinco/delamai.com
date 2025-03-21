import Database from 'better-sqlite3';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import { writeFile } from 'fs/promises';

const db = new Database('src/lib/data.db');
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

const stream = new SitemapStream({ hostname: 'https://delamai.com' });

// Generate sitemap
const links = await generateSitemapLinks();
const sitemap = await streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
  data.toString()
);

await writeFile('build/client/sitemap.xml', sitemap);
