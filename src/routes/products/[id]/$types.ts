import type { ServerLoad } from '@sveltejs/kit';
import type { Product as DbProduct } from '$lib/db';

export interface CountResult {
  count: number;
}

export interface PageData {
  product: DbProduct;
  relatedProducts: DbProduct[];
  totalPages: number;
}

export interface PageParams {
  id: string;
  page?: string;
  [key: string]: string | undefined;
}

export type Load = ServerLoad<PageParams, PageData>; 