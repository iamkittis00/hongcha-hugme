import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  const addresses = await prisma.address.findMany({
    where: { userId: req.userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
  res.json({ addresses });
});

router.post("/", async (req, res) => {
  const { label, fullName, phone, address, province, postalCode, isDefault } = req.body;

  if (!label || !fullName || !phone || !address || !province || !postalCode) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน" });
  }

  if (isDefault) {
    await prisma.address.updateMany({ where: { userId: req.userId }, data: { isDefault: false } });
  }

  const created = await prisma.address.create({
    data: { userId: req.userId, label, fullName, phone, address, province, postalCode, isDefault: !!isDefault },
  });

  res.status(201).json({ address: created });
});

router.patch("/:id", async (req, res) => {
  const existing = await prisma.address.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: "ไม่พบที่อยู่นี้" });
  }

  const { label, fullName, phone, address, province, postalCode } = req.body;
  const updated = await prisma.address.update({
    where: { id: req.params.id },
    data: { label, fullName, phone, address, province, postalCode },
  });

  res.json({ address: updated });
});

router.patch("/:id/default", async (req, res) => {
  const existing = await prisma.address.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: "ไม่พบที่อยู่นี้" });
  }

  await prisma.address.updateMany({ where: { userId: req.userId }, data: { isDefault: false } });
  const updated = await prisma.address.update({ where: { id: req.params.id }, data: { isDefault: true } });

  res.json({ address: updated });
});

router.delete("/:id", async (req, res) => {
  const existing = await prisma.address.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: "ไม่พบที่อยู่นี้" });
  }

  await prisma.address.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;
