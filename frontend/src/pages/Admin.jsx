import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { BiChevronRight, BiPlus, BiEdit, BiTrash } from "react-icons/bi";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../lib/api";
import ProductImage from "../components/ProductImage";

const translations = {
  th: {
    breadcrumbHome: "หน้าแรก (Home)",
    breadcrumbAdmin: "แผงควบคุมแอดมิน",
    title: "แผงควบคุมแอดมิน / Admin Panel",
    subtitle: "จัดการสินค้า คำสั่งซื้อ และรีวิวทั้งหมดของร้าน",
    accessDeniedTitle: "ไม่มีสิทธิ์เข้าถึง",
    accessDeniedDesc: "หน้านี้สำหรับผู้ดูแลระบบเท่านั้น",
    backToHome: "กลับสู่หน้าแรก",
    productsTab: "สินค้า",
    ordersTab: "คำสั่งซื้อ",
    reviewsTab: "รีวิว",
    addProduct: "เพิ่มสินค้าใหม่",
    titleLabel: "ชื่อสินค้า (ไทย)",
    subtitleLabel: "ชื่อสินค้า (อังกฤษ)",
    descriptionLabel: "รายละเอียดสินค้า",
    priceLabel: "ราคา (บาท)",
    categoryLabel: "หมวดหมู่",
    caffeineLabel: "ระดับคาเฟอีน",
    imagePlaceholderLabel: "ข้อความ placeholder (เช่น [ มัทฉะ ])",
    imageUrlLabel: "ลิงก์รูปภาพหลัก (ไม่บังคับ)",
    imagesLabel: "ลิงก์รูปแกลเลอรี (1 รูปต่อบรรทัด, ไม่บังคับ)",
    flavorsLabel: "รสชาติให้เลือก (คั่นด้วยจุลภาค, ไม่บังคับ)",
    save: "บันทึก",
    cancel: "ยกเลิก",
    edit: "แก้ไข",
    delete: "ลบ",
    confirmDelete: "ยืนยันการลบสินค้านี้?",
    noProducts: "ยังไม่มีสินค้า",
    orderNumber: "หมายเลขคำสั่งซื้อ",
    customer: "ลูกค้า",
    total: "ยอดรวม",
    status: "สถานะ",
    statusPaid: "ชำระเงินแล้ว",
    statusShipped: "จัดส่งแล้ว",
    statusDelivered: "ส่งถึงแล้ว",
    statusCancelled: "ยกเลิก",
    noOrders: "ยังไม่มีคำสั่งซื้อ",
    reviewer: "ผู้รีวิว",
    product: "สินค้า",
    rating: "คะแนน",
    comment: "ความเห็น",
    noReviews: "ยังไม่มีรีวิว",
    confirmDeleteReview: "ยืนยันการลบรีวิวนี้?",
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbAdmin: "Admin Panel",
    title: "Admin Panel",
    subtitle: "Manage all products, orders, and reviews for the shop",
    accessDeniedTitle: "Access Denied",
    accessDeniedDesc: "This page is for administrators only",
    backToHome: "Back to Home",
    productsTab: "Products",
    ordersTab: "Orders",
    reviewsTab: "Reviews",
    addProduct: "Add New Product",
    titleLabel: "Title (Thai)",
    subtitleLabel: "Subtitle (English)",
    descriptionLabel: "Description",
    priceLabel: "Price (THB)",
    categoryLabel: "Category",
    caffeineLabel: "Caffeine Level",
    imagePlaceholderLabel: "Placeholder text (e.g. [ Matcha ])",
    imageUrlLabel: "Main image URL (optional)",
    imagesLabel: "Gallery image URLs (one per line, optional)",
    flavorsLabel: "Flavor options (comma-separated, optional)",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    confirmDelete: "Delete this product?",
    noProducts: "No products yet",
    orderNumber: "Order Number",
    customer: "Customer",
    total: "Total",
    status: "Status",
    statusPaid: "Paid",
    statusShipped: "Shipped",
    statusDelivered: "Delivered",
    statusCancelled: "Cancelled",
    noOrders: "No orders yet",
    reviewer: "Reviewer",
    product: "Product",
    rating: "Rating",
    comment: "Comment",
    noReviews: "No reviews yet",
    confirmDeleteReview: "Delete this review?",
  },
};

const ORDER_STATUSES = ["paid", "shipped", "delivered", "cancelled"];

const emptyProductForm = {
  title: "",
  subtitle: "",
  description: "",
  price: "",
  category: "",
  caffeine: "",
  imagePlaceholder: "",
  imageUrl: "",
  images: "",
  flavors: "",
};

