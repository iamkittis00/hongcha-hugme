import { PrismaClient } from "@prisma/client";

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
  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
