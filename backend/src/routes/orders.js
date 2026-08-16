import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function generateOrderNumber() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TL-${date}-${random}`;
}

router.post("/", requireAuth, async (req, res) => {
  const {
    items,
    shippingMethod,
    paymentMethod,
    fullName,
    address,
    province,
    postalCode,
    phone,
    email,
    discount = 0,
    cardNumber,
    savedPaymentMethodId,
  } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "ตะกร้าสินค้าว่างเปล่า" });
  }
  if (!fullName || !address || !province || !postalCode || !phone || !email) {
    return res.status(400).json({ error: "กรุณากรอกที่อยู่จัดส่งให้ครบถ้วน" });
  }

  const productIds = items.map((item) => Number(item.productId));
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productMap = new Map(products.map((p) => [p.id, p]));

  for (const item of items) {
    if (!productMap.has(Number(item.productId))) {
      return res.status(400).json({ error: "มีสินค้าในตะกร้าที่ไม่พบในระบบ" });
    }
  }

  // จำลองการชำระเงิน: ไม่ต่อ payment gateway จริง
  // ใช้ saved payment method (มีแค่ last4 ในระบบ) ให้ผ่านเสมอ ไม่มีเลขเต็มให้ตรวจสอบ decline
  if (savedPaymentMethodId) {
    const saved = await prisma.paymentMethod.findUnique({ where: { id: savedPaymentMethodId } });
    if (!saved || saved.userId !== req.userId) {
      return res.status(400).json({ error: "ไม่พบวิธีชำระเงินที่บันทึกไว้นี้" });
    }
  } else if (paymentMethod === "card") {
    const digits = (cardNumber || "").replace(/\s/g, "");
    if (digits.length < 12) {
      return res.status(400).json({ error: "หมายเลขบัตรไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง" });
    }
    if (digits.endsWith("0002")) {
      return res.status(402).json({ error: "บัตรถูกปฏิเสธ กรุณาลองบัตรใบอื่นหรือช่องทางชำระเงินอื่น" });
    }
  }

  const subtotal = items.reduce((sum, item) => sum + productMap.get(Number(item.productId)).price * item.qty, 0);
  const shippingCost = shippingMethod === "express" ? 100 : shippingMethod === "pickup" ? 0 : 50;
  const total = Math.max(subtotal - Number(discount) + shippingCost, 0);

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      status: "paid",
      shippingMethod,
      paymentMethod,
      fullName,
      address,
      province,
      postalCode,
      phone,
      email,
      subtotal,
      discount: Number(discount),
      shippingCost,
      total,
      userId: req.userId,
      items: {
        create: items.map((item) => {
          const product = productMap.get(Number(item.productId));
          return {
            productId: product.id,
            name: product.title,
            price: product.price,
            qty: item.qty,
            size: item.size || null,
          };
        }),
      },
    },
    include: { items: true },
  });

  res.status(201).json({ order });
});

router.get("/", requireAuth, async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  res.json({ orders });
});

router.get("/:id", requireAuth, async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: true },
  });

  if (!order || order.userId !== req.userId) {
    return res.status(404).json({ error: "ไม่พบคำสั่งซื้อนี้" });
  }

  res.json({ order });
});

export default router;
