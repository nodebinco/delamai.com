import { db } from '$lib/db';

interface RSSProduct {
  id: string;
  title: string;
  short_description: string | null;
  image_link: string | null;
  updated_at: string;
}

export const GET = async () => {
  const products = db
    .prepare(
      `SELECT id, title, short_description, image_link, updated_at 
             FROM products 
             ORDER BY RANDOM() 
             LIMIT 200`
    )
    .all() as RSSProduct[];

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
        <channel>
            <title>เดอละมัย (delamai) - สินค้าขายดี</title>
            <link>https://delamai.com</link>
            <description>รวบรวมสินค้าทุกหมวดที่ขายดีมาให้คุณเลือก เราตั้งใจคัดเลือก สินค้าคุณภาพจากแบรนด์ชั้นนำ</description>
            <atom:link href="https://delamai.com/rss" rel="self" type="application/rss+xml"/>
            <language>th-TH</language>
            <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
            ${products
              .map(
                (product) => `
                <item>
                    <title><![CDATA[${product.title}]]></title>
                    <link>https://delamai.com/products/${product.id}</link>
                    <guid>https://delamai.com/products/${product.id}</guid>
                    <description><![CDATA[${product.short_description || ''}]]></description>
                    <pubDate>${new Date().toUTCString()}</pubDate>
                    ${product.image_link ? `<enclosure url="${product.image_link}" type="image/jpeg"/>` : ''}
                </item>
            `
              )
              .join('')}
        </channel>
    </rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=43200'
    }
  });
};
