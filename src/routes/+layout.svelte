<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<!-- Navbar -->
<nav class="bg-white shadow">
  <div class="container mx-auto px-4">
    <div class="flex h-16 items-center justify-between">
      <div class="flex items-center">
        <a href="/" class="flex items-center gap-2">
          <span class="text-xl font-bold">เดอละมัย</span>
        </a>
      </div>
      <div class="hidden md:flex md:items-center md:space-x-6">
        <a href="/brands" class="text-gray-700 hover:text-primary">แบรนด์</a>
        <a href="/categories" class="text-gray-700 hover:text-primary">หมวดหมู่</a>
        <a href="/tags" class="text-gray-700 hover:text-primary">แท็ก</a>
      </div>
    </div>
  </div>
</nav>

<!-- Main Content -->
<main class="min-h-screen">
  {@render children()}
</main>

<!-- Footer -->
<footer class="bg-gray-100">
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <!-- About -->
      <div>
        <h3 class="mb-4 text-lg font-semibold">เกี่ยวกับเรา</h3>
        <p class="text-gray-600">
          เดอละมัย รวบรวมสินค้าคุณภาพจาก Shopee เพื่อให้คุณเลือกซื้อได้ง่ายขึ้น
        </p>
      </div>

      <!-- Quick Links -->
      <div>
        <h3 class="mb-4 text-lg font-semibold">ลิงก์ด่วน</h3>
        <ul class="space-y-2">
          <li><a href="/brands" class="text-gray-600 hover:text-primary">แบรนด์</a></li>
          <li><a href="/categories" class="text-gray-600 hover:text-primary">หมวดหมู่</a></li>
          <li><a href="/tags" class="text-gray-600 hover:text-primary">แท็ก</a></li>
        </ul>
      </div>

      <!-- Contact -->
      <div>
        <h3 class="mb-4 text-lg font-semibold">ติดต่อเรา</h3>
        <ul class="space-y-2">
          <li>
            <a href="mailto:contact@delamai.com" class="text-gray-600 hover:text-primary">
              contact@delamai.com
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Copyright -->
    <div class="mt-8 border-t border-gray-200 pt-8 text-center">
      <p class="text-gray-600">
        © {new Date().getFullYear()} เดอละมัย. All rights reserved.
      </p>
    </div>
  </div>
</footer>
