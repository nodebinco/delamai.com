<script lang="ts">
  import type { PageData } from './$types';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import Pagination from '$lib/components/Pagination.svelte';

  export let data: PageData;

  // Format number with commas
  function formatNumber(num: number): string {
    return num.toLocaleString('th-TH');
  }
</script>

<svelte:head>
  <title>{data.tag.name} - เดอละมัย (delamai)</title>
  <meta name="description" content="สินค้าที่มีแท็ก {data.tag.name} จากเดอละมัย" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="mb-6 flex items-center gap-2">
    <h1 class="text-3xl font-bold">{data.tag.name}</h1>
    <div class="badge badge-accent">{formatNumber(data.totalCount)} สินค้า</div>
  </div>

  {#if data.products.length === 0}
    <div class="alert alert-info">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="h-6 w-6 shrink-0 stroke-current"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path></svg
      >
      <span>ไม่พบสินค้าที่มีแท็กนี้</span>
    </div>
  {:else}
    <div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {#each data.products as product}
        <ProductCard {product} />
      {/each}
    </div>

    <div class="mt-8">
      <Pagination
        currentPage={data.currentPage.toString()}
        totalPages={data.totalPages}
        baseUrl={`/tags/${data.tag.id}`}
      />
    </div>
  {/if}
</div>
