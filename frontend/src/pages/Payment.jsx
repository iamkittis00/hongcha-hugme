import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { BiChevronRight, BiPlus, BiTrash, BiCheck, BiCreditCard } from "react-icons/bi";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../lib/api";

const translations = {
  th: {
    breadcrumbHome: "หน้าแรก (Home)",
    breadcrumbPayment: "การชำระเงิน",
    title: "การชำระเงิน / Payment",
    subtitle: "ดูประวัติคำสั่งซื้อและจัดการวิธีชำระเงินที่บันทึกไว้",
    loginRequiredTitle: "กรุณาเข้าสู่ระบบ",
    loginRequiredDesc: "ต้องเข้าสู่ระบบก่อนเข้าถึงหน้านี้",
    loginButton: "เข้าสู่ระบบ",
    ordersTab: "ประวัติคำสั่งซื้อ",
    methodsTab: "วิธีชำระเงินที่บันทึกไว้",
    noOrders: "ยังไม่มีคำสั่งซื้อ",
    viewOrder: "ดูรายละเอียด",
    orderItemsCount: "รายการ",
    addMethod: "เพิ่มวิธีชำระเงิน",
    noMethods: "ยังไม่มีวิธีชำระเงินที่บันทึกไว้",
    typeCard: "บัตรเครดิต/เดบิต",
    typePromptpay: "พร้อมเพย์",
    typeBank: "โอนผ่านบัญชีธนาคาร",
    cardNumberLabel: "หมายเลขบัตร",
    expiryLabel: "วันหมดอายุ (MM/YY)",
    setAsDefaultCheckbox: "ตั้งเป็นวิธีชำระเงินเริ่มต้น",
    save: "บันทึก",
    cancel: "ยกเลิก",
    defaultBadge: "ค่าเริ่มต้น",
    setDefault: "ตั้งเป็นค่าเริ่มต้น",
    delete: "ลบ",
    securityNote: "เก็บเฉพาะเลข 4 ตัวท้ายเพื่อความปลอดภัย ไม่มีการเก็บเลขบัตรเต็ม",
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbPayment: "Payment",
    title: "Payment",
    subtitle: "View your order history and manage saved payment methods",
    loginRequiredTitle: "Please log in",
    loginRequiredDesc: "You need to log in to access this page",
    loginButton: "Log In",
    ordersTab: "Order History",
    methodsTab: "Saved Payment Methods",
    noOrders: "No orders yet",
    viewOrder: "View Details",
    orderItemsCount: "item(s)",
    addMethod: "Add Payment Method",
    noMethods: "No saved payment methods yet",
    typeCard: "Credit / Debit Card",
    typePromptpay: "PromptPay",
    typeBank: "Bank Transfer",
    cardNumberLabel: "Card Number",
    expiryLabel: "Expiry (MM/YY)",
    setAsDefaultCheckbox: "Set as default payment method",
    save: "Save",
    cancel: "Cancel",
    defaultBadge: "Default",
    setDefault: "Set as default",
    delete: "Delete",
    securityNote: "Only the last 4 digits are stored for security — full card numbers are never saved.",
  },
};

