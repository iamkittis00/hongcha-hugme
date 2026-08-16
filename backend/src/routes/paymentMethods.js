import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

const TYPE_LABELS = {
  card: "บัตรเครดิต/เดบิต",
  promptpay: "พร้อมเพย์",
  bank: "โอนผ่านบัญชีธนาคาร",
};

router.get("/", async (req, res) => {
  const paymentMethods = await prisma.paymentMethod.findMany({
    where: { userId: req.userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
  res.json({ paymentMethods });
});

router.post("/", async (req, res) => {
  const { type, cardNumber, expiry, isDefault } = req.body;

  if (!type || !TYPE_LABELS[type]) {
    return res.status(400).json({ error: "กรุณาเลือกประเภทวิธีชำระเงิน" });
  }

  let last4 = null;
  let label = TYPE_LABELS[type];

  if (type === "card") {
    const digits = (cardNumber || "").replace(/\s/g, "");
    if (digits.length < 12) {
      return res.status(400).json({ error: "หมายเลขบัตรไม่ถูกต้อง" });
    }
    last4 = digits.slice(-4);
    label = `บัตรลงท้าย ${last4}`;
  }

  if (isDefault) {
    await prisma.paymentMethod.updateMany({ where: { userId: req.userId }, data: { isDefault: false } });
  }

  const created = await prisma.paymentMethod.create({
    data: { userId: req.userId, type, label, last4, expiry: expiry || null, isDefault: !!isDefault },
  });

  res.status(201).json({ paymentMethod: created });
});

router.patch("/:id/default", async (req, res) => {
  const existing = await prisma.paymentMethod.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: "ไม่พบวิธีชำระเงินนี้" });
  }

  await prisma.paymentMethod.updateMany({ where: { userId: req.userId }, data: { isDefault: false } });
  const updated = await prisma.paymentMethod.update({ where: { id: req.params.id }, data: { isDefault: true } });

  res.json({ paymentMethod: updated });
});

router.delete("/:id", async (req, res) => {
  const existing = await prisma.paymentMethod.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: "ไม่พบวิธีชำระเงินนี้" });
  }

  await prisma.paymentMethod.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;
