import type { ServerLoad } from '@sveltejs/kit';
import type { Product as DbProduct, Category as DbCategory } from '$lib/db';

export interface PageData {
  categoryId: string;
  category: DbCategory;
  products: DbProduct[];
  totalPages: number;
  currentPage: number;
  ITEMS_PER_PAGE: number;
}

export type Load = ServerLoad<Record<string, never>, PageData>;
