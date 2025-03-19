<script lang="ts">
  import { page } from '$app/stores';
  import type { PageData } from './$types';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import Pagination from '$lib/components/Pagination.svelte';

  export let data: PageData;
  const { category, products, totalPages } = data;
</script>

<div class="container mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold">{category.name_en}</h1>
    <p class="text-xl text-gray-600">{category.name_th}</p>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {#each products as product}
      <ProductCard {product} />
    {/each}
  </div>

  <Pagination 
    currentPage={$page.params.page} 
    totalPages={totalPages} 
    baseUrl={`/category/${$page.params.id}`} 
  />
</div> 