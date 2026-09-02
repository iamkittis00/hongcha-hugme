import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.js";
import productRoutes from "./src/routes/products.js";
import orderRoutes from "./src/routes/orders.js";
import reviewRoutes from "./src/routes/reviews.js";
import addressRoutes from "./src/routes/addresses.js";
import paymentMethodRoutes from "./src/routes/paymentMethods.js";
import adminRoutes from "./src/routes/admin.js";

// ตรวจ env ที่จำเป็นตั้งแต่ตอน start และหยุดทันทีถ้าไม่ผ่าน
// ดีกว่าปล่อยให้รันต่อด้วย secret อ่อนๆ แล้วมารู้ตอนโดนปลอม JWT
const MIN_JWT_SECRET_LENGTH = 32;

if (!process.env.DATABASE_URL) {
  console.error("ไม่พบ DATABASE_URL — หยุดการทำงาน");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("ไม่พบ JWT_SECRET — หยุดการทำงาน");
  process.exit(1);
}
if (process.env.JWT_SECRET.length < MIN_JWT_SECRET_LENGTH) {
  console.error(`JWT_SECRET สั้นเกินไป ต้องมีอย่างน้อย ${MIN_JWT_SECRET_LENGTH} ตัวอักษร — หยุดการทำงาน`);
  process.exit(1);
}

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/payment-methods", paymentMethodRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`HongCha API listening on http://localhost:${port}`);
});
