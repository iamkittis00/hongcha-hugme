import { Router } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

// รายชื่ออีเมลบัญชีทดลองที่อนุญาตให้ endpoint จำลอง forgot-password เปิดเผย reset token ตรงๆ ได้
// เว็บนี้ deploy ขึ้นโดเมนสาธารณะจริง (ไม่ใช่แค่ localhost) จึงต้องจำกัดไว้เฉพาะบัญชีที่ตั้งใจให้คนมาทดลองเล่น
// ไม่งั้นใครก็เดาอีเมลลูกค้าจริงแล้วขอ token ไปยึดบัญชีได้ (ดู CVE ภายในที่แก้ไปก่อนหน้านี้)
const DEMO_RESET_ALLOWLIST = new Set([
  "admin@hongcha.demo",
  "demo@hongcha.demo",
  "demo.google@hongcha.demo",
  "demo.facebook@hongcha.demo",
]);

function issueToken(user) {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    provider: user.provider,
    role: user.role,
  };
}

const SOCIAL_PROVIDERS = {
  google: "ผู้ใช้ทดลอง (Google)",
  facebook: "ผู้ใช้ทดลอง (Facebook)",
};

router.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "กรุณากรอกชื่อ อีเมล และรหัสผ่านให้ครบถ้วน" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "อีเมลนี้ถูกใช้สมัครสมาชิกแล้ว" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, phone: phone || null, password: hashed },
  });

  res.status(201).json({ token: issueToken(user), user: toPublicUser(user) });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "กรุณากรอกอีเมลและรหัสผ่าน" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
  }

  res.json({ token: issueToken(user), user: toPublicUser(user) });
});

// โหมดจำลอง (demo): ไม่ได้เชื่อมต่อ Google/Facebook OAuth จริง แค่สร้าง/คืนบัญชีทดลองที่ผูกกับ provider
// เพื่อให้กดปุ่มแล้วได้ user จริงใน DB ทดสอบ flow ต่อ (ตะกร้า/ออเดอร์/รีวิว) ได้เหมือนบัญชีจริง
router.post("/social", async (req, res) => {
  const { provider } = req.body;

  const label = SOCIAL_PROVIDERS[provider];
  if (!label) {
    return res.status(400).json({ error: "ผู้ให้บริการเข้าสู่ระบบนี้ยังไม่รองรับ" });
  }

  const email = `demo.${provider}@hongcha.demo`;
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const randomPassword = await bcrypt.hash(`${provider}-${Date.now()}-${Math.random()}`, 10);
    user = await prisma.user.create({
      data: { name: label, email, password: randomPassword, provider },
    });
  }

  res.json({ token: issueToken(user), user: toPublicUser(user) });
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) {
    return res.status(404).json({ error: "ไม่พบผู้ใช้" });
  }
  res.json({ user: toPublicUser(user) });
});

router.patch("/me", requireAuth, async (req, res) => {
  const { name, phone, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "กรุณากรอกชื่อและอีเมลให้ครบถ้วน" });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== req.userId) {
    return res.status(409).json({ error: "อีเมลนี้ถูกใช้โดยบัญชีอื่นแล้ว" });
  }

  const user = await prisma.user.update({
    where: { id: req.userId },
    data: { name, phone: phone || null, email },
  });

  res.json({ user: toPublicUser(user) });
});

router.post("/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "กรุณากรอกรหัสผ่านปัจจุบันและรหัสผ่านใหม่" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร" });
  }

  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    return res.status(401).json({ error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: req.userId }, data: { password: hashed } });

  res.json({ success: true });
});

// โหมดจำลอง (demo): ไม่ได้ส่งอีเมลจริง — คืน token/ลิงก์รีเซ็ตกลับมาใน response ตรงๆ
// ให้ frontend โชว์ลิงก์ในหน้าเว็บแทนการรอรับอีเมล เหมือนโหมดจำลองจ่ายเงิน
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "กรุณากรอกอีเมล" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: "ไม่พบบัญชีที่ใช้อีเมลนี้" });
  }

  const resetToken = crypto.randomBytes(24).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry },
  });

  // โหมดจำลอง: แสดง token ตรงๆ ให้เฉพาะบัญชีทดลองที่กำหนดไว้ล่วงหน้าเท่านั้น (DEMO_RESET_ALLOWLIST)
  // เว็บนี้อยู่บนโดเมนสาธารณะจริงแล้ว ถ้าเปิดให้ทุกอีเมลเห็น token ใครก็เดาอีเมลลูกค้าจริง
  // แล้วขอ reset token ไปยึดบัญชีคนอื่นได้โดยไม่ต้องมีสิทธิ์เข้าถึงอีเมลจริงเลย
  if (!DEMO_RESET_ALLOWLIST.has(email)) {
    return res.json({
      resetToken: null,
      blocked: true,
      error:
        "สร้างลิงก์รีเซ็ตรหัสผ่านแล้ว แต่เพื่อความปลอดภัย เว็บ demo นี้แสดงลิงก์ตรงๆ ให้เฉพาะบัญชีทดลองที่กำหนดไว้เท่านั้น (เช่น admin@hongcha.demo, demo@hongcha.demo) กรุณาติดต่อผู้ดูแลระบบสำหรับบัญชีอื่น",
    });
  }

  res.json({ resetToken });
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร" });
  }

  const user = await prisma.user.findFirst({ where: { resetToken: token } });
  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    return res.status(400).json({ error: "ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุแล้ว" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, resetToken: null, resetTokenExpiry: null },
  });

  res.json({ success: true });
});

export default router;
