import type { ServerLoad } from '@sveltejs/kit';
import type { Product, Tag } from '$lib/db';

export interface PageData {
  tag: Tag;
  products: Product[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
  ITEMS_PER_PAGE: number;
}

export type Load = ServerLoad<Record<string, never>, PageData>;
