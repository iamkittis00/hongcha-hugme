import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../lib/api";

const translations = {
  th: {
    emptyTitle: "ไม่มีสินค้าให้ชำระเงิน",
    emptyDesc: "ตะกร้าของคุณว่างเปล่า กลับไปเลือกซื้อชาก่อนนะ",
    emptyCta: "เลือกซื้อชา / Shop Now",
    pageTitle: "ชำระเงินคำสั่งซื้อของคุณ (Checkout / Payment)",
    pageSubtitle: "ระบุข้อมูลการจัดส่ง เลือกบริการส่งสินค้า และช่องทางการชำระเงินเพื่อดำเนินการเสร็จสิ้น",
    step1Title: "ที่อยู่จัดส่ง / Shipping Address",
    fullNameLabel: "ชื่อ-นามสกุล / Full Name",
    addressLabel: "ที่อยู่ปัจจุบัน / Address Details",
    provinceLabel: "จังหวัด / Province",
    postalCodeLabel: "รหัสไปรษณีย์ / Postal Code",
    phoneLabel: "เบอร์โทรศัพท์ / Phone Number",
    emailLabel: "อีเมล / Email Address",
    step2Title: "วิธีการจัดส่ง / Shipping Method",
    shippingStandard: "จัดส่งปกติ (Standard Delivery)",
    shippingStandardDesc: "คาดว่าจะได้รับใน 3-5 วันทำการ",
    shippingExpress: "จัดส่งด่วน (Express Delivery)",
    shippingExpressDesc: "คาดว่าจะได้รับใน 1-2 วันทำการ",
    shippingPickup: "รับที่ร้าน (Self Pick-up)",
    shippingPickupDesc: "รับสินค้าด้วยตัวเองที่สาขาเชียงใหม่",
    free: "ฟรี",
    step3Title: "วิธีชำระเงิน / Payment Method",
    payCard: "บัตรเครดิต / บัตรเดบิต (Credit or Debit Card)",
    useNewCard: "ใช้บัตรใหม่",
    cvvLabel: "รหัสหลังบัตร / CVV",
    testModeNote: "โหมดทดสอบ: ใช้เลขบัตรใดก็ได้ (อย่างน้อย 12 หลัก) — เลขที่ลงท้ายด้วย 0002 จะจำลองว่าบัตรถูกปฏิเสธ",
    cardNumberLabel: "หมายเลขบัตร / Card Number",
    expiryLabel: "วันหมดอายุ / Expiry Date",
    payPromptpay: "พร้อมเพย์ / สแกนคิวอาร์ (PromptPay / QR Code)",
    payBank: "โอนผ่านบัญชีธนาคาร (Bank Transfer)",
    payCod: "บริการเก็บเงินปลายทาง (Cash on Delivery)",
    orderItemsTitle: "รายการสินค้าในคำสั่งซื้อของคุณ",
    qtyPrefix: "จำนวน:",
    sizePrefix: "ขนาด:",
    subtotalLabel: "ราคาสินค้ารวม (Subtotal)",
    discountLabel: "ส่วนลด (Discount)",
    shippingCostLabel: "ค่าจัดส่ง (Shipping)",
    totalLabel: "ยอดรวมชำระสุทธิ (Total)",
    placingOrder: "กำลังประมวลผลการชำระเงิน...",
    placeOrder: "ยืนยันการสั่งซื้อ / Place Order",
    agreementNote: "เมื่อกดยืนยัน ถือว่ายอมรับเงื่อนไขบริการของทางร้านแล้ว",
    errorEmptyCart: "ตะกร้าสินค้าว่างเปล่า",
    errorIncompleteAddress: "กรุณากรอกที่อยู่จัดส่งให้ครบถ้วน",
    errorCvvRequired: "กรุณากรอกรหัสหลังบัตร (CVV) เพื่อยืนยัน",
  },
  en: {
    emptyTitle: "Nothing to check out",
    emptyDesc: "Your cart is empty. Go back and pick out some tea first.",
    emptyCta: "Shop Now",
    pageTitle: "Checkout / Payment",
    pageSubtitle: "Enter your shipping details, choose a delivery option, and select a payment method to complete your order.",
    step1Title: "Shipping Address",
    fullNameLabel: "Full Name",
    addressLabel: "Address Details",
    provinceLabel: "Province",
    postalCodeLabel: "Postal Code",
    phoneLabel: "Phone Number",
    emailLabel: "Email Address",
    step2Title: "Shipping Method",
    shippingStandard: "Standard Delivery",
    shippingStandardDesc: "Estimated to arrive in 3-5 business days",
    shippingExpress: "Express Delivery",
    shippingExpressDesc: "Estimated to arrive in 1-2 business days",
    shippingPickup: "Self Pick-up",
    shippingPickupDesc: "Pick up in person at our Chiang Mai branch",
    free: "Free",
    step3Title: "Payment Method",
    payCard: "Credit or Debit Card",
    useNewCard: "Use a new card",
    cvvLabel: "CVV",
    testModeNote: "Test mode: any card number works (at least 12 digits) — numbers ending in 0002 will simulate a declined card.",
    cardNumberLabel: "Card Number",
    expiryLabel: "Expiry Date",
    payPromptpay: "PromptPay / QR Code",
    payBank: "Bank Transfer",
    payCod: "Cash on Delivery",
    orderItemsTitle: "Items in Your Order",
    qtyPrefix: "Qty:",
    sizePrefix: "Size:",
    subtotalLabel: "Subtotal",
    discountLabel: "Discount",
    shippingCostLabel: "Shipping",
    totalLabel: "Total",
    placingOrder: "Processing payment...",
    placeOrder: "Place Order",
    agreementNote: "By confirming, you agree to our terms of service.",
    errorEmptyCart: "Your cart is empty",
    errorIncompleteAddress: "Please fill in the complete shipping address",
    errorCvvRequired: "Please enter the CVV to confirm",
  },
};

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, subtotal, clear } = useCart();
  const { isAuthenticated, token, openAuthModal, user } = useAuth();
  const { lang } = useLanguage();
  const t = translations[lang];

  const discount = location.state?.discount || 0;

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    address: "",
    province: "",
    postalCode: "",
    phone: "",
    email: user?.email || "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);
  const [selectedSavedMethodId, setSelectedSavedMethodId] = useState(null);

  useEffect(() => {
    if (!user) return;
    setFormData((f) => ({
      ...f,
      fullName: f.fullName || user.name || "",
      email: f.email || user.email || "",
    }));
  }, [user]);

  useEffect(() => {
    if (!token) return;
    api.get("/addresses", token).then((data) => {
      setSavedAddresses(data.addresses);
      const def = data.addresses.find((a) => a.isDefault);
      if (def) applyAddress(def);
    }).catch(() => {});
    api.get("/payment-methods", token).then((data) => setSavedPaymentMethods(data.paymentMethods)).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const applyAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setFormData((f) => ({
      ...f,
      fullName: addr.fullName,
      phone: addr.phone,
      address: addr.address,
      province: addr.province,
      postalCode: addr.postalCode,
    }));
  };

  const savedCardMethods = savedPaymentMethods.filter((m) => m.type === "card");

  const shippingCost = shippingMethod === "express" ? 100 : shippingMethod === "pickup" ? 0 : 50;
  const total = Math.max(subtotal - discount + shippingCost, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }
    if (items.length === 0) {
      setError(t.errorEmptyCart);
      return;
    }
    if (!formData.fullName || !formData.address || !formData.province || !formData.postalCode || !formData.phone || !formData.email) {
      setError(t.errorIncompleteAddress);
      return;
    }
    if (paymentMethod === "card" && selectedSavedMethodId && !formData.cvv) {
      setError(t.errorCvvRequired);
      return;
    }

    setSubmitting(true);
    try {
      // จำลองเวลาประมวลผลการชำระเงิน
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const { order } = await api.post(
        "/orders",
        {
          items: items.map((item) => ({ productId: item.productId, qty: item.qty, size: item.size })),
          shippingMethod,
          paymentMethod,
          discount,
          cardNumber: formData.cardNumber,
          savedPaymentMethodId: paymentMethod === "card" ? selectedSavedMethodId : null,
          fullName: formData.fullName,
          address: formData.address,
          province: formData.province,
          postalCode: formData.postalCode,
          phone: formData.phone,
          email: formData.email,
        },
        token
      );

      clear();
      navigate(`/order-success?orderId=${order.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

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
        <form onSubmit={handlePlaceOrder} className="lg:col-span-2 flex flex-col gap-6 text-left">
          <div className="bg-white rounded-xl border border-hugme-border p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-3 border-b border-hugme-border pb-3">
              <span className="w-7 h-7 rounded-full bg-matcha text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h2 className="font-bold text-base sm:text-lg text-content-primary">
                {t.step1Title}
              </h2>
            </div>

            {savedAddresses.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {savedAddresses.map((addr) => (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => applyAddress(addr)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      selectedAddressId === addr.id
                        ? "bg-matcha text-white border-matcha"
                        : "bg-white text-content-primary border-hugme-border hover:border-matcha"
                    }`}
                  >
                    {addr.label}
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-3.5">
              <div>
                <label className="block text-content-primary font-bold text-xs mb-1">
                  {t.fullNameLabel}
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-hugme-border bg-[#F9F8F6] text-content-primary text-xs sm:text-sm focus:outline-none focus:border-matcha focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-content-primary font-bold text-xs mb-1">
                  {t.addressLabel}
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-hugme-border bg-[#F9F8F6] text-content-primary text-xs sm:text-sm focus:outline-none focus:border-matcha focus:bg-white transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-content-primary font-bold text-xs mb-1">
                    {t.provinceLabel}
                  </label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-hugme-border bg-[#F9F8F6] text-content-primary text-xs sm:text-sm focus:outline-none focus:border-matcha focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-content-primary font-bold text-xs mb-1">
                    {t.postalCodeLabel}
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-hugme-border bg-[#F9F8F6] text-content-primary text-xs sm:text-sm focus:outline-none focus:border-matcha focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-content-primary font-bold text-xs mb-1">
                    {t.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-hugme-border bg-[#F9F8F6] text-content-primary text-xs sm:text-sm focus:outline-none focus:border-matcha focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-content-primary font-bold text-xs mb-1">
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-hugme-border bg-[#F9F8F6] text-content-primary text-xs sm:text-sm focus:outline-none focus:border-matcha focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-hugme-border p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-3 border-b border-hugme-border pb-3">
              <span className="w-7 h-7 rounded-full bg-matcha text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h2 className="font-bold text-base sm:text-lg text-content-primary">
                {t.step2Title}
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              <label
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  shippingMethod === "standard" ? "border-matcha bg-matcha-soft/20 ring-1 ring-matcha" : "border-hugme-border hover:border-matcha/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === "standard"}
                    onChange={() => setShippingMethod("standard")}
                    className="w-4 h-4 accent-matcha cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-xs sm:text-sm text-content-primary">{t.shippingStandard}</span>
                    <span className="text-content-muted text-[11px]">{t.shippingStandardDesc}</span>
                  </div>
                </div>
                <span className="font-bold text-xs sm:text-sm text-content-primary">฿50</span>
              </label>

              <label
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  shippingMethod === "express" ? "border-matcha bg-matcha-soft/20 ring-1 ring-matcha" : "border-hugme-border hover:border-matcha/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === "express"}
                    onChange={() => setShippingMethod("express")}
                    className="w-4 h-4 accent-matcha cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-xs sm:text-sm text-content-primary">{t.shippingExpress}</span>
                    <span className="text-content-muted text-[11px]">{t.shippingExpressDesc}</span>
                  </div>
                </div>
                <span className="font-bold text-xs sm:text-sm text-content-primary">฿100</span>
              </label>

              <label
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  shippingMethod === "pickup" ? "border-matcha bg-matcha-soft/20 ring-1 ring-matcha" : "border-hugme-border hover:border-matcha/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === "pickup"}
                    onChange={() => setShippingMethod("pickup")}
                    className="w-4 h-4 accent-matcha cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-xs sm:text-sm text-content-primary">{t.shippingPickup}</span>
                    <span className="text-content-muted text-[11px]">{t.shippingPickupDesc}</span>
                  </div>
                </div>
                <span className="font-bold text-xs sm:text-sm text-matcha">{t.free}</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-hugme-border p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-3 border-b border-hugme-border pb-3">
              <span className="w-7 h-7 rounded-full bg-matcha text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h2 className="font-bold text-base sm:text-lg text-content-primary">
                {t.step3Title}
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              <div
                className={`rounded-xl border transition-all ${
                  paymentMethod === "card" ? "border-matcha ring-1 ring-matcha" : "border-hugme-border"
                }`}
              >
                <label className="p-4 flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="w-4 h-4 accent-matcha cursor-pointer"
                  />
                  <span className="font-bold text-xs sm:text-sm text-content-primary">
                    {t.payCard}
                  </span>
                </label>

                {paymentMethod === "card" && (
                  <div className="px-5 pb-5 pt-2 border-t border-hugme-border bg-[#FAF8F5] rounded-b-xl flex flex-col gap-3">
                    {savedCardMethods.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {savedCardMethods.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setSelectedSavedMethodId(m.id === selectedSavedMethodId ? null : m.id)}
                            className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                              selectedSavedMethodId === m.id
                                ? "bg-matcha text-white border-matcha"
                                : "bg-white text-content-primary border-hugme-border hover:border-matcha"
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setSelectedSavedMethodId(null)}
                          className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                            !selectedSavedMethodId
                              ? "bg-matcha text-white border-matcha"
                              : "bg-white text-content-primary border-hugme-border hover:border-matcha"
                          }`}
                        >
                          {t.useNewCard}
                        </button>
                      </div>
                    )}

                    {selectedSavedMethodId ? (
                      <div className="w-40">
                        <label className="block text-content-primary font-bold text-xs mb-1">
                          {t.cvvLabel}
                        </label>
                        <input
                          type="password"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-hugme-border bg-white text-content-primary text-xs focus:outline-none focus:border-matcha"
                        />
                      </div>
                    ) : (
                      <>
                        <p className="text-content-muted text-[11px]">
                          {t.testModeNote}
                        </p>
                        <div>
                          <label className="block text-content-primary font-bold text-xs mb-1">
                            {t.cardNumberLabel}
                          </label>
                          <input
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            value={formData.cardNumber}
                            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-xl border border-hugme-border bg-white text-content-primary text-xs focus:outline-none focus:border-matcha"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-content-primary font-bold text-xs mb-1">
                              {t.expiryLabel}
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              value={formData.expiry}
                              onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                              className="w-full px-3.5 py-2 rounded-xl border border-hugme-border bg-white text-content-primary text-xs focus:outline-none focus:border-matcha"
                            />
                          </div>
                          <div>
                            <label className="block text-content-primary font-bold text-xs mb-1">
                              {t.cvvLabel}
                            </label>
                            <input
                              type="password"
                              placeholder="123"
                              value={formData.cvv}
                              onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                              className="w-full px-3.5 py-2 rounded-xl border border-hugme-border bg-white text-content-primary text-xs focus:outline-none focus:border-matcha"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <label
                className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === "promptpay" ? "border-matcha bg-matcha-soft/20 ring-1 ring-matcha" : "border-hugme-border hover:border-matcha/50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "promptpay"}
                  onChange={() => setPaymentMethod("promptpay")}
                  className="w-4 h-4 accent-matcha cursor-pointer"
                />
                <span className="font-bold text-xs sm:text-sm text-content-primary">
                  {t.payPromptpay}
                </span>
              </label>

              <label
                className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === "bank" ? "border-matcha bg-matcha-soft/20 ring-1 ring-matcha" : "border-hugme-border hover:border-matcha/50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                  className="w-4 h-4 accent-matcha cursor-pointer"
                />
                <span className="font-bold text-xs sm:text-sm text-content-primary">
                  {t.payBank}
                </span>
              </label>

              <label
                className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === "cod" ? "border-matcha bg-matcha-soft/20 ring-1 ring-matcha" : "border-hugme-border hover:border-matcha/50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="w-4 h-4 accent-matcha cursor-pointer"
                />
                <span className="font-bold text-xs sm:text-sm text-content-primary">
                  {t.payCod}
                </span>
              </label>
            </div>
          </div>
        </form>

        <div className="bg-hugme-section rounded-xl border border-hugme-border p-6 text-left flex flex-col gap-4 sticky top-24">
          <h2 className="font-bold text-base text-content-primary border-b border-hugme-border pb-3">
            {t.orderItemsTitle}
          </h2>

          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-12 bg-hugme-image border border-hugme-border rounded flex items-center justify-center text-[9px] text-content-muted shrink-0">
                    {item.imagePlaceholder}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-content-primary">{item.name}</span>
                    <span className="text-content-muted text-[11px]">
                      {t.qtyPrefix} {item.qty}{item.size ? ` | ${t.sizePrefix} ${item.size}` : ""}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-content-primary whitespace-nowrap">฿{item.price * item.qty}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-hugme-border pt-4 flex flex-col gap-2 text-xs">
            <div className="flex justify-between items-center text-content-muted">
              <span>{t.subtotalLabel}</span>
              <span className="font-bold text-content-primary">฿{subtotal}</span>
            </div>
            <div className="flex justify-between items-center text-content-muted">
              <span>{t.discountLabel}</span>
              <span className="font-bold text-earth-terracotta">-฿{discount}</span>
            </div>
            <div className="flex justify-between items-center text-content-muted">
              <span>{t.shippingCostLabel}</span>
              <span className="font-bold text-content-primary">฿{shippingCost}</span>
            </div>
          </div>

          <div className="border-t border-hugme-border pt-3 flex justify-between items-center">
            <span className="font-bold text-sm sm:text-base text-content-primary">{t.totalLabel}</span>
            <span className="font-bold text-xl sm:text-2xl text-earth-brown">฿{total}</span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3.5 py-2.5">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="w-full py-3.5 bg-matcha hover:bg-matcha-hover text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? t.placingOrder : t.placeOrder}
          </button>

          <span className="text-content-muted text-[11px] text-center block">
            {t.agreementNote}
          </span>
        </div>
      </div>
    </div>
  );
}
