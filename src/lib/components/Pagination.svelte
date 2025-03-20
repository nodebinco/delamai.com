<script lang="ts">
  export let currentPage: string;
  export let totalPages: number;
  export let baseUrl: string;

  $: currentPageNum = parseInt(currentPage) || 1;
  $: maxVisible = 3; // Number of pages to show around current page
  $: startPage = Math.max(1, currentPageNum - Math.floor(maxVisible / 2));
  $: endPage = Math.min(totalPages, startPage + maxVisible - 1);
  $: showStartEllipsis = startPage > 2;
  $: showEndEllipsis = endPage < totalPages - 1;
</script>

{#if totalPages > 1}
  <div class="flex justify-center">
    <div class="join">
      {#if currentPageNum > 1}
        <a href="{baseUrl}/{currentPageNum - 1}" class="join-item btn" data-sveltekit-preload>
          «
        </a>
      {/if}

      {#if startPage > 1}
        <a href="{baseUrl}/1" class="join-item btn" data-sveltekit-preload>1</a>
      {/if}

      {#if showStartEllipsis}
        <button class="join-item btn btn-disabled">...</button>
      {/if}

      {#each Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i) as page}
        <a
          href="{baseUrl}/{page}"
          class="join-item btn {currentPageNum === page ? 'btn-primary btn-active' : ''}"
          data-sveltekit-preload
        >
          {page}
        </a>
      {/each}

      {#if showEndEllipsis}
        <button class="join-item btn btn-disabled">...</button>
      {/if}

      {#if endPage < totalPages}
        <a href="{baseUrl}/{totalPages}" class="join-item btn" data-sveltekit-preload>
          {totalPages}
        </a>
      {/if}

      {#if currentPageNum < totalPages}
        <a href="{baseUrl}/{currentPageNum + 1}" class="join-item btn" data-sveltekit-preload>
          »
        </a>
      {/if}
    </div>
  </div>
{/if}
