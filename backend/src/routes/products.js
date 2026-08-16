import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

function ratingSummary(reviews) {
  const count = reviews.length;
  const average = count ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
  const breakdown = [5, 4, 3, 2, 1].map((stars) => {
    const starCount = reviews.filter((r) => r.rating === stars).length;
    return {
      stars,
      count: starCount,
      percentage: count ? Math.round((starCount / count) * 100) : 0,
    };
  });
  return { average: Math.round(average * 10) / 10, count, breakdown };
}

router.get("/", async (req, res) => {
  const { category, minPrice, maxPrice, sort } = req.query;

  const where = {};
  if (category) where.category = category;
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { price: sort === "high-low" ? "desc" : "asc" },
    include: { reviews: { select: { rating: true } } },
  });

  const withRatings = products.map(({ reviews, ...product }) => {
    const count = reviews.length;
    const average = count ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
    return { ...product, avgRating: Math.round(average * 10) / 10, reviewCount: count };
  });

  res.json({ products: withRatings });
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return res.status(404).json({ error: "ไม่พบสินค้านี้" });
  }

  const reviews = await prisma.review.findMany({ where: { productId: id } });
  res.json({ product, rating: ratingSummary(reviews) });
});

router.get("/:id/reviews", async (req, res) => {
  const id = Number(req.params.id);
  const reviews = await prisma.review.findMany({
    where: { productId: id },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  res.json({ reviews, rating: ratingSummary(reviews) });
});

export default router;
