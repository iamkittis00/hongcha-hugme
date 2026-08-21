import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";

const router = Router();

router.use(requireAuth, requireAdmin);

const ORDER_STATUSES = ["paid", "shipped", "delivered", "cancelled"];

// ---- Products ----

router.get("/products", async (req, res) => {
  const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
  res.json({ products });
});

router.post("/products", async (req, res) => {
  const { title, subtitle, description, price, category, caffeine, imagePlaceholder, imageUrl } = req.body;

  if (!title || !subtitle || !description || !price || !category || !imagePlaceholder) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลสินค้าให้ครบถ้วน" });
  }

  const product = await prisma.product.create({
    data: {
      title,
      subtitle,
      description,
      price: Number(price),
      category,
      caffeine: caffeine || null,
      imagePlaceholder,
      imageUrl: imageUrl || null,
    },
  });

  res.status(201).json({ product });
});

router.patch("/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, subtitle, description, price, category, caffeine, imagePlaceholder, imageUrl } = req.body;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: "ไม่พบสินค้านี้" });
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      title,
      subtitle,
      description,
      price: price !== undefined ? Number(price) : undefined,
      category,
      caffeine: caffeine ?? undefined,
      imagePlaceholder,
      imageUrl: imageUrl ?? undefined,
    },
  });

  res.json({ product });
});

router.delete("/products/:id", async (req, res) => {
  const id = Number(req.params.id);

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: "ไม่พบสินค้านี้" });
  }

  try {
    await prisma.product.delete({ where: { id } });
    res.json({ success: true });
  } catch {
    res.status(409).json({ error: "ลบไม่ได้เพราะมีคำสั่งซื้อที่อ้างอิงสินค้านี้อยู่" });
  }
});

// ---- Orders ----

router.get("/orders", async (req, res) => {
  const orders = await prisma.order.findMany({
    include: { items: true, user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json({ orders });
});

router.patch("/orders/:id/status", async (req, res) => {
  const { status } = req.body;
  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ error: "สถานะไม่ถูกต้อง" });
  }

  const existing = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    return res.status(404).json({ error: "ไม่พบคำสั่งซื้อนี้" });
  }

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status },
    include: { items: true },
  });

  res.json({ order });
});

// ---- Reviews ----

router.get("/reviews", async (req, res) => {
  const reviews = await prisma.review.findMany({
    include: { user: { select: { name: true, email: true } }, product: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json({ reviews });
});

router.delete("/reviews/:id", async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: "ไม่พบรีวิวนี้" });
  }

  await prisma.review.delete({ where: { id } });
  res.json({ success: true });
});

export default router;
