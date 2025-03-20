<script lang="ts">
  import { page } from '$app/stores';
  import type { PageData } from './$types';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import Pagination from '$lib/components/Pagination.svelte';

  export let data: PageData;

  $: startItem = (data.currentPage - 1) * data.ITEMS_PER_PAGE + 1;
  $: endItem = Math.min(data.currentPage * data.ITEMS_PER_PAGE, data.totalCount);
  $: totalCount = data.totalCount;

  function formatNumber(num: number): string {
    return num.toLocaleString('th-TH');
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="mb-8 text-center">
    <h1 class="text-3xl font-bold">{data.category.name_en}</h1>
    <p class="text-xl text-gray-600">{data.category.name_th}</p>
    <p class="mt-2 text-sm text-gray-600">
      แสดง {formatNumber(startItem)}-{formatNumber(endItem)} จาก {formatNumber(totalCount)} รายการ
    </p>
  </div>

  <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {#each data.products as product}
      <ProductCard {product} />
    {/each}
  </div>

  <div class="mt-8">
    <Pagination
      currentPage={data.currentPage.toString()}
      totalPages={data.totalPages}
      baseUrl={`/category/${data.category.id}`}
    />
  </div>
</div>
