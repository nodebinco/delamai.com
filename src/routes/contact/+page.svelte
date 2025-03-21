<script lang="ts">
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>ติดต่อเดอละมัย (delamai)</title>
  <meta name="description" content="ติดต่อเดอละมัย - เราพร้อมให้บริการและตอบคำถามของคุณ" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <h1 class="mb-6 text-3xl font-bold">ติดต่อเรา</h1>

  <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
    <!-- Contact Information -->
    <div>
      <h2 class="mb-4 text-2xl font-semibold">ข้อมูลการติดต่อ</h2>
      <div class="space-y-4">
        <div>
          <h3 class="mb-2 font-semibold">อีเมล</h3>
          <a href="mailto:contact@delamai.com" class="text-primary hover:text-primary-dark">
            contact@delamai.com
          </a>
        </div>
        <div>
          <h3 class="mb-2 font-semibold">ที่อยู่</h3>
          <p class="text-gray-600">17/8 แขวงอรุณอมรินทร์ เขตบางกอกน้อย<br />กทม 10700</p>
        </div>
      </div>
    </div>

    <!-- Contact Form -->
    <div>
      <h2 class="mb-4 text-2xl font-semibold">ส่งข้อความ</h2>
      <form class="space-y-4">
        <div>
          <label for="name" class="mb-1 block text-sm font-medium text-gray-700">ชื่อ</label>
          <input
            type="text"
            id="name"
            name="name"
            class="focus:ring-primary w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:outline-none"
            required
          />
        </div>
        <div>
          <label for="email" class="mb-1 block text-sm font-medium text-gray-700">อีเมล</label>
          <input
            type="email"
            id="email"
            name="email"
            class="focus:ring-primary w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:outline-none"
            required
          />
        </div>
        <div>
          <label for="subject" class="mb-1 block text-sm font-medium text-gray-700">หัวข้อ</label>
          <input
            type="text"
            id="subject"
            name="subject"
            class="focus:ring-primary w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:outline-none"
            required
          />
        </div>
        <div>
          <label for="message" class="mb-1 block text-sm font-medium text-gray-700">ข้อความ</label>
          <textarea
            id="message"
            name="message"
            rows="4"
            class="focus:ring-primary w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:outline-none"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          class="bg-primary hover:bg-primary-dark w-full rounded-lg px-6 py-2 text-white transition-colors"
        >
          ส่งข้อความ
        </button>
      </form>
    </div>
  </div>
</div>
