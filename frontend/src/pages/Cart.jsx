import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiPlus, BiMinus, BiTrash } from "react-icons/bi";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import ProductImage from "../components/ProductImage";

const translations = {
  th: {
    emptyTitle: "ตะกร้าสินค้าของคุณว่างเปล่า",
    emptyDesc: "ยังไม่มีสินค้าในตะกร้า ลองเลือกชาที่ถูกใจดูสิ",
    emptyCta: "เลือกซื้อชา / Shop Now",
    pageTitle: "ตะกร้าสินค้าของคุณ (Your Shopping Cart)",
    pageSubtitle: "รายการสินค้าที่คุณเลือกซื้อ คัดสรรอย่างดีเพื่อส่งตรงถึงบ้านคุณ",
    colProduct: "สินค้า / Product",
    colPrice: "ราคาต่อชิ้น / Price",
    colQty: "จำนวน / Qty",
    colTotal: "ราคารวม / Total",
    sizeLabel: "ขนาด",
    priceMobileLabel: "ราคา:",
    totalMobileLabel: "ราคารวม:",
    removeTitle: "ลบสินค้า",
    couponPlaceholder: "กรอกโค้ดส่วนลด (ลอง TEALEAF50)",
    applyButton: "ใช้โค้ด / Apply",
    couponSaved: (amount, code) => `ประหยัดแล้ว ฿${amount}! (${code})`,
    orderSummaryTitle: "สรุปคำสั่งซื้อ (Order Summary)",
    subtotalLabel: "ราคาสินค้ารวม (Subtotal)",
    discountLabel: "ส่วนลด (Discount)",
    shippingLabel: "ค่าจัดส่ง (Shipping)",
    summaryTotalLabel: "ยอดรวมสุทธิ (Total)",
    checkoutButton: "ดำเนินการชำระเงิน / Proceed to Checkout",
    secureNote: "การชำระเงินของคุณปลอดภัย 100%",
  },
  en: {
    emptyTitle: "Your cart is empty",
    emptyDesc: "There are no items in your cart yet. Browse our teas to find something you love.",
    emptyCta: "Shop Now",
    pageTitle: "Your Shopping Cart",
    pageSubtitle: "Items you've selected, carefully curated and delivered straight to your door.",
    colProduct: "Product",
    colPrice: "Price",
    colQty: "Qty",
    colTotal: "Total",
    sizeLabel: "Size",
    priceMobileLabel: "Price:",
    totalMobileLabel: "Total:",
    removeTitle: "Remove item",
    couponPlaceholder: "Discount code (TEALEAF50)",
    applyButton: "Apply",
    couponSaved: (amount, code) => `You saved ฿${amount}! (${code})`,
    orderSummaryTitle: "Order Summary",
    subtotalLabel: "Subtotal",
    discountLabel: "Discount",
    shippingLabel: "Shipping",
    summaryTotalLabel: "Total",
    checkoutButton: "Proceed to Checkout",
    secureNote: "Your payment is 100% secure",
  },
};

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQty, removeItem, subtotal } = useCart();
  const { lang } = useLanguage();
  const t = translations[lang];

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    if (couponInput.trim().toUpperCase() === "TEALEAF50") {
      setAppliedCoupon("TEALEAF50");
      setDiscountAmount(50);
    } else {
      setAppliedCoupon(couponInput.trim().toUpperCase());
      setDiscountAmount(30);
    }
  };

  const shipping = items.length > 0 ? 50 : 0;
  const netTotal = Math.max(subtotal - discountAmount + shipping, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 w-full text-center text-content-primary">
        <h1 className="text-2xl font-bold mb-2">{t.emptyTitle}</h1>
        <p className="text-content-muted text-sm mb-6">{t.emptyDesc}</p>
        <Link
          to="/products"
          className="inline-block px-6 py-3 bg-matcha hover:bg-matcha-hover text-white font-bold text-sm rounded-xl transition-colors"
        >
          {t.emptyCta}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full text-content-primary">
      <div className="text-left mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-content-primary">
          {t.pageTitle}
        </h1>
        <p className="text-content-muted text-xs sm:text-sm mt-1">
          {t.pageSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-hugme-border overflow-hidden shadow-xs">
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-[#FAF8F5] border-b border-hugme-border text-xs font-bold text-content-muted text-left">
              <span className="col-span-5">{t.colProduct}</span>
              <span className="col-span-2 text-center">{t.colPrice}</span>
              <span className="col-span-2 text-center">{t.colQty}</span>
              <span className="col-span-2 text-right">{t.colTotal}</span>
              <span className="col-span-1"></span>
            </div>

            <div className="divide-y divide-hugme-border">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="p-4 sm:px-6 sm:py-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center text-left"
                >
                  <div className="sm:col-span-5 flex items-center gap-3">
                    <ProductImage
                      src={item.imageUrl}
                      alt={item.name}
                      placeholder={item.imagePlaceholder}
                      className="w-16 h-16 sm:w-20 sm:h-20 border border-hugme-border rounded-lg text-[10px] shrink-0"
                    />
                    <div className="flex flex-col">
                      <h3 className="font-bold text-sm sm:text-base text-content-primary">{item.name}</h3>
                      {item.size && <span className="text-content-muted text-xs">{t.sizeLabel} {item.size}</span>}
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex sm:justify-center items-center">
                    <span className="sm:hidden text-xs text-content-muted mr-2">{t.priceMobileLabel}</span>
                    <span className="font-bold text-sm sm:text-base text-content-primary">฿{item.price}</span>
                  </div>

                  <div className="sm:col-span-2 flex sm:justify-center items-center">
                    <div className="inline-flex items-center border border-hugme-border bg-white rounded-lg">
                      <button
                        type="button"
                        onClick={() => updateQty(item.productId, item.size, -1)}
                        className="px-2.5 py-1 text-content-muted hover:text-content-primary transition-colors cursor-pointer"
                      >
                        <BiMinus size={14} />
                      </button>
                      <span className="px-3 text-xs sm:text-sm font-bold text-content-primary">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.productId, item.size, 1)}
                        className="px-2.5 py-1 text-content-muted hover:text-content-primary transition-colors cursor-pointer"
                      >
                        <BiPlus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex justify-between sm:justify-end items-center">
                    <span className="sm:hidden text-xs font-bold text-content-muted">{t.totalMobileLabel}</span>
                    <span className="font-bold text-sm sm:text-base text-content-primary">
                      ฿{item.price * item.qty}
                    </span>
                  </div>

                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId, item.size)}
                      title={t.removeTitle}
                      className="text-content-muted hover:text-red-500 transition-colors cursor-pointer p-1"
                    >
                      <BiTrash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleApplyCoupon} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder={t.couponPlaceholder}
              className="px-4 py-2.5 rounded-xl border border-hugme-border bg-white text-content-primary text-xs sm:text-sm uppercase font-bold focus:outline-none focus:border-matcha w-full sm:w-64"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-matcha hover:bg-matcha-hover text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.applyButton}
            </button>
            {appliedCoupon && (
              <span className="text-matcha font-bold text-xs">
                {t.couponSaved(discountAmount, appliedCoupon)}
              </span>
            )}
          </form>
        </div>

        <div className="bg-hugme-section rounded-xl border border-hugme-border p-6 text-left flex flex-col gap-4">
          <h2 className="font-bold text-base sm:text-lg text-content-primary border-b border-hugme-border pb-3">
            {t.orderSummaryTitle}
          </h2>

          <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
            <div className="flex justify-between items-center">
              <span className="text-content-muted">{t.subtotalLabel}</span>
              <span className="font-bold text-content-primary">฿{subtotal}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-content-muted">{t.discountLabel}</span>
              <span className="font-bold text-earth-terracotta">-฿{discountAmount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-content-muted">{t.shippingLabel}</span>
              <span className="font-bold text-content-primary">฿{shipping}</span>
            </div>
          </div>

          <div className="border-t border-hugme-border pt-4 flex justify-between items-center">
            <span className="font-bold text-sm sm:text-base text-content-primary">{t.summaryTotalLabel}</span>
            <span className="font-bold text-xl sm:text-2xl text-earth-brown">฿{netTotal}</span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/checkout", { state: { discount: discountAmount, coupon: appliedCoupon } })}
            className="w-full py-3.5 bg-matcha hover:bg-matcha-hover text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors mt-2 cursor-pointer"
          >
            {t.checkoutButton}
          </button>

          <span className="text-content-muted text-[11px] text-center block">
            {t.secureNote}
          </span>
        </div>
      </div>
    </div>
  );
}
