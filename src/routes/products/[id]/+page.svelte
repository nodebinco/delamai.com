<script lang="ts">
  import { page } from '$app/stores';
  import type { PageData } from './$types';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import Pagination from '$lib/components/Pagination.svelte';
  
  export let data: PageData;
</script>

<div class="container mx-auto px-4 py-8">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
    <div>
      <img 
        src={data.product.image_link} 
        alt={data.product.title}
        class="w-full h-auto rounded-lg shadow-lg"
      />
    </div>
    <div>
      <h1 class="text-3xl font-bold mb-4">{data.product.title}</h1>
      <p class="text-gray-600 mb-4">{data.product.short_description}</p>
      <div class="flex items-center gap-4 mb-6">
        <span class="text-2xl font-bold text-blue-600">
          ${data.product.sale_price.toFixed(2)}
        </span>
        {#if data.product.sale_price < data.product.price}
          <span class="text-lg text-gray-500 line-through">
            ${data.product.price.toFixed(2)}
          </span>
        {/if}
      </div>
      <div class="prose max-w-none">
        {@html data.product.description}
      </div>
    </div>
  </div>

  <div class="mt-12">
    <h2 class="text-2xl font-bold mb-6">Related Products</h2>
    
    {#if data.relatedProducts.length === 0}
      <p class="text-gray-600">No related products found.</p>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {#each data.relatedProducts as product}
          <ProductCard {product} />
        {/each}
      </div>

      <div class="mt-8">
        <Pagination 
          currentPage={$page.params.page || '1'}
          totalPages={data.totalPages}
          baseUrl={`/products/${$page.params.id}`}
        />
      </div>
    {/if}
  </div>
</div> 