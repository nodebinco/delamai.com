import { loadProduct } from '$lib/loaders';
import type { Load } from './$types';

export const load: Load = async ({ params }) => {
  return loadProduct(params.id);
};
