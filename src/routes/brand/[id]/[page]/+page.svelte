<script lang="ts">
  import { page } from '$app/stores';
  import type { PageData } from './$types';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import Pagination from '$lib/components/Pagination.svelte';
  import { db } from '$lib/db';

  export let data: PageData;
  const { brand, products, totalPages } = data;
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">{brand.name}</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {#each products as product}
      <ProductCard {product} />
    {/each}
  </div>

  <Pagination 
    currentPage={$page.params.page} 
    totalPages={totalPages} 
    baseUrl={`/brand/${$page.params.id}`} 
  />
</div> 