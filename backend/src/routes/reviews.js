import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  const { category } = req.query;

  const reviews = await prisma.review.findMany({
    where: category ? { product: { category } } : undefined,
    include: {
      user: { select: { name: true } },
      product: { select: { id: true, title: true, category: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({ reviews });
});

router.post("/", requireAuth, async (req, res) => {
  const { productId, rating, comment } = req.body;

  if (!productId || !rating || !comment || !comment.trim()) {
    return res.status(400).json({ error: "กรุณาให้คะแนนและเขียนความเห็นก่อนส่งรีวิว" });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "คะแนนต้องอยู่ระหว่าง 1-5 ดาว" });
  }

  const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
  if (!product) {
    return res.status(404).json({ error: "ไม่พบสินค้านี้" });
  }

  const review = await prisma.review.create({
    data: {
      productId: Number(productId),
      userId: req.userId,
      rating: Number(rating),
      comment: comment.trim(),
    },
    include: { user: { select: { name: true } } },
  });

  res.status(201).json({ review });
});

export default router;
