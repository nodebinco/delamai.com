import type { PageServerLoad } from './$types';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  created_at: string;
}

export const load: PageServerLoad = async ({ params }) => {
  // TODO: Replace with actual API call to fetch blog post by slug
  const posts: BlogPost[] = [
    {
      id: 1,
      title: 'จัดระเบียบคำอธิบายสินค้าให้น่าซื้อ ด้วยเครื่องมือฟรีจาก OnlineMarkdown.com',
      slug: 'online-markdown-tool',
      content: `<div><h1 class="text-2xl font-bold text-gray-800 mb-4">เติมเสน่ห์ให้คำอธิบายสินค้าของคุณด้วยเครื่องมือ Markdown ฟรีจาก OnlineMarkdown.com</h1>

    <p class="text-gray-700 mb-4">สำหรับพ่อค้าแม่ค้าออนไลน์ทุกคน การทำให้สินค้าของเราโดดเด่นและน่าสนใจเป็นสิ่งสำคัญมากๆ ไม่ว่าจะเป็นการเขียนรายละเอียดสินค้าที่ชัดเจน การจัดโปรโมชั่นสุดปัง หรือการตกแต่งข้อความให้สวยงามและอ่านง่าย ล้วนมีผลต่อการตัดสินใจซื้อของลูกค้าทั้งนั้น</p>

    <p class="text-gray-700 mb-2">เคยไหมที่รู้สึกว่า...</p>
    <ul class="list-disc ml-6 text-gray-700 mb-4">
        <li>คำอธิบายสินค้าของเราดูธรรมดา ไม่ดึงดูดใจ?</li>
        <li>อยากเน้นข้อความสำคัญ แต่ไม่รู้จะทำยังไงให้สวยงาม?</li>
        <li>อยากให้รายละเอียดสินค้าดูเป็นระเบียบ อ่านง่าย สบายตา?</li>
    </ul>

    <p class="text-gray-700 mb-4">วันนี้ <strong class="font-semibold">Delamai</strong> อยากจะมาแนะนำเครื่องมือดีๆ ที่จะช่วยให้การจัดการรายละเอียดสินค้าของคุณง่ายขึ้นเยอะ แถมยังทำให้สินค้าของคุณดูน่าสนใจขึ้นอีกด้วย นั่นก็คือ <a href="https://onlinemarkdown.com/" target="_blank" class="text-blue-500 hover:underline">OnlineMarkdown.com</a> ครับ!</p>

    <h2 class="text-xl font-semibold text-gray-800 mb-3">Markdown คืออะไร? ทำไมถึงเป็นตัวช่วยสำคัญสำหรับร้านค้าออนไลน์?</h2>
    <p class="text-gray-700 mb-4">Markdown เป็นเหมือนภาษาง่ายๆ ที่ช่วยให้เราจัดรูปแบบข้อความได้สวยงามโดยไม่ต้องใช้โปรแกรมอะไรที่ซับซ้อน แค่ใช้สัญลักษณ์ง่ายๆ ไม่กี่ตัว เราก็สามารถสร้างหัวข้อ ตัวหนา ตัวเอียง หรือทำรายการต่างๆ ได้อย่างรวดเร็ว</p>

    <p class="text-gray-700 mb-4"><a href="https://onlinemarkdown.com/" target="_blank" class="text-blue-500 hover:underline">OnlineMarkdown.com</a> เป็นเว็บไซต์ที่รวบรวมเครื่องมือ Markdown ออนไลน์ให้เราใช้กันได้ฟรีๆ ซึ่งจะช่วยให้คุณ:</p>
    <ul class="list-disc ml-6 text-gray-700 mb-4">
        <li><strong class="font-semibold">จัดรูปแบบข้อความได้ง่ายสุดๆ:</strong> อยากทำตัวหนา <code class="bg-gray-200 px-2 py-1 rounded font-mono">*ข้อความนี้จะกลายเป็นตัวเอียง*</code> ใส่หัวข้อ <code class="bg-gray-200 px-2 py-1 rounded font-mono"># นี่คือหัวข้อหลัก</code> หรือทำรายการ <code class="bg-gray-200 px-2 py-1 rounded font-mono">- นี่คือรายการ</code></li>
        <li><strong class="font-semibold">สร้างตารางข้อมูลสินค้าได้:</strong> ถ้าสินค้าของคุณมีรายละเอียดเป็นตัวเลข สเปค หรือขนาดต่างๆ ก็สามารถทำตารางให้ลูกค้าดูง่ายๆ ได้เลย</li>
        <li><strong class="font-semibold">ใส่ลิงก์เชื่อมไปยังที่ต่างๆ ได้:</strong> อยากใส่ลิงก์ไปสินค้าอื่นที่เกี่ยวข้อง หรือไปหน้าโปรโมชั่นก็ทำได้สะดวก</li>
        <li><strong class="font-semibold">โชว์โค้ดสวยๆ (สำหรับสินค้าบางประเภท):</strong> ถ้าคุณขายพวกโปรแกรมหรืออุปกรณ์อิเล็กทรอนิกส์ ก็สามารถแสดงตัวอย่างโค้ดให้ลูกค้าดูได้แบบสวยงาม</li>
        <li><strong class="font-semibold">ไม่ต้องลงโปรแกรมให้วุ่นวาย:</strong> ใช้งานได้เลยบนเว็บไซต์ ไม่ว่าจะใช้คอมพิวเตอร์ แท็บเล็ต หรือมือถือก็สะดวก</li>
    </ul>

    <h2 class="text-xl font-semibold text-gray-800 mb-3">ลองดูตัวอย่างการใช้ OnlineMarkdown.com เปลี่ยนคำอธิบายสินค้าธรรมดาๆ ให้ว้าวขึ้น:</h2>

    <h3 class="text-lg font-semibold text-gray-800 mb-2">แบบเดิม:</h3>
    <div class="bg-white p-4 rounded shadow-md text-gray-700 mb-4">
        <p>เสื้อยืดคอกลม ผ้าฝ้าย 100% นิ่มมาก มีหลายสีให้เลือก ไซส์ S, M, L ราคา 250 บาท ซื้อ 2 แถม 1 รีบเลยนะวันนี้เท่านั้น!</p>
    </div>

    <h3 class="text-lg font-semibold text-gray-800 mb-2">แบบที่ใช้ Markdown จาก OnlineMarkdown.com:</h3>
    <div class="bg-gray-200 p-4 rounded font-mono whitespace-pre-wrap text-sm text-gray-800 mb-4">
        <pre><code>## เสื้อยืดคอกลม ผ้าฝ้าย 100% ใส่สบายจนไม่อยากถอด!

**คุณสมบัติเด่น:**
* เนื้อผ้า: ผ้าฝ้ายแท้ 100% นุ่มสบาย ระบายอากาศดีเยี่ยม
* สี: มีให้เลือกหลากหลายเฉดสี
* ขนาด: S, M, L

**ราคาพิเศษ:** **250 บาทเท่านั้น**

🔥 **โปรโมชั่นสุดฮอต!** 🔥
**ซื้อ 2 ฟรี 1** ตั้งแต่วันนี้ - [ใส่วันที่สิ้นสุดโปรโมชั่น] ห้ามพลาด!
[ใส่ลิงก์ไปยังสินค้าอื่นๆ ที่น่าสนใจ]
</code></pre>
    </div>
    <div class="bg-white p-4 rounded shadow-md text-gray-700 mb-4">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">เสื้อยืดคอกลม ผ้าฝ้าย 100% ใส่สบายจนไม่อยากถอด!</h2>
        <p class="font-semibold">คุณสมบัติเด่น:</p>
        <ul class="list-disc ml-6">
            <li><em class="italic">เนื้อผ้า:</em> ผ้าฝ้ายแท้ 100% นุ่มสบาย ระบายอากาศดีเยี่ยม</li>
            <li><em class="italic">สี:</em> มีให้เลือกหลากหลายเฉดสี</li>
            <li><em class="italic">ขนาด:</em> S, M, L</li>
        </ul>
        <p><strong class="font-semibold">ราคาพิเศษ:</strong> <strong class="text-red-500">250 บาทเท่านั้น</strong></p>
        <p class="text-red-600 font-bold">🔥 <strong class="font-extrabold">โปรโมชั่นสุดฮอต!</strong> 🔥 <strong class="font-semibold">ซื้อ 2 ฟรี 1</strong> ตั้งแต่วันนี้ - [ใส่วันที่สิ้นสุดโปรโมชั่น] ห้ามพลาด!</p>
        <p>[ใส่ลิงก์ไปยังสินค้าอื่นๆ ที่น่าสนใจ]</p>
    </div>

    <h2 class="text-xl font-semibold text-gray-800 mb-3">วิธีใช้งาน OnlineMarkdown.com ง่ายมากๆ:</h2>
    <ol class="list-decimal ml-6 text-gray-700 mb-4">
        <li>เข้าไปที่เว็บไซต์ <a href="https://onlinemarkdown.com/" target="_blank" class="text-blue-500 hover:underline">https://onlinemarkdown.com/</a></li>
        <li>พิมพ์หรือวางข้อความที่ต้องการจัดรูปแบบลงในช่อง Editor ทางด้านซ้าย</li>
        <li>ดูตัวอย่างข้อความที่จัดรูปแบบแล้วได้เลยทางด้านขวา</li>
        <li>คัดลอก (Copy) ข้อความที่จัดรูปแบบแล้ว ไปใส่ในส่วนรายละเอียดสินค้าของร้านค้าออนไลน์ของคุณได้เลย</li>
    </ol>

    <p class="text-gray-700"><strong>Delamai</strong> หวังว่าเครื่องมือ <a href="https://onlinemarkdown.com/" target="_blank" class="text-blue-500 hover:underline">OnlineMarkdown.com</a> นี้จะเป็นประโยชน์กับพ่อค้าแม่ค้าออนไลน์ทุกคนนะครับ ลองนำไปใช้กันดู แล้วคุณจะเห็นว่าการจัดการรายละเอียดสินค้าให้สวยงามและน่าสนใจไม่ใช่เรื่องยากอีกต่อไป! ขอให้ขายดิบขายดีครับ!</p>
</div>`,
      excerpt:'<p>ยกระดับคำอธิบายสินค้าของคุณให้โดดเด่นและน่าสนใจยิ่งขึ้น! พบกับ OnlineMarkdown.com เครื่องมือฟรีที่ช่วยให้คุณจัดรูปแบบข้อความได้อย่างง่ายดาย สร้างหัวข้อ ตัวหนา ทำรายการ หรือใส่ลิงก์ได้สะดวก ไม่ต้องลงโปรแกรมให้ยุ่งยาก ลองใช้เลย แล้วคำอธิบายสินค้าของคุณจะดึงดูดลูกค้าได้มากกว่าเดิม!</p>',
      created_at: '2025-04-17'
    }
  ];

  const post = posts.find((p) => p.slug === params.slug);

  if (!post) {
    return {
      status: 404,
      error: new Error('ไม่พบบทความที่ต้องการ')
    };
  }

  return {
    post
  };
}; 