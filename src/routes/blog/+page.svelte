<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<svelte:head>
  <title>บทความ - เดอละมัย (delamai)</title>
  <meta
    name="description"
    content="บทความน่าสนใจเกี่ยวกับสินค้า แฟชั่น ความงาม และไลฟ์สไตล์ จากเดอละมัย"
  />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <h1 class="mb-8 text-3xl font-bold">บทความ</h1>

  {#if data.posts.length === 0}
    <div class="alert alert-info">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="h-6 w-6 shrink-0 stroke-current"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <span>ยังไม่มีบทความ</span>
    </div>
  {:else}
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {#each data.posts as post}
        <a
          href="/blog/{post.slug}"
          class="card bg-base-100 shadow transition-shadow duration-300 hover:shadow-lg"
        >
          <div class="card-body">
            <h2 class="card-title text-xl">{post.title}</h2>
            <div class="prose prose-sm mt-2 line-clamp-3" set:html={post.excerpt}></div>
            <div class="card-actions mt-4 justify-end">
              <span class="text-sm text-gray-500">อ่านเพิ่มเติม</span>
            </div>
          </div>
        </a>
      {/each}
    </div>
  {/if}
</div> 