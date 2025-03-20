<script lang="ts">
  import type { PageData } from './$types';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import Pagination from '$lib/components/Pagination.svelte';

  export let data: PageData;

  function formatNumber(num: number): string {
    return num.toLocaleString('th-TH');
  }
</script>

<svelte:head>
  <title>{data.brand.name} - เดอละมัย (delamai)</title>
  <meta name="description" content="สินค้าจากแบรนด์ {data.brand.name} จากเดอละมัย" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <!-- Breadcrumb -->
  <div class="breadcrumbs mb-6 text-sm">
    <ul>
      <li><a href="/" class="link link-hover text-primary">หน้าหลัก</a></li>
      <li><a href="/brand" class="link link-hover text-primary">แบรนด์</a></li>
      <li class="text-base-content/70">{data.brand.name}</li>
    </ul>
  </div>

  <!-- Brand Header -->
  <div class="mb-8 flex items-center gap-4">
    <div>
      <h1 class="text-3xl font-bold">{data.brand.name}</h1>
      {data.currentPage}
    </div>
  </div>

  <!-- Products Grid -->
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
      <span>ไม่พบสินค้าในแบรนด์นี้</span>
    </div>
  {:else}
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {#each data.products as product}
        <ProductCard {product} />
      {/each}
    </div>

    <div class="mt-8">
      <Pagination
        currentPage={data.currentPage.toString()}
        totalPages={data.totalPages}
        baseUrl={`/brand/${data.brand.id}`}
      />
    </div>
  {/if}
</div>
