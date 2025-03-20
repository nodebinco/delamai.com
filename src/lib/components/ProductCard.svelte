<script lang="ts">
  import type { Product } from '$lib/db';
  export let product: Product;

  // Trim brand name if too long
  function trimBrand(brand: string): string {
    if (brand.length > 20) {
      return brand.substring(0, 20) + '...';
    }
    return brand;
  }

  // Stop event propagation for Shopee button
  function handleShopeeClick(event: MouseEvent) {
    event.stopPropagation();
  }
</script>

<div class="card bg-base-100 shadow-sm transition-all duration-300 hover:shadow-md">
  <a href="/products/{product.id}" class="block">
    <figure class="overflow-hidden rounded-t-lg">
      <img
        src={product.image_link}
        alt={product.title}
        class="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
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
    <a
      href={product.product_link}
      target="_blank"
      rel="noopener noreferrer"
      class="btn w-full gap-2 rounded-lg border-0 bg-[#ee4d2d] text-white hover:bg-[#d73211]"
      on:click={handleShopeeClick}
    >
      ซื้อที่ Shopee
    </a>
  </div>
</div>
