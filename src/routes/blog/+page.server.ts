import type { PageServerLoad } from './$types';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  created_at: string;
}

export const load: PageServerLoad = async () => {
  // TODO: Replace with actual API call to fetch blog posts
  const posts: BlogPost[] = [
    {
      id: 1,
      title: 'จัดระเบียบคำอธิบายสินค้าให้น่าซื้อ ด้วยเครื่องมือฟรีจาก OnlineMarkdown.com',
      slug: 'online-markdown-tool',
      created_at: '2025-04-17'
    }
    // Add more posts as needed
  ];

  return {
    posts
  };
}; 