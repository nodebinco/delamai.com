import type { ServerLoad } from '@sveltejs/kit';
import type { Product as DbProduct, Tag as DbTag, Product } from '$lib/db';

export interface PageData {
  product: DbProduct;
  relatedProducts: DbProduct[];
  totalPages: number;
  categories: { id: number; name_th: string }[];
  tags: DbTag[];
}

export interface ExtendedProduct extends Product {
  brand_name?: string;
  shared_tags?: number;
  same_brand?: number;
}

export type Load = ServerLoad<Record<string, never>, PageData>;
