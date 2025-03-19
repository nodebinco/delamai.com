<script lang="ts">
  import type { PageData } from './$types';
  import ProductCard from '$lib/components/ProductCard.svelte';
  
  export let data: PageData;
  const { brand, products, totalPages, currentPage } = data;

  // Format number with commas
  function formatNumber(num: number): string {
    return num.toLocaleString('th-TH');
  }
</script>

<svelte:head>
  <title>{brand.name} - เดอละมัย (delamai)</title>
  <meta name="description" content="สินค้าจากแบรนด์ {brand.name} จากเดอละมัย" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="flex items-center gap-2 mb-6">
    <h1 class="text-3xl font-bold">{brand.name}</h1>
    <div class="badge badge-primary">{formatNumber(brand.product_count)} สินค้า</div>
  </div>

  {#if products.length === 0}
    <div class="alert alert-info">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <span>ไม่พบสินค้าจากแบรนด์นี้</span>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
      {#each products as product}
        <ProductCard {product} />
      {/each}
    </div>

    {#if totalPages > 1}
      <div class="flex justify-center">
        <div class="join">
          {#if currentPage > 1}
            <a 
              href="/brands/{brand.id}/{currentPage - 1}" 
              class="join-item btn"
            >
              «
            </a>
          {/if}
          
          {#each Array(totalPages) as _, i}
            <a 
              href="/brands/{brand.id}/{i + 1}" 
              class="join-item btn {currentPage === i + 1 ? 'btn-active' : ''}"
            >
              {i + 1}
            </a>
          {/each}
          
          {#if currentPage < totalPages}
            <a 
              href="/brands/{brand.id}/{currentPage + 1}" 
              class="join-item btn"
            >
              »
            </a>
          {/if}
        </div>
      </div>
    {/if}
  {/if}
</div> 