export default function Admin() {
  const { isAdmin, token } = useAuth();
  const { lang } = useLanguage();
  const t = translations[lang];

  const [tab, setTab] = useState("products");

  const [products, setProducts] = useState([]);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [productError, setProductError] = useState("");

  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);

  const loadProducts = useCallback(() => {
    if (!token) return;
    api.get("/admin/products", token).then((data) => setProducts(data.products)).catch(() => {});
  }, [token]);

  const loadOrders = useCallback(() => {
    if (!token) return;
    api.get("/admin/orders", token).then((data) => setOrders(data.orders)).catch(() => {});
  }, [token]);

  const loadReviews = useCallback(() => {
    if (!token) return;
    api.get("/admin/reviews", token).then((data) => setReviews(data.reviews)).catch(() => {});
  }, [token]);

  useEffect(() => {
    if (!isAdmin) return;
    loadProducts();
    loadOrders();
    loadReviews();
  }, [isAdmin, loadProducts, loadOrders, loadReviews]);

  const openNewProductForm = () => {
    setEditingProductId(null);
    setProductForm(emptyProductForm);
    setProductError("");
    setProductFormOpen(true);
  };

  const openEditProductForm = (prod) => {
    setEditingProductId(prod.id);
    setProductForm({
      title: prod.title,
      subtitle: prod.subtitle,
      description: prod.description,
      price: String(prod.price),
      category: prod.category,
      caffeine: prod.caffeine || "",
      imagePlaceholder: prod.imagePlaceholder,
      imageUrl: prod.imageUrl || "",
      images: (prod.images || []).join("\n"),
      flavors: (prod.flavors || []).join(", "),
    });
    setProductError("");
    setProductFormOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setProductError("");
    const payload = {
      ...productForm,
      images: productForm.images.split("\n").map((s) => s.trim()).filter(Boolean),
      flavors: productForm.flavors.split(",").map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editingProductId) {
        await api.patch(`/admin/products/${editingProductId}`, payload, token);
      } else {
        await api.post("/admin/products", payload, token);
      }
      setProductFormOpen(false);
      loadProducts();
    } catch (err) {
      setProductError(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm(t.confirmDelete)) return;
    try {
      await api.del(`/admin/products/${id}`, token);
      loadProducts();
    } catch (err) {
      window.alert(err.message);
    }
  };

  const handleOrderStatusChange = async (id, status) => {
    await api.patch(`/admin/orders/${id}/status`, { status }, token);
    loadOrders();
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm(t.confirmDeleteReview)) return;
    await api.del(`/admin/reviews/${id}`, token);
    loadReviews();
  };

  const statusLabel = (status) =>
    ({ paid: t.statusPaid, shipped: t.statusShipped, delivered: t.statusDelivered, cancelled: t.statusCancelled }[status] || status);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 w-full text-center text-content-primary">
        <h1 className="text-xl font-bold mb-2">{t.accessDeniedTitle}</h1>
        <p className="text-content-muted text-sm mb-6">{t.accessDeniedDesc}</p>
        <Link to="/" className="inline-block px-6 py-3 bg-matcha hover:bg-matcha-hover text-white font-bold text-sm rounded-xl transition-colors">
          {t.backToHome}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full text-content-primary">
      <div className="flex items-center gap-1.5 text-xs text-content-muted mb-4 text-left">
        <Link to="/" className="hover:text-matcha transition-colors">{t.breadcrumbHome}</Link>
        <BiChevronRight size={14} />
        <span className="text-matcha font-medium">{t.breadcrumbAdmin}</span>
      </div>

      <div className="text-left mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-content-primary">{t.title}</h1>
        <p className="text-content-muted text-xs sm:text-sm mt-1">{t.subtitle}</p>
      </div>

      <div className="flex gap-2 mb-6">
        {["products", "orders", "reviews"].map((tabKey) => (
          <button
            key={tabKey}
            type="button"
            onClick={() => setTab(tabKey)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              tab === tabKey ? "bg-matcha text-white" : "bg-white border border-hugme-border text-content-primary hover:border-matcha"
            }`}
          >
            {tabKey === "products" ? t.productsTab : tabKey === "orders" ? t.ordersTab : t.reviewsTab}
          </button>
        ))}
      </div>

      {tab === "products" && (
        <div className="bg-white rounded-xl border border-hugme-border p-6 shadow-xs text-left">
          <div className="flex justify-end mb-4">
            {!productFormOpen && (
              <button
                type="button"
                onClick={openNewProductForm}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-matcha hover:bg-matcha-hover text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                <BiPlus size={16} />
                {t.addProduct}
              </button>
            )}
          </div>

          {productFormOpen && (
            <form onSubmit={handleProductSubmit} className="flex flex-col gap-3 mb-6 bg-[#FAF8F5] rounded-xl p-4 border border-hugme-border">
              {productError && <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3.5 py-2.5">{productError}</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input required placeholder={t.titleLabel} value={productForm.title} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} className="px-3.5 py-2 rounded-xl border border-hugme-border bg-white text-sm focus:outline-none focus:border-matcha" />
                <input required placeholder={t.subtitleLabel} value={productForm.subtitle} onChange={(e) => setProductForm({ ...productForm, subtitle: e.target.value })} className="px-3.5 py-2 rounded-xl border border-hugme-border bg-white text-sm focus:outline-none focus:border-matcha" />
              </div>
              <textarea required rows={2} placeholder={t.descriptionLabel} value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="px-3.5 py-2 rounded-xl border border-hugme-border bg-white text-sm focus:outline-none focus:border-matcha resize-none" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input required type="number" min="0" placeholder={t.priceLabel} value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="px-3.5 py-2 rounded-xl border border-hugme-border bg-white text-sm focus:outline-none focus:border-matcha" />
                <input required placeholder={t.categoryLabel} value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="px-3.5 py-2 rounded-xl border border-hugme-border bg-white text-sm focus:outline-none focus:border-matcha" />
                <input placeholder={t.caffeineLabel} value={productForm.caffeine} onChange={(e) => setProductForm({ ...productForm, caffeine: e.target.value })} className="px-3.5 py-2 rounded-xl border border-hugme-border bg-white text-sm focus:outline-none focus:border-matcha" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input required placeholder={t.imagePlaceholderLabel} value={productForm.imagePlaceholder} onChange={(e) => setProductForm({ ...productForm, imagePlaceholder: e.target.value })} className="px-3.5 py-2 rounded-xl border border-hugme-border bg-white text-sm focus:outline-none focus:border-matcha" />
                <input placeholder={t.imageUrlLabel} value={productForm.imageUrl} onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })} className="px-3.5 py-2 rounded-xl border border-hugme-border bg-white text-sm focus:outline-none focus:border-matcha" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <textarea rows={3} placeholder={t.imagesLabel} value={productForm.images} onChange={(e) => setProductForm({ ...productForm, images: e.target.value })} className="px-3.5 py-2 rounded-xl border border-hugme-border bg-white text-sm focus:outline-none focus:border-matcha resize-none" />
                <input placeholder={t.flavorsLabel} value={productForm.flavors} onChange={(e) => setProductForm({ ...productForm, flavors: e.target.value })} className="px-3.5 py-2 rounded-xl border border-hugme-border bg-white text-sm focus:outline-none focus:border-matcha" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-5 py-2 bg-matcha hover:bg-matcha-hover text-white font-bold text-xs rounded-lg transition-colors cursor-pointer">{t.save}</button>
                <button type="button" onClick={() => setProductFormOpen(false)} className="px-5 py-2 border border-hugme-border text-content-primary font-bold text-xs rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">{t.cancel}</button>
              </div>
            </form>
          )}

          <div className="flex flex-col gap-3">
            {products.map((prod) => (
              <div key={prod.id} className="border border-hugme-border rounded-xl p-3 flex items-center gap-3">
                <ProductImage src={prod.imageUrl} alt={prod.title} placeholder={prod.imagePlaceholder} className="w-14 h-14 rounded-lg text-[9px] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-content-primary truncate">{prod.title}</p>
                  <p className="text-content-muted text-xs">{prod.category} · ฿{prod.price}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button type="button" onClick={() => openEditProductForm(prod)} className="text-content-muted hover:text-content-primary cursor-pointer p-1"><BiEdit size={16} /></button>
                  <button type="button" onClick={() => handleDeleteProduct(prod.id)} className="text-content-muted hover:text-red-500 cursor-pointer p-1"><BiTrash size={16} /></button>
                </div>
              </div>
            ))}
            {products.length === 0 && <p className="text-content-muted text-sm text-center py-4">{t.noProducts}</p>}
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="flex flex-col gap-3 text-left">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-hugme-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <p className="font-bold text-sm text-content-primary">#{order.orderNumber}</p>
                <p className="text-content-muted text-xs">{order.user.name} ({order.user.email}) · {order.items.length} {lang === "th" ? "รายการ" : "item(s)"}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-earth-brown text-base">฿{order.total}</span>
                <select
                  value={order.status}
                  onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-hugme-border bg-white text-xs font-bold focus:outline-none focus:border-matcha cursor-pointer"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>{statusLabel(s)}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-content-muted text-sm text-center py-12">{t.noOrders}</p>}
        </div>
      )}

      {tab === "reviews" && (
        <div className="flex flex-col gap-3 text-left">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white rounded-xl border border-hugme-border p-4 flex justify-between items-start gap-3 shadow-xs">
              <div className="min-w-0">
                <p className="font-bold text-sm text-content-primary">{rev.user.name} <span className="font-normal text-content-muted">→ {rev.product.title}</span></p>
                <p className="text-content-muted text-xs mb-1">{"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}</p>
                <p className="text-content-primary text-sm">{rev.comment}</p>
              </div>
              <button type="button" onClick={() => handleDeleteReview(rev.id)} className="text-content-muted hover:text-red-500 cursor-pointer p-1 shrink-0"><BiTrash size={16} /></button>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-content-muted text-sm text-center py-12">{t.noReviews}</p>}
        </div>
      )}
    </div>
  );
}
