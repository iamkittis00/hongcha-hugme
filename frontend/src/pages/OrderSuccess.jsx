import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiCheck } from "react-icons/fi";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const translations = {
  th: {
    loading: "กำลังโหลดคำสั่งซื้อ...",
    notFoundTitle: "ไม่พบข้อมูลคำสั่งซื้อ",
    notFoundDesc: "ลิงก์นี้ไม่ถูกต้องหรือหมดอายุแล้ว",
    backToHome: "กลับสู่หน้าแรก / Back to Home",
    orderConfirmedTitle: "สั่งซื้อสำเร็จ! (Order Confirmed!)",
    thankYou: "ขอบคุณสำหรับการสั่งซื้อชาโฮงชาฮักมี ทางร้านได้เริ่มดำเนินการเตรียมจัดส่งสินค้าของท่านแล้ว",
    orderIdLabel: "หมายเลขคำสั่งซื้อของคุณ (Order ID)",
    estimatedDelivery: "คาดว่าจะจัดส่งภายใน",
    shippingExpress: "1-2 วันทำการ (Express delivery)",
    shippingPickup: "รับที่ร้านได้ทันที (Self pick-up)",
    shippingStandard: "3-5 วันทำการ (Standard delivery)",
    orderSummary: "สรุปรายการสั่งซื้อ / Order Summary",
    qtyPrefix: "x",
    subtotal: "ราคาสินค้ารวม",
    discount: "ส่วนลด",
    shippingCost: "ค่าจัดส่ง",
    totalPaid: "ราคาสุทธิ (Total Paid)",
    writeReview: "เขียนรีวิวสินค้า / Write a Review",
  },
  en: {
    loading: "Loading order...",
    notFoundTitle: "Order Not Found",
    notFoundDesc: "This link is invalid or has expired",
    backToHome: "Back to Home",
    orderConfirmedTitle: "Order Confirmed!",
    thankYou: "Thank you for your order from HongCha Hugme. We've started preparing your shipment.",
    orderIdLabel: "Order ID",
    estimatedDelivery: "Estimated delivery within",
    shippingExpress: "1-2 business days (Express delivery)",
    shippingPickup: "Ready for pick-up now (Self pick-up)",
    shippingStandard: "3-5 business days (Standard delivery)",
    orderSummary: "Order Summary",
    qtyPrefix: "x",
    subtotal: "Subtotal",
    discount: "Discount",
    shippingCost: "Shipping",
    totalPaid: "Total Paid",
    writeReview: "Write a Review",
  },
};

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { token } = useAuth();
  const { lang } = useLanguage();
  const t = translations[lang];

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(!!orderId);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId || !token) {
      setLoading(false);
      return;
    }
    api
      .get(`/orders/${orderId}`, token)
      .then((data) => setOrder(data.order))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderId, token]);

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center text-content-muted text-sm">{t.loading}</div>;
  }

  if (!orderId || error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 w-full text-center text-content-primary">
        <h1 className="text-2xl font-bold mb-2">{t.notFoundTitle}</h1>
        <p className="text-content-muted text-sm mb-6">{error || t.notFoundDesc}</p>
        <Link to="/" className="inline-block px-6 py-3 bg-matcha hover:bg-matcha-hover text-white font-bold text-sm rounded-xl transition-colors">
          {t.backToHome}
        </Link>
      </div>
    );
  }

  const shippingLabel =
    order.shippingMethod === "express"
      ? t.shippingExpress
      : order.shippingMethod === "pickup"
      ? t.shippingPickup
      : t.shippingStandard;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full text-content-primary flex justify-center items-center">
      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-[620px] p-6 sm:p-10 text-center shadow-lg border border-hugme-border flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-matcha flex justify-center items-center text-white mb-5 shadow-sm">
          <FiCheck size={36} strokeWidth={3} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-content-primary mb-1">
          {t.orderConfirmedTitle}
        </h1>
        <p className="text-content-muted text-xs sm:text-sm max-w-md leading-relaxed mb-6">
          {t.thankYou}
        </p>

        <div className="w-full bg-[#FAF5EE] border border-hugme-border rounded-2xl p-4 sm:p-5 mb-4 text-center">
          <span className="text-content-muted text-xs block mb-1">
            {t.orderIdLabel}
          </span>
          <span className="text-earth-brown text-xl sm:text-2xl font-bold tracking-wider">
            #{order.orderNumber}
          </span>
        </div>

        <p className="text-content-muted text-xs mb-6">
          {t.estimatedDelivery} {shippingLabel}
        </p>

        <div className="w-full border-t border-hugme-border pt-6 mb-8 text-left flex flex-col gap-4">
          <h2 className="font-bold text-sm sm:text-base text-content-primary">
            {t.orderSummary}
          </h2>

          <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <span className="text-content-primary">
                  {item.name}
                  {item.size ? ` (${item.size})` : ""} <span className="text-content-muted">{t.qtyPrefix}{item.qty}</span>
                </span>
                <span className="font-bold text-content-primary">฿{item.price * item.qty}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-hugme-border pt-3 flex flex-col gap-2 text-xs">
            <div className="flex justify-between items-center text-content-muted">
              <span>{t.subtotal}</span>
              <span className="font-bold text-content-primary">฿{order.subtotal}</span>
            </div>
            <div className="flex justify-between items-center text-content-muted">
              <span>{t.discount}</span>
              <span className="font-bold text-earth-terracotta">-฿{order.discount}</span>
            </div>
            <div className="flex justify-between items-center text-content-muted">
              <span>{t.shippingCost}</span>
              <span className="font-bold text-content-primary">฿{order.shippingCost}</span>
            </div>
          </div>

          <div className="border-t border-hugme-border pt-3 flex justify-between items-center text-sm sm:text-base">
            <span className="font-bold text-content-primary">{t.totalPaid}</span>
            <span className="font-bold text-xl sm:text-2xl text-earth-brown">
              ฿{order.total}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
          <Link
            to="/"
            className="py-3 px-4 border border-hugme-border hover:bg-gray-50 text-content-primary font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer text-center"
          >
            {t.backToHome}
          </Link>
          <Link
            to="/reviews"
            className="py-3 px-4 bg-matcha hover:bg-matcha-hover text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer text-center"
          >
            {t.writeReview}
          </Link>
        </div>
      </div>
    </div>
  );
}
