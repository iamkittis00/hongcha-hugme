import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const FLAVORS_FULL = [
  "ชากุหลาบ",
  "ชาเก๊กฮวยเหลือง",
  "ชาอัญชัน",
  "ชาหญ้าหวาน",
  "ชาใบเตย",
  "ชาตะไคร้",
  "ชามิ้นท์",
  "ชาขิง",
  "ชาดาวเรือง",
];

const products = [
  {
    id: 1,
    title: "ชา (ถุงซิป)",
    subtitle: "Organic Herbal Tea - Zip Bag",
    description:
      "ชาสมุนไพรออร์แกนิกบรรจุถุงซิปล็อค เก็บง่าย พกพาสะดวก คัดสรรดอกไม้และสมุนไพรแห้งคุณภาพดีจากสวนฮักมี ออร์แกนิกฟาร์ม เลือกรสชาติได้ตามชอบ",
    price: 180,
    category: "ถุงซิป",
    caffeine: null,
    imagePlaceholder: "[ ชา ถุงซิป ]",
    imageUrl: "/products/thungzip-1.webp",
    images: ["/products/thungzip-1.webp", "/products/thungzip-2.webp", "/products/thungzip-3.webp", "/products/thungzip-4.webp"],
    flavors: FLAVORS_FULL,
  },
  {
    id: 2,
    title: "ชา (กระปุกแก้ว)",
    subtitle: "Premium Tea Collection - Glass Jar",
    description:
      "ชาสมุนไพรออร์แกนิกบรรจุกระปุกแก้วพรีเมียม เก็บกลิ่นหอมได้ดี เหมาะเป็นของฝากหรือใช้ในบ้าน คัดสรรดอกไม้และสมุนไพรแห้งคุณภาพดีจากสวนฮักมี ออร์แกนิกฟาร์ม",
    price: 169,
    category: "กระปุกแก้ว",
    caffeine: null,
    imagePlaceholder: "[ ชา กระปุกแก้ว ]",
    imageUrl: "/products/kapukkaew-1.webp",
    images: ["/products/kapukkaew-1.webp", "/products/kapukkaew-2.webp", "/products/kapukkaew-3.webp", "/products/kapukkaew-4.webp"],
    flavors: [...FLAVORS_FULL, "ชาอัสสัม", "ชาอัสสัมมะลิ"],
  },
  {
    id: 3,
    title: "ชา (กระปุกพลาสติก)",
    subtitle: "Organic Herbal Tea - Plastic Jar",
    description:
      "ชาสมุนไพรออร์แกนิกบรรจุกระปุกพลาสติกใส น้ำหนักเบา ราคาประหยัด เหมาะสำหรับใช้ในชีวิตประจำวัน คัดสรรดอกไม้และสมุนไพรแห้งคุณภาพดีจากสวนฮักมี ออร์แกนิกฟาร์ม",
    price: 269,
    category: "กระปุกพลาสติก",
    caffeine: null,
    imagePlaceholder: "[ ชา กระปุกพลาสติก ]",
    imageUrl: "/products/kapukplastic-1.webp",
    images: ["/products/kapukplastic-1.webp", "/products/kapukplastic-2.webp", "/products/kapukplastic-3.webp", "/products/kapukplastic-4.webp"],
    flavors: FLAVORS_FULL,
  },
  {
    id: 4,
    title: "ชา (ขายส่ง/กิโล)",
    subtitle: "Wholesale Mixed Tea - Per Kilogram",
    description:
      "ชาโฮ๊ะ (Mixed Tea) สูตรผสมดอกไม้และสมุนไพรหลากชนิด บรรจุแบบขายส่งต่อกิโลกรัม คุ้มค่าสำหรับร้านค้าหรือผู้ที่ดื่มเป็นประจำ จากสวนฮักมี ออร์แกนิกฟาร์ม",
    price: 1500,
    category: "ขายส่ง/กิโล",
    caffeine: null,
    imagePlaceholder: "[ ชา ขายส่ง/กิโล ]",
    imageUrl: "/products/khaisong-1.webp",
    images: ["/products/khaisong-1.webp", "/products/khaisong-2.webp", "/products/khaisong-3.webp", "/products/khaisong-4.webp"],
    flavors: ["ชาโฮ๊ะ", "ชาอัญชัน", "ชามิ้นต์", "ชาตะไคร้", "ชากุหลาบ", "หญ้าหวาน"],
  },
  {
    id: 5,
    title: "ชาดอกไม้ (Classic Menu)",
    subtitle: "Classic Flower Tea Menu",
    description:
      "เมนูคลาสสิกยอดนิยมของสวนฮักมี ออร์แกนิกฟาร์ม เลือกได้ระหว่างกุหลาบ เก๊กฮวย หรืออัญชัน บรรจุในกระป๋องพรีเมียมพร้อมมอบเป็นของขวัญ",
    price: 200,
    category: "เมนูพิเศษ",
    caffeine: null,
    imagePlaceholder: "[ ชาดอกไม้ Classic Menu ]",
    imageUrl: "/products/classic-1.png",
    images: ["/products/classic-1.png", "/products/classic-2.png", "/products/classic-3.png"],
    flavors: ["ชากุหลาบ", "ชาเก๊กฮวย", "ชาอัญชัน"],
  },
];

async function main() {
  // ลบข้อมูลออเดอร์/รีวิวเดิมก่อน เพราะแคตตาล็อกสินค้าเปลี่ยนโครงสร้างทั้งหมด
  // (จาก 10 สินค้าสมมติแยกรสชาติ เป็น 5 สินค้าจริงแยกตามบรรจุภัณฑ์)
  // ออเดอร์/รีวิวเดิมจะอ้างอิงสินค้าที่ไม่มีอยู่แล้ว เก็บไว้ไม่มีประโยชน์
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.product.deleteMany({});

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Product"', 'id'), COALESCE((SELECT MAX(id) FROM "Product"), 1))`
  );
  console.log(`Seeded ${products.length} products (real HugMe catalog).`);

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

  const demoPassword = await bcrypt.hash("REMOVED-DEMO-PASSWORD", 10);
  await prisma.user.upsert({
    where: { email: "demo@hongcha.demo" },
    update: {},
    create: {
      name: "ผู้ใช้ทดลอง (Demo)",
      email: "demo@hongcha.demo",
      password: demoPassword,
    },
  });
  console.log("Seeded demo customer account: demo@hongcha.demo / REMOVED-DEMO-PASSWORD");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
