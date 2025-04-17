<script lang="ts">
  import type { PageData } from './$types';

  interface BlogPost {
    title: string;
    excerpt: string;
    content: string;
    created_at: string;
  }

  type BlogPageData = PageData & {
    post: BlogPost;
  };

  export let data: BlogPageData;

  $: if (!data.post) {
    throw new Error('Post not found');
  }
</script>

<svelte:head>
  <title>{data.post.title} - เดอละมัย (delamai)</title>
  <meta
    name="description"
    content={data.post.excerpt.replace(/<[^>]*>/g, '')}
  />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <article class="prose mx-auto max-w-3xl">
    <h1 class="mb-4 text-4xl font-bold">{data.post.title}</h1>
    <div class="mb-6 text-sm text-gray-500">
      {new Date(data.post.created_at).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </div>
    <div class="prose-lg">{@html data.post.content}</div>
  </article>

  <div class="mt-12 text-center">
    <a href="/blog" class="btn btn-primary">กลับไปยังหน้าบทความ</a>
  </div>
</div> 