import { error } from '@sveltejs/kit';
import type { Load } from './$types';
import { loadCategory } from '$lib/loaders';

export const load: Load = async ({ params }) => {
  const slugParts = params.slug.split('/');

  if (slugParts.length > 2) {
    throw error(404, 'Not found');
  }

  const categoryId = slugParts[0];
  const page = slugParts[1] ? parseInt(slugParts[1]) : 1;

  return loadCategory(categoryId, page);
};
