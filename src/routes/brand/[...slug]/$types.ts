import type { ServerLoad } from '@sveltejs/kit';
import type { Product, Brand } from '$lib/db';

export interface PageData {
  brand: Brand;
  products: Product[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
  ITEMS_PER_PAGE: number;
}

export type Load = ServerLoad<Record<string, never>, PageData>;
