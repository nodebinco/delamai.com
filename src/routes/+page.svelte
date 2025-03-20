<script lang="ts">
  import type { PageData } from './$types';
  import ProductCard from '$lib/components/ProductCard.svelte';
  
  export let data: PageData;

</script>

<svelte:head>
  <title>เดอละมัย (delamai) - สินค้าขายดีจากแบรนด์ชั้นนำ</title>
  <meta name="description" content="รวบรวมสินค้าทุกหมวดที่ขายดีมาให้คุณเลือก เราตั้งใจคัดเลือก สินค้าคุณภาพจากแบรนด์ชั้นนำ เอาใจสายช้อป พร้อมบริการจัดส่งรวดเร็ว" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <!-- Hero Section -->
  <section class="mb-12">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
      {#each data.heroProducts as product}
        <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <a href="/products/{product.id}" class="block">
            <figure class="relative">
              <img 
                src={product.image_link} 
                alt={product.title}
                class="w-full h-64 object-cover"
                loading="lazy"
              />
            </figure>
          </a>
        </div>
      {/each}
    </div>
  </section>

  <!-- Featured Products Section -->
  <section class="mb-12">
    <h2 class="text-2xl font-bold mb-6">สินค้าขายดี</h2>
    {#if data.featuredProducts.length === 0}
      <div class="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>ไม่พบสินค้า</span>
      </div>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {#each data.featuredProducts as product}
          <ProductCard {product} />
        {/each}
      </div>
    {/if}
  </section>

  <!-- Categories Section -->
  <section>
    <h2 class="text-2xl font-bold mb-6">หมวดหมู่สินค้า</h2>
    {#if data.categories.length === 0}
      <div class="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>ไม่พบหมวดหมู่สินค้า</span>
      </div>
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {#each data.categories as category}
          <a 
            href="/category/{category.id}" 
            class="card bg-base-100 shadow hover:shadow-lg transition-shadow duration-300"
          >
            <div class="card-body p-4">
              <h3 class="card-title text-lg font-bold mb-2">{category.name_th}</h3>
              <p class="text-sm text-gray-500">{category.product_count.toLocaleString('th-TH')} สินค้า</p>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </section>
</div>
