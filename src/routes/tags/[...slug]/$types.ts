import type { ServerLoad } from '@sveltejs/kit';
import type { Product as DbProduct, Brand as DbBrand } from '$lib/db';

export interface PageData {
  brand: DbBrand;
  products: DbProduct[];
  totalPages: number;
  currentPage: number;
}

export type Load = ServerLoad<Record<string, never>, PageData>;
