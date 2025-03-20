<script lang="ts">
  export let currentPage: string;
  export let totalPages: number;
  export let baseUrl: string;

  let currentPageNum = parseInt(currentPage) || 1;
  function pageNumber(num: string) {
    return parseInt(num) || 1;
  }
</script>

{#if totalPages > 1}
  <div class="flex justify-center">
    <div class="join">
      {#if pageNumber(currentPage) > 1}
        <a href="{baseUrl}/{currentPageNum - 1}" class="join-item btn"> « </a>
      {/if}

      {#each Array(totalPages) as _, i}
        <a
          href="{baseUrl}/{i + 1}"
          class="join-item btn {pageNumber(currentPage) === i + 1 ? 'btn-active' : ''}"
        >
          {i + 1}
        </a>
      {/each}

      {#if pageNumber(currentPage) < totalPages}
        <a href="{baseUrl}/{pageNumber(currentPage) + 1}" class="join-item btn"> » </a>
      {/if}
    </div>
  </div>
{/if}
