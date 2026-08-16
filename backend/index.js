import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.js";
import productRoutes from "./src/routes/products.js";
import orderRoutes from "./src/routes/orders.js";
import reviewRoutes from "./src/routes/reviews.js";
import addressRoutes from "./src/routes/addresses.js";
import paymentMethodRoutes from "./src/routes/paymentMethods.js";

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

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`HongCha API listening on http://localhost:${port}`);
});
