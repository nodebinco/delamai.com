<script lang="ts">
  import type { PageData } from './$types';
  import type { Product } from '$lib/db';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import Pagination from '$lib/components/Pagination.svelte';
  export let data: PageData;

  $: ({ products, total, currentPage, totalPages, query } = data);
  $: typedProducts = products as Product[];

  function formatNumber(num: number): string {
    return num.toLocaleString('th-TH');
  }
</script>

<svelte:head>
  <title>{data.query} - เดอละมัย (delamai)</title>
  <meta name="description" content="ผลการค้นหาสำหรับ {data.query} - เดอละมัย (delamai)" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="mb-8 text-center">
    <h1 class="mb-4 text-3xl font-bold">ผลการค้นหา</h1>
    {#if query}
      <p class="text-gray-600">
        ค้นหาสำหรับ "{query}" - พบ {formatNumber(total)} รายการ
      </p>
    {:else}
      <p class="text-gray-600">กรุณาระบุคำค้นหา</p>
    {/if}
  </div>

  {#if typedProducts.length > 0}
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {#each typedProducts as product (product.id)}
        <ProductCard {product} />
      {/each}
    </div>

    {#if totalPages > 1}
      <div class="mt-8">
        <Pagination
          currentPage={currentPage.toString()}
          {totalPages}
          baseUrl={`/search/${query}`}
        />
      </div>
    {/if}
  {:else if query}
    <div class="py-12 text-center">
      <p class="text-gray-500">ไม่พบสินค้าที่ค้นหา</p>
    </div>
  {/if}
</div>
