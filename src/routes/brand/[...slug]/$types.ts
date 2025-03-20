import type { ServerLoad } from '@sveltejs/kit';
import type { Product as DbProduct, Tag as DbTag } from '$lib/db';

export interface PageData {
  tags: DbTag[];
  products: DbProduct[];
  totalPages: number;
  currentPage: number;
}

export type Load = ServerLoad<Record<string, never>, PageData>;