export default function Payment() {
  const { token, isAuthenticated, openAuthModal } = useAuth();
  const { lang } = useLanguage();
  const t = translations[lang];

  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [methods, setMethods] = useState([]);
  const [methodFormOpen, setMethodFormOpen] = useState(false);
  const [methodForm, setMethodForm] = useState({ type: "card", cardNumber: "", expiry: "", isDefault: false });
  const [methodError, setMethodError] = useState("");

  const loadOrders = useCallback(() => {
    if (!token) return;
    api.get("/orders", token).then((data) => setOrders(data.orders)).catch(() => {});
  }, [token]);

  const loadMethods = useCallback(() => {
    if (!token) return;
    api.get("/payment-methods", token).then((data) => setMethods(data.paymentMethods)).catch(() => {});
  }, [token]);

  useEffect(() => {
    loadOrders();
    loadMethods();
  }, [loadOrders, loadMethods]);

  const handleMethodSubmit = async (e) => {
    e.preventDefault();
    setMethodError("");
    try {
      await api.post("/payment-methods", methodForm, token);
      setMethodFormOpen(false);
      setMethodForm({ type: "card", cardNumber: "", expiry: "", isDefault: false });
      loadMethods();
    } catch (err) {
      setMethodError(err.message);
    }
  };

  const handleSetDefault = async (id) => {
    await api.patch(`/payment-methods/${id}/default`, {}, token);
    loadMethods();
  };

  const handleDelete = async (id) => {
    await api.del(`/payment-methods/${id}`, token);
    loadMethods();
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 w-full text-center text-content-primary">
        <h1 className="text-xl font-bold mb-2">{t.loginRequiredTitle}</h1>
        <p className="text-content-muted text-sm mb-6">{t.loginRequiredDesc}</p>
        <button
          type="button"
          onClick={() => openAuthModal("login")}
          className="px-6 py-3 bg-matcha hover:bg-matcha-hover text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
        >
          {t.loginButton}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full text-content-primary">
      <div className="flex items-center gap-1.5 text-xs text-content-muted mb-4 text-left">
        <Link to="/" className="hover:text-matcha transition-colors">{t.breadcrumbHome}</Link>
        <BiChevronRight size={14} />
        <span className="text-matcha font-medium">{t.breadcrumbPayment}</span>
      </div>

      <div className="text-left mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-content-primary">{t.title}</h1>
        <p className="text-content-muted text-xs sm:text-sm mt-1">{t.subtitle}</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setTab("orders")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
            tab === "orders" ? "bg-matcha text-white" : "bg-white border border-hugme-border text-content-primary hover:border-matcha"
          }`}
        >
          {t.ordersTab}
        </button>
        <button
          type="button"
          onClick={() => setTab("methods")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
            tab === "methods" ? "bg-matcha text-white" : "bg-white border border-hugme-border text-content-primary hover:border-matcha"
          }`}
        >
          {t.methodsTab}
        </button>
      </div>

      {tab === "orders" && (
        <div className="flex flex-col gap-3 text-left">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-hugme-border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-content-primary">#{order.orderNumber}</span>
                  <span className="bg-matcha-soft text-matcha text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">{order.status}</span>
                </div>
                <p className="text-content-muted text-xs">
                  {new Date(order.createdAt).toLocaleDateString(lang === "th" ? "th-TH" : "en-US")} · {order.items.length} {t.orderItemsCount}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-earth-brown text-lg">฿{order.total}</span>
                <Link
                  to={`/order-success?orderId=${order.id}`}
                  className="text-matcha text-xs font-bold hover:underline whitespace-nowrap"
                >
                  {t.viewOrder}
                </Link>
              </div>
            </div>
          ))}

          {orders.length === 0 && <p className="text-content-muted text-sm text-center py-12">{t.noOrders}</p>}
        </div>
      )}

      {tab === "methods" && (
        <div className="bg-white rounded-xl border border-hugme-border p-6 shadow-xs text-left">
          <div className="flex justify-between items-center mb-4">
            <p className="text-content-muted text-[11px]">{t.securityNote}</p>
            {!methodFormOpen && (
              <button
                type="button"
                onClick={() => setMethodFormOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-matcha hover:bg-matcha-hover text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0 ml-3"
              >
                <BiPlus size={16} />
                {t.addMethod}
              </button>
            )}
          </div>

          {methodFormOpen && (
            <form onSubmit={handleMethodSubmit} className="flex flex-col gap-3 mb-5 bg-[#FAF8F5] rounded-xl p-4 border border-hugme-border">
              {methodError && <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3.5 py-2.5">{methodError}</div>}
              <div className="flex gap-2">
                {["card", "promptpay", "bank"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMethodForm({ ...methodForm, type })}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      methodForm.type === type ? "bg-matcha text-white" : "bg-white border border-hugme-border text-content-primary"
                    }`}
                  >
                    {type === "card" ? t.typeCard : type === "promptpay" ? t.typePromptpay : t.typeBank}
                  </button>
                ))}
              </div>
              {methodForm.type === "card" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder={t.cardNumberLabel}
                    value={methodForm.cardNumber}
                    onChange={(e) => setMethodForm({ ...methodForm, cardNumber: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-hugme-border bg-white text-content-primary text-sm focus:outline-none focus:border-matcha"
                  />
                  <input
                    type="text"
                    placeholder={t.expiryLabel}
                    value={methodForm.expiry}
                    onChange={(e) => setMethodForm({ ...methodForm, expiry: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-hugme-border bg-white text-content-primary text-sm focus:outline-none focus:border-matcha"
                  />
                </div>
              )}
              <label className="flex items-center gap-2 text-xs text-content-primary cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={methodForm.isDefault}
                  onChange={(e) => setMethodForm({ ...methodForm, isDefault: e.target.checked })}
                  className="w-3.5 h-3.5 accent-matcha rounded cursor-pointer"
                />
                {t.setAsDefaultCheckbox}
              </label>
              <div className="flex gap-2">
                <button type="submit" className="px-5 py-2 bg-matcha hover:bg-matcha-hover text-white font-bold text-xs rounded-lg transition-colors cursor-pointer">
                  {t.save}
                </button>
                <button
                  type="button"
                  onClick={() => setMethodFormOpen(false)}
                  className="px-5 py-2 border border-hugme-border text-content-primary font-bold text-xs rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          )}

          <div className="flex flex-col gap-3">
            {methods.map((m) => (
              <div key={m.id} className="border border-hugme-border rounded-xl p-4 flex justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <BiCreditCard size={22} className="text-content-muted" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-content-primary">{m.label}</span>
                      {m.isDefault && (
                        <span className="bg-matcha-soft text-matcha text-[10px] font-bold px-2 py-0.5 rounded-md">{t.defaultBadge}</span>
                      )}
                    </div>
                    {m.expiry && <span className="text-content-muted text-xs">{m.expiry}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {!m.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(m.id)}
                      className="flex items-center gap-1 text-[11px] text-matcha hover:underline cursor-pointer"
                    >
                      <BiCheck size={14} />
                      {t.setDefault}
                    </button>
                  )}
                  <button type="button" onClick={() => handleDelete(m.id)} className="text-content-muted hover:text-red-500 cursor-pointer">
                    <BiTrash size={16} />
                  </button>
                </div>
              </div>
            ))}

            {methods.length === 0 && !methodFormOpen && (
              <p className="text-content-muted text-sm text-center py-4">{t.noMethods}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
