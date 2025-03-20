import type { ServerLoad } from '@sveltejs/kit';
import type { Product, Category } from '$lib/db';

export interface CategoryWithCount extends Category {
  product_count: number;
}

export interface PageData {
  featuredProducts: Product[];
  heroProducts: Product[];
  categories: CategoryWithCount[];
}

export type Load = ServerLoad<Record<string, never>, PageData>;
