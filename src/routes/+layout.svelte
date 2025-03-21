<script lang="ts">
  import '../app.css';
  let { children } = $props();

  let searchQuery = '';

  const categories = [
    { id: '100636', name: 'บ้านและที่อยู่อาศัย' },
    { id: '100630', name: 'ความงาม' },
    { id: '100017', name: 'เสื้อผ้าผู้หญิง' },
    { id: '100001', name: 'สุขภาพ' },
    { id: '100629', name: 'อาหารและเครื่องดื่ม' },
    { id: '100013', name: 'มือถือและอุปกรณ์เสริม' },
    { id: '100632', name: 'แม่และเด็ก' },
    { id: '100631', name: 'สัตว์เลี้ยง' },
    { id: '100010', name: 'เครื่องใช้ไฟฟ้าภายในบ้าน' },
    { id: '100637', name: 'กีฬาและกิจกรรมกลางแจ้ง' },
    { id: '100011', name: 'เสื้อผ้าผู้ชาย' },
    { id: '100009', name: 'เครื่องประดับแฟชั่น' },
    { id: '100640', name: 'รถยนต์' },
    { id: '100641', name: 'รถจักรยานยนต์' },
    { id: '100532', name: 'รองเท้าผู้หญิง' },
    { id: '100638', name: 'เครื่องเขียน' },
    { id: '100633', name: 'แฟชั่นเด็ก' },
    { id: '100016', name: 'กระเป๋าผู้หญิง' },
    { id: '100639', name: 'งานอดิเรกและของสะสม' },
    { id: '100535', name: 'เครื่องเสียง' },
    { id: '100644', name: 'คอมพิวเตอร์และอุปกรณ์เสริม' },
    { id: '100012', name: 'รองเท้าผู้ชาย' },
    { id: '100643', name: 'หนังสือและนิตยสาร' },
    { id: '100635', name: 'กล้องและโดรน' },
    { id: '100015', name: 'การเดินทางและกระเป๋าเดินทาง' },
    { id: '100533', name: 'กระเป๋าผู้ชาย' },
    { id: '100534', name: 'นาฬิกา' },
    { id: '100634', name: 'เกมและคอนโซล' },
    { id: '100642', name: 'ตั๋ว, บัตรกำนัลและบริการ' },
    { id: '100014', name: 'แฟชั่นมุสลิม' }
  ];

  function handleSearch(e: Event) {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search/${encodeURIComponent(searchQuery.trim())}`;
    }
  }
</script>

<!-- Navbar -->
<nav class="bg-primary shadow">
  <div class="container mx-auto px-4">
    <div class="flex h-16 items-center justify-between">
      <div class="flex flex-1 items-center gap-4">
        <a href="/" class="flex items-center gap-2">
          <span class="text-xl font-bold text-white">เดอละมัย</span>
        </a>
        <!-- Search Bar -->
        <form on:submit={handleSearch} class="relative flex-1">
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="ค้นหาสินค้า..."
            class="focus:ring-primary w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:ring-2 focus:outline-none"
          />
          <button
            type="submit"
            class="hover:text-primary absolute top-1/2 right-2 -translate-y-1/2 text-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </form>
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
          เดอละมัย รวบรวมสินค้าคุณภาพราคาที่คุ้มค่าจากแบรนด์ชั้นนำ เพื่อให้คุณเลือกซื้อได้ง่ายขึ้น
        </p>
      </div>

      <!-- Categories  -->
      <div>
        <h3 class="mb-4 text-lg font-semibold">หมวดหมู่</h3>
        <ul class="grid grid-cols-2 space-y-2">
          {#each categories.slice(0, 12) as category}
            <li>
              <a href="/category/{category.id}/1" class="hover:text-primary text-gray-600">
                {category.name}
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Contact -->
      <div>
        <h3 class="mb-4 text-lg font-semibold">เมนู</h3>
        <ul class="space-y-2">
          <li>
            <a href="/about" class="hover:text-primary text-gray-600"> เกี่ยวกับเรา </a>
          </li>
          <li>
            <a href="/contact" class="hover:text-primary text-gray-600"> ติดต่อเรา </a>
          </li>
          <li>
            <a href="/privacy-policy" class="hover:text-primary text-gray-600">
              นโยบายความเป็นส่วนตัว
            </a>
          </li>
          <li>
            <a href="/terms-of-service" class="hover:text-primary text-gray-600">
              เงื่อนไขการใช้บริการ
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
