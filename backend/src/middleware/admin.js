import { prisma } from "../lib/prisma.js";

export async function requireAdmin(req, res, next) {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "ไม่มีสิทธิ์เข้าถึงส่วนนี้" });
  }
  next();
}
