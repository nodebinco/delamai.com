<script lang="ts">
  import type { Product } from '$lib/db';
  export let product: Product;
</script>

<div class="card bg-base-100 shadow-sm transition-all duration-300 hover:shadow-md">
  <a href="/products/{product.id}" class="block">
    <figure class="relative aspect-square w-full overflow-hidden rounded-t-lg">
      <div class="absolute inset-0 animate-pulse bg-gray-200"></div>
      <img
        src={product.image_link}
        alt={product.title}
        class="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-110"
        loading="lazy"
      />
    </figure>
    <div class="p-2">
      <h2 class="mb-2 line-clamp-2 font-medium">{product.title}</h2>
      <div class="flex items-center justify-between">
        <div class="text-primary text-sm font-bold">
          {(product.sale_price ?? product.price).toLocaleString('th-TH')} บาท
        </div>
        <div class="text-sm text-gray-500">
          {product.item_sold.toLocaleString('th-TH')} ชิ้น
        </div>
      </div>
    </div>
  </a>
  <div class="justify-start px-2 pb-2">
    <button
      class="btn h-12 w-full gap-2 rounded-lg border-0 bg-[#ee4d2d] text-white hover:bg-[#d73211]"
      on:click={(e) => {
        e.stopPropagation();
        window.open(
          `${product.product_link}?uls_trackid=526tokeq018r&utm_campaign=id_7Qvn7oXhvC&utm_content=delamai----&utm_medium=affiliates&utm_source=an_15375710115&utm_term=cp74y3rr4b1h`,
          '_blank',
          'noopener,noreferrer'
        );
      }}
    >
      ซื้อที่ Shopee
    </button>
  </div>
</div>
