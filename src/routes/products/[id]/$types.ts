import type { ServerLoad } from '@sveltejs/kit';
import type { Product as DbProduct, Tag as DbTag } from '$lib/db';

export interface PageData {
  product: DbProduct;
  relatedProducts: DbProduct[];
  totalPages: number;
  categories: { id: number; name_th: string }[];
  tags: DbTag[];
}

export type Load = ServerLoad<Record<string, never>, PageData>;
