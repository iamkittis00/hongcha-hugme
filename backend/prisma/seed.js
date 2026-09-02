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
  // seed ตัวนี้รันทุกครั้งที่ container บูต จึงต้องไม่ทำลายข้อมูล
  // เดิมเคย deleteMany ออเดอร์/รีวิว/สินค้าทิ้งก่อน ทำให้ทุก deploy หรือทุกครั้งที่ service ตื่น
  // ข้อมูลการสั่งซื้อจริงของลูกค้าหายถาวร — ห้ามใส่กลับมาเด็ดขาด
  // ถ้าต้องเปลี่ยนโครงสร้างแคตตาล็อกอีก ให้ทำเป็น prisma migration ครั้งเดียว ไม่ใช่ตรงนี้
  const existingProducts = await prisma.product.count();
  if (existingProducts === 0) {
    for (const product of products) {
      await prisma.product.create({ data: product });
    }

    // upsert/create ด้วย id ตายตัวไม่ได้ขยับ sequence ของ autoincrement ให้
    // ต้อง sync เองไม่งั้นสินค้าใหม่ที่สร้างทีหลัง (เช่นจากแผงแอดมิน) จะชน id เดิม
    await prisma.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('"Product"', 'id'), COALESCE((SELECT MAX(id) FROM "Product"), 1))`
    );
    console.log(`Seeded ${products.length} products (real HugMe catalog).`);
  } else {
    console.log(`Skipped product seed — ${existingProducts} products already exist.`);
  }

  // บัญชีแอดมินสร้างจาก env เท่านั้น ห้าม hardcode รหัสผ่านลงไฟล์ที่อยู่ใน git
  // และไม่แตะบัญชีที่มีอยู่แล้ว (ไม่รีเซ็ตรหัสผ่านทับของเดิมตอน deploy)
  // ถ้าต้องเปลี่ยนรหัสผ่านแอดมิน ใช้ scripts/reset-admin-password.js แทน
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    if (adminPassword.length < 12) {
      throw new Error("ADMIN_PASSWORD ต้องมีอย่างน้อย 12 ตัวอักษร");
    }
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (existingAdmin) {
      if (existingAdmin.role !== "admin") {
        await prisma.user.update({ where: { id: existingAdmin.id }, data: { role: "admin" } });
        console.log(`Promoted existing user to admin: ${adminEmail}`);
      } else {
        console.log(`Admin account already exists: ${adminEmail}`);
      }
    } else {
      await prisma.user.create({
        data: {
          name: "ผู้ดูแลระบบ (Admin)",
          email: adminEmail,
          password: await bcrypt.hash(adminPassword, 10),
          role: "admin",
        },
      });
      console.log(`Created admin account: ${adminEmail}`);
    }
  } else {
    console.log("Skipped admin seed — ADMIN_EMAIL / ADMIN_PASSWORD not set.");
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
