import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  {
    id: 1,
    title: "ชาเขียวมัทฉะพรีเมียม",
    subtitle: "Premium Grade Uji Matcha Green Tea",
    description:
      "ใบชาเกรดพรีเมียม นำเข้าจากเกียวโต ให้สีเขียวเข้ม รสชาติกลมกล่อมอมอุมามิแท้ๆ กาเฟอีนกำลังดี เหมาะสำหรับทำมัทฉะลาเต้ร้อนหรือเย็น",
    price: 320,
    category: "ชาเขียวมัทฉะ",
    caffeine: "ระดับสูง",
    imagePlaceholder: "[ มัทฉะ ]",
    imageUrl: "https://images.pexels.com/photos/8004565/pexels-photo-8004565.jpeg?cs=srgb&dl=pexels-darina-belonogova-8004565.jpg&fm=jpg",
  },
  {
    id: 2,
    title: "ชาอู่หลงทองสายน้ำผึ้ง",
    subtitle: "Golden Honey Oolong Tea",
    description: "ชาอู่หลงกลิ่นน้ำผึ้งละมุน ผ่านการหมักอย่างพิถีพิถัน รสชาติหอมหวานติดปลายลิ้น",
    price: 280,
    category: "ชาอู่หลง",
    caffeine: "ระดับปานกลาง",
    imagePlaceholder: "[ อู๋หลง ]",
    imageUrl: "https://images.pexels.com/photos/6351882/pexels-photo-6351882.jpeg",
  },
  {
    id: 3,
    title: "ชาดำอัสสัมคลาสสิก",
    subtitle: "Assam Black Tea",
    description: "ชาดำรสชาติเข้มข้น กลิ่นหอมคลาสสิก เหมาะสำหรับชงร้อนหรือทำชาเย็น/ชานม",
    price: 240,
    category: "ชาดำ",
    caffeine: "ระดับสูง",
    imagePlaceholder: "[ ชาดำ ]",
    imageUrl: "https://images.pexels.com/photos/31959376/pexels-photo-31959376.jpeg?cs=srgb&dl=pexels-dsgc-2151967151-31959376.jpg&fm=jpg",
  },
  {
    id: 4,
    title: "ชามะลิหอมคัดพิเศษ",
    subtitle: "Jasmine Scented Tea",
    description: "ชาเขียวอบกลิ่นดอกมะลิสด หอมละมุน ดื่มสบาย เหมาะกับทุกมื้ออาหาร",
    price: 190,
    category: "ชามะลิ",
    caffeine: "ระดับปานกลาง",
    imagePlaceholder: "[ ชามะลิ ]",
    imageUrl: "https://images.pexels.com/photos/7138780/pexels-photo-7138780.jpeg?cs=srgb&dl=pexels-filirovska-7138780.jpg&fm=jpg",
  },
  {
    id: 5,
    title: "ชากุหลาบฝรั่งเศส",
    subtitle: "French Rose Tea",
    description: "กลีบกุหลาบฝรั่งเศสแท้ หอมละมุน ช่วยผ่อนคลาย ไม่มีคาเฟอีน ดื่มได้ทุกเวลา",
    price: 260,
    category: "ชากุหลาบ",
    caffeine: "ไม่มีคาเฟอีน",
    imagePlaceholder: "[ ชากุหลาบ ]",
    imageUrl: "https://images.pexels.com/photos/33781558/pexels-photo-33781558.jpeg?cs=srgb&dl=pexels-zulfugarkarimov-33781558.jpg&fm=jpg",
  },
  {
    id: 6,
    title: "ชาเก๊กฮวยป่าธรรมชาติ",
    subtitle: "Wild Chrysanthemum Tea",
    description: "ดอกเก๊กฮวยป่าคัดพิเศษ รสชาติหวานอมขมนิดๆ ช่วยดับร้อนในร่างกาย",
    price: 160,
    category: "ชาเก๊กฮวย",
    caffeine: "ไม่มีคาเฟอีน",
    imagePlaceholder: "[ ชาเก๊กฮวย ]",
    imageUrl: "https://images.pexels.com/photos/6913382/pexels-photo-6913382.jpeg?cs=srgb&dl=pexels-teona-swift-6913382.jpg&fm=jpg",
  },
  {
    id: 7,
    title: "ชาอัญชันออร์แกนิก",
    subtitle: "Organic Butterfly Pea Tea",
    description: "ดอกอัญชันออร์แกนิกแท้ 100% สีสวยจากธรรมชาติ ดื่มคู่มะนาวสดชื่นยิ่งขึ้น",
    price: 200,
    category: "ชาอัญชัน",
    caffeine: "ไม่มีคาเฟอีน",
    imagePlaceholder: "[ ชาอัญชัน ]",
    imageUrl: "https://images.pexels.com/photos/34439034/pexels-photo-34439034.jpeg?cs=srgb&dl=pexels-masuma-rahaman-437541976-34439034.jpg&fm=jpg",
  },
  {
    id: 8,
    title: "ชาหญ้าหวานสมุนไพร",
    subtitle: "Stevia Herbal Tea",
    description: "ชาสมุนไพรผสมหญ้าหวานธรรมชาติ หวานละมุนโดยไม่ใช้น้ำตาล เหมาะกับสายสุขภาพ",
    price: 150,
    category: "ชาหญ้าหวาน",
    caffeine: "ไม่มีคาเฟอีน",
    imagePlaceholder: "[ ชาหญ้าหวาน ]",
    imageUrl: "https://images.pexels.com/photos/34717619/pexels-photo-34717619.jpeg?cs=srgb&dl=pexels-martabranco-34717619.jpg&fm=jpg",
  },
  {
    id: 9,
    title: "ชาใบเตยหอมสดชื่น",
    subtitle: "Pandan Leaf Tea",
    description: "ใบเตยหอมธรรมชาติ กลิ่นหอมสดชื่น ดื่มเย็นชื่นใจ ไม่มีคาเฟอีน",
    price: 150,
    category: "ชาใบเตย",
    caffeine: "ไม่มีคาเฟอีน",
    imagePlaceholder: "[ ชาใบเตย ]",
    imageUrl: "https://images.pexels.com/photos/5857658/pexels-photo-5857658.jpeg",
  },
  {
    id: 10,
    title: "ชาตะไคร้เพื่อสุขภาพ",
    subtitle: "Lemongrass Tea",
    description: "ตะไคร้แท้จากไร่ออร์แกนิก ช่วยขับลม ดื่มง่าย หอมสดชื่นทุกจิบ",
    price: 150,
    category: "ชาตะไคร้",
    caffeine: "ไม่มีคาเฟอีน",
    imagePlaceholder: "[ ชาตะไคร้ ]",
    imageUrl: "https://images.pexels.com/photos/10280078/pexels-photo-10280078.jpeg?cs=srgb&dl=pexels-jamaludin-muh-137935755-10280078.jpg&fm=jpg",
  },
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    });
  }

  // upsert ด้วย id ตายตัวไม่ได้ขยับ sequence ของ autoincrement ให้
  // ต้อง sync เองไม่งั้น product ใหม่ที่สร้างทีหลัง (เช่นจากแผงแอดมิน) จะชน id เดิม
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Product"', 'id'), COALESCE((SELECT MAX(id) FROM "Product"), 1))`
  );
  console.log(`Seeded ${products.length} products.`);

  const adminPassword = await bcrypt.hash("REMOVED-ADMIN-PASSWORD", 10);
  await prisma.user.upsert({
    where: { email: "admin@hongcha.demo" },
    update: { role: "admin" },
    create: {
      name: "ผู้ดูแลระบบ (Admin)",
      email: "admin@hongcha.demo",
      password: adminPassword,
      role: "admin",
    },
  });
  console.log("Seeded admin account: admin@hongcha.demo / REMOVED-ADMIN-PASSWORD");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
