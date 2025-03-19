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

<div class="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300">
  <a href="/products/{product.id}" class="block">
    <figure class="overflow-hidden rounded-t-lg">
      <img 
        src={product.image_link} 
        alt={product.title}
        class="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
        loading="lazy"
      />
    </figure>
    <div class="card-body">
      <h2 class="card-title text-lg font-bold line-clamp-2">{product.title}</h2>
      <div class="flex items-center justify-between">
        <div class="text-lg font-bold text-primary">
          {product.price.toLocaleString('th-TH')} บาท
        </div>
        <div class="text-sm text-gray-500">
          ขายแล้ว {product.item_sold.toLocaleString('th-TH')} ชิ้น
        </div>
      </div>
    </div>
  </a>
  <div class="card-actions justify-start px-4 pb-4 -mt-2">
    <a 
      href={product.product_link} 
      target="_blank" 
      rel="noopener noreferrer"
      class="btn bg-[#ee4d2d] hover:bg-[#d73211] text-white border-0 gap-2 w-full"
      on:click={handleShopeeClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
      </svg>
      ซื้อที่ Shopee
    </a>
  </div>
</div> 