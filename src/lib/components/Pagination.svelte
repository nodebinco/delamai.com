<script lang="ts">
  export let currentPage: string;
  export let totalPages: number;
  export let baseUrl: string;

  $: currentPageNum = parseInt(currentPage) || 1;
  $: pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  $: maxVisiblePages = 5;
  $: startPage = Math.max(1, Math.min(currentPageNum - Math.floor(maxVisiblePages / 2), totalPages - maxVisiblePages + 1));
  $: endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  $: visiblePages = pages.slice(startPage - 1, endPage);
</script>

{#if totalPages > 1}
  <div class="flex justify-center items-center space-x-2 mt-8">
    {#if currentPageNum > 1}
      <a
        href="{baseUrl}/{currentPageNum - 1}"
        class="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
      >
        Previous
      </a>
    {/if}

    {#if startPage > 1}
      <a
        href="{baseUrl}/1"
        class="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
      >
        1
      </a>
      {#if startPage > 2}
        <span class="px-3 py-1">...</span>
      {/if}
    {/if}

    {#each visiblePages as page}
      <a
        href="{baseUrl}/{page}"
        class="px-3 py-1 rounded-md {page === currentPageNum ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
      >
        {page}
      </a>
    {/each}

    {#if endPage < totalPages}
      {#if endPage < totalPages - 1}
        <span class="px-3 py-1">...</span>
      {/if}
      <a
        href="{baseUrl}/{totalPages}"
        class="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
      >
        {totalPages}
      </a>
    {/if}

    {#if currentPageNum < totalPages}
      <a
        href="{baseUrl}/{currentPageNum + 1}"
        class="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
      >
        Next
      </a>
    {/if}
  </div>
{/if} 