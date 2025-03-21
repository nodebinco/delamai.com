<script lang="ts">
  import type { PageData } from './$types';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import { onMount } from 'svelte';

  export let data: PageData;

  let showFullDescription = false;
  let showStickyBar = false;

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: data.product.title,
    description: data.product.short_description || data.product.description,
    image: data.product.image_link,
    offers: {
      '@type': 'Offer',
      price: data.product.sale_price,
      priceCurrency: 'THB',
      availability: 'https://schema.org/InStock',
      url: data.product.product_link,
      seller: {
        '@type': 'Organization',
        name: 'Delamai',
        url: 'https://delamai.com'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: data.product.item_rating,
      reviewCount: data.product.item_sold,
      bestRating: '5',
      worstRating: '1'
    },
    brand: {
      '@type': 'Brand',
      name: data.product.brand_name || 'NoBrand'
    },
    sku: data.product.id,
    mpn: data.product.id,
    url: `https://delamai.com/products/${data.product.id}`
  };

  const jsonLdScript = `<script type="application/ld+json">${JSON.stringify(jsonLd) + '<'}/script>`;

  function formatNumber(num: number): string {
    return num.toLocaleString('th-TH');
  }

  function calculateDiscount(original: number, sale: number): number {
    return Math.round(((original - sale) / original) * 100);
  }

  onMount(() => {
    const handleScroll = () => {
      showStickyBar = window.scrollY > 300;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<svelte:head>
  <title>{data.product.title} - เดอละมัย (delamai)</title>
  <meta
    name="description"
    content={data.product.short_description || data.product.description.slice(0, 160)}
  />
  {#if data.tags && data.tags.length > 0}
    <meta name="keywords" content={data.tags.map((tag) => tag.name).join(', ')} />
  {/if}

  <!-- Open Graph -->
  <meta property="og:title" content={data.product.title} />
  <meta
    property="og:description"
    content={data.product.short_description || data.product.description.slice(0, 160)}
  />
  <meta property="og:image" content={data.product.image_link} />
  <meta property="og:url" content={`https://delamai.com/products/${data.product.id}`} />
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="เดอละมัย (delamai)" />

  {@html jsonLdScript}
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <!-- Breadcrumb -->
  {#if data.categories.length > 0}
    <div class="breadcrumbs mb-4 text-sm">
      <ul>
        <li>
          <a href="/" class="link link-hover text-primary">หน้าหลัก</a>
        </li>
        {#each data.categories as category}
          <li>
            <a href="/category/{category.id}/1" class="link link-hover text-primary">
              {category.name_th}
            </a>
          </li>
        {/each}
        <li class="text-base-content/70">{data.product.title}</li>
      </ul>
    </div>
  {/if}

  <div class="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
    <div>
      <img
        src={data.product.image_link}
        alt={data.product.title}
        class="h-auto w-full rounded-lg shadow-xs"
      />
    </div>
    <div class="space-y-3">
      <h1 class="text-3xl font-bold">{data.product.title}</h1>

      <!-- Rating and Sales -->
      <div class="flex items-center gap-2">
        <div class="rating rating-md">
          {#each Array(5) as _, i}
            <input
              type="radio"
              name="rating-{data.product.id}"
              class="mask mask-star-2 bg-orange-400"
              checked={i + 1 === Math.round(data.product.item_rating)}
              disabled
            />
          {/each}
        </div>
        <div class="text-gray-600">({data.product.item_rating.toFixed(1)})</div>

        <div class="ml-4">
          ขายแล้ว {formatNumber(data.product.item_sold)} ชิ้น
        </div>
      </div>

      <!-- Price -->
      <div class="flex items-center gap-4">
        <span class="text-primary text-2xl font-bold">
          {formatNumber(data.product.sale_price)} บาท
        </span>
        {#if data.product.sale_price < data.product.price}
          <div class="flex items-center gap-2">
            <span class="text-lg text-gray-500 line-through">
              {formatNumber(data.product.price)} บาท
            </span>
            <span class="badge badge-error text-white">
              ประหยัด {calculateDiscount(data.product.price, data.product.sale_price)}%
            </span>
          </div>
        {/if}
      </div>

      <!-- Buy Button -->
      <div>
        <button
          class="btn h-12 w-full gap-2 rounded-lg border-0 bg-[#ee4d2d] text-white hover:bg-[#d73211]"
          on:click={() => {
            window.open(
              `${data.product.product_link}?uls_trackid=526tokeq018r&utm_campaign=id_7Qvn7oXhvC&utm_content=delamai----&utm_medium=affiliates&utm_source=an_15375710115&utm_term=cp74y3rr4b1h`,
              '_blank',
              'noopener,noreferrer'
            );
          }}
        >
          <img src="/shopee.svg" alt="Shopee" class="h-5 w-5" />
          <span class="text-lg">ซื้อที่ Shopee</span>
        </button>
      </div>

      <!-- Short Description -->
      {#if data.product.short_description}
        <div class="prose max-w-none py-4">
          <p class="text-xl font-medium">{data.product.short_description}</p>
        </div>
      {/if}

      <!-- Brand -->
      {#if data.product.brand_name && data.product.brand_name !== 'NoBrand'}
        <div class="flex items-center gap-2">
          <span class="text-sm font-semibold">แบรนด์:</span>
          <a
            href="/brand/{data.product.brand_id}"
            class="badge badge-warning transition-opacity duration-200 hover:opacity-75"
          >
            {data.product.brand_name}
          </a>
        </div>
      {/if}

      <!-- Tags -->
      {#if data.tags && data.tags.length > 0}
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-sm font-semibold">แท็ก:</span>
          {#each data.tags as tag}
            <a
              href="/tags/{tag.id}"
              class="badge badge-outline transition-opacity duration-200 hover:opacity-75"
            >
              {tag.name}
            </a>
          {/each}
        </div>
      {/if}

      <!-- Buy Button -->
      <div class="pt-2">
        <button
          class="btn h-12 w-full gap-2 rounded-lg border-0 bg-[#ee4d2d] text-white hover:bg-[#d73211]"
          on:click={() => {
            window.open(
              `${data.product.product_link}?uls_trackid=526tokeq018r&utm_campaign=id_7Qvn7oXhvC&utm_content=delamai----&utm_medium=affiliates&utm_source=an_15375710115&utm_term=cp74y3rr4b1h`,
              '_blank',
              'noopener,noreferrer'
            );
          }}
        >
          <img src="/shopee.svg" alt="Shopee" class="h-5 w-5" />
          <span class="text-lg">ซื้อที่ Shopee</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Description (Full Width for iPad and up) -->
  <div class="mb-12 md:col-span-2">
    <div class="prose prose-lg max-w-none">
      <h3 class="text-lg font-semibold">รายละเอียดสินค้า</h3>
      <div class="relative">
        <div
          class={showFullDescription
            ? 'description-content'
            : 'description-content max-h-64 overflow-hidden'}
        >
          <div
            class="
            [&_*]:!font-inherit
            [&_*]:!text-inherit
            [&_.mb-1]:!mb-1
            [&_.mb-2]:!mb-2
            [&_.mb-3]:!mb-3
            [&_.mb-4]:!mb-4
            [&_.mb-5]:!mb-5
            [&_.ml-1]:!ml-1
            [&_.ml-2]:!ml-2
            [&_.ml-3]:!ml-3
            [&_.ml-4]:!ml-4
            [&_.ml-5]:!ml-5
            [&_.mr-1]:!mr-1
            [&_.mr-2]:!mr-2
            [&_.mr-3]:!mr-3
            [&_.mr-4]:!mr-4
            [&_.mr-5]:!mr-5
            [&_.mt-1]:!mt-1
            [&_.mt-2]:!mt-2
            [&_.mt-3]:!mt-3
            [&_.mt-4]:!mt-4
            [&_.mt-5]:!mt-5
            [&_b]:!font-bold
            [&_h1]:!my-4
            [&_h1]:!text-3xl
            [&_h1]:!font-bold
            [&_h2]:!my-3
            [&_h2]:!text-2xl
            [&_h2]:!font-bold
            [&_h3]:!my-2
            [&_h3]:!text-xl
            [&_h3]:!font-bold
            [&_h4]:!my-2
            [&_h4]:!text-lg
            [&_h4]:!font-bold
            [&_i]:!italic
            [&_img]:!my-0
            [&_li]:!ml-4
            [&_ol]:!list-decimal
            [&_ol]:!pl-5
            [&_p]:!my-2
            [&_strong]:!font-bold
            [&_u]:!underline
            [&_ul]:!list-disc
            [&_ul]:!pl-5
          "
          >
            {@html data.product.description}
          </div>
        </div>
        {#if !showFullDescription}
          <div
            class="absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-t from-white to-transparent"
          ></div>
        {/if}
      </div>
      <button
        class="btn btn-ghost btn-sm mt-2 h-10 w-full"
        on:click={() => (showFullDescription = !showFullDescription)}
      >
        {showFullDescription ? 'แสดงน้อยลง' : 'แสดงเพิ่มเติม'}
      </button>
    </div>
  </div>

  <!-- Related Products -->
  <div>
    <h2 class="mb-4 text-2xl font-bold">สินค้าที่คุณอาจสนใจ</h2>

    {#if data.relatedProducts.length === 0}
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
        <span>ไม่พบสินค้าที่เกี่ยวข้อง</span>
      </div>
    {:else}
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {#each data.relatedProducts as product}
          <ProductCard {product} />
        {/each}
      </div>
    {/if}
  </div>
</div>

<!-- Sticky Bar -->
{#if showStickyBar}
  <div
    class="fixed right-0 bottom-0 left-0 z-50 transform border-t border-gray-200 bg-white px-4 py-2 shadow-lg transition-transform duration-300 ease-in-out"
  >
    <div class="container mx-auto flex items-center justify-between gap-4">
      <div class="flex min-w-0 flex-1 items-center gap-4">
        <img
          src={data.product.image_link}
          alt={data.product.title}
          class="h-12 w-12 rounded-lg object-cover"
        />
        <div class="min-w-0 flex-1">
          <h3 class="truncate text-base font-medium">{data.product.title}</h3>
          <div class="flex items-center gap-2">
            <span class="text-primary font-bold">
              {formatNumber(data.product.sale_price)} บาท
            </span>
            {#if data.product.sale_price < data.product.price}
              <span class="badge badge-error badge-sm text-white">
                -{calculateDiscount(data.product.price, data.product.sale_price)}%
              </span>
            {/if}
          </div>
        </div>
      </div>
      <button
        class="btn min-w-[80px] gap-2 border-0 bg-[#ee4d2d] text-white hover:bg-[#d73211]"
        on:click={() => {
          window.open(
            `${data.product.product_link}?uls_trackid=526tokeq018r&utm_campaign=id_7Qvn7oXhvC&utm_content=delamai----&utm_medium=affiliates&utm_source=an_15375710115&utm_term=cp74y3rr4b1h`,
            '_blank',
            'noopener,noreferrer'
          );
        }}
      >
        <img src="/shopee.svg" alt="Shopee" class="hidden h-5 w-5 sm:block" />
        <span class="text-sm sm:text-base">ซื้อที่ Shopee</span>
      </button>
    </div>
  </div>
{/if}
