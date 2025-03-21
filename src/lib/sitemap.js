import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import { writeFile } from 'fs/promises';

// An array with your links
const links = [
  { url: '/', changefreq: 'daily', priority: 0.3 },
  { url: '/products/25534416530', changefreq: 'daily', priority: 1 }
];

const stream = new SitemapStream({ hostname: 'https://delamai.com' });

const sitemap = await streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
  data.toString()
);
await writeFile('build/client/sitemap.xml', sitemap);
