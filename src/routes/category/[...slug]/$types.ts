import type { ServerLoad } from '@sveltejs/kit';
import type { Product, Category } from '$lib/db';

export interface PageData {
  categoryId: string;
  category: Category;
  products: Product[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  ITEMS_PER_PAGE: number;
}

export type Load = ServerLoad<Record<string, never>, PageData>;
