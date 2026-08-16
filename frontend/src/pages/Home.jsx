import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { BiShoppingBag, BiRightArrowAlt, BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { api } from "../lib/api";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import StarRating from "../components/StarRating";

const AUTO_SCROLL_MS = 3200;

const translations = {
  th: {
    badge: "พรีเมียม คัดสรรด้วยมือ",
    heroTitle: "ชาคุณภาพจากยอดดอย",
    heroDesc: "คัดเฉพาะยอดใบชาที่ดีที่สุด ชงสดใหม่เพื่อสัมผัสอายธรรมชาติอันละมุน อบอุ่นในทุกแก้ว",
    shopNow: "เลือกซื้อชา",
    heroImagePlaceholder: "[ พื้นที่แบนเนอร์โปรโมทชาคุณภาพ ]",
    categoriesTitle: "หมวดหมู่ชา",
    categoriesSubtitle: "เลือกชาชนิดที่ใช่สำหรับช่วงเวลาที่ดีที่สุดของคุณ",
    featuredTitle: "สินค้าแนะนำ",
    featuredSubtitle: "ชาขายดีที่ลูกค้าประทับใจเป็นอันดับต้นๆ ของเรา",
    viewAll: "ดูทั้งหมด",
    addedToCart: "เพิ่มแล้ว!",
    addToCart: "หยิบใส่ตะกร้า",
    prevAriaLabel: "เลื่อนไปก่อนหน้า",
    nextAriaLabel: "เลื่อนไปถัดไป",
  },
  en: {
    badge: "PREMIUM & HAND-PICKED",
    heroTitle: "Premium Tea from the Mountain Peaks",
    heroDesc: "Best-selected whole leaves from high-altitude tea plantations.",
    shopNow: "Shop Now",
    heroImagePlaceholder: "[ Hero Promotional Image ]",
    categoriesTitle: "Categories",
    categoriesSubtitle: "Choose the right tea for your best moments.",
    featuredTitle: "Featured Products",
    featuredSubtitle: "Our best-selling teas loved by customers.",
    viewAll: "View All",
    addedToCart: "Added!",
    addToCart: "Add to Cart",
    prevAriaLabel: "Previous",
    nextAriaLabel: "Next",
  },
};

export default function Home() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [addedId, setAddedId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);

  const categories = [
    { title: "ชากุหลาบ", subtitle: "Green Tea", placeholder: "[ รูปหมวดหมู่ ชากุหลาบ ]" },
    { title: "ชาเก๊กฮวย", subtitle: "Black Tea", placeholder: "[ รูปหมวดหมู่ ชาเก๊กฮวย ]" },
    { title: "ชาอัญชัน", subtitle: "Herbal Tea", placeholder: "[ รูปหมวดหมู่ ชาอัญชัน ]" },
    { title: "ชาดาวเรือง", subtitle: "Milk Tea", placeholder: "[ รูปหมวดหมู่ ชาดาวเรือง ]" },
  ];

  useEffect(() => {
    api
      .get("/products")
      .then((data) => setProducts(data.products))
      .catch(() => setProducts([]));
  }, []);

  const scrollByOneCard = useCallback((direction = 1) => {
    const el = scrollRef.current;
    if (!el || !el.firstElementChild) return;
    const cardWidth = el.firstElementChild.getBoundingClientRect().width + 24;

    if (direction > 0 && el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: cardWidth * direction, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (isPaused || products.length === 0) return;
    const interval = setInterval(() => scrollByOneCard(1), AUTO_SCROLL_MS);
    return () => clearInterval(interval);
  }, [isPaused, products, scrollByOneCard]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, "100g");
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <div className="w-full flex flex-col gap-12 text-content-primary">
      <section className="w-full bg-hugme-section py-12 px-4 sm:px-8 border-b border-hugme-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col text-left items-start gap-4">
            <span className="bg-[#E4ECD9] text-matcha font-bold text-xs px-3 py-1.5 rounded-md uppercase tracking-wider">
              {t.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-content-primary leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-content-muted text-sm sm:text-base leading-relaxed max-w-xl">
              {t.heroDesc}
            </p>
            <Link
              to="/products"
              className="mt-2 inline-flex items-center gap-2 bg-matcha hover:bg-matcha-hover text-white font-bold px-6 py-3 rounded-lg shadow-sm transition-colors text-sm cursor-pointer"
            >
              <span>{t.shopNow}</span>
            </Link>
          </div>

          <div className="w-full h-64 sm:h-80 bg-hugme-image rounded-xl border border-hugme-border flex items-center justify-center text-content-muted text-xs sm:text-sm font-medium p-6 relative overflow-hidden">
            <div className="absolute inset-0 border border-content-muted/20 rotate-45 transform scale-150 pointer-events-none"></div>
            <span>{t.heroImagePlaceholder}</span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-content-primary">{t.categoriesTitle}</h2>
        <p className="text-content-muted text-xs sm:text-sm mt-1 mb-6">{t.categoriesSubtitle}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-hugme-border p-4 flex flex-col items-center shadow-xs hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-full h-36 bg-hugme-image rounded-lg flex items-center justify-center text-content-muted text-xs font-medium mb-3">
                {cat.placeholder}
              </div>
              <h3 className="font-bold text-base text-content-primary">{cat.title}</h3>
              <span className="text-content-muted text-xs">{cat.subtitle}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full text-left mb-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-content-primary">{t.featuredTitle}</h2>
            <p className="text-content-muted text-xs sm:text-sm mt-1">{t.featuredSubtitle}</p>
          </div>
          <Link to="/products" className="text-matcha font-bold text-xs sm:text-sm flex items-center gap-1 hover:underline shrink-0">
            <span>{t.viewAll}</span>
            <BiRightArrowAlt size={18} />
          </Link>
        </div>

        {products.length > 0 && (
          <div
            className="relative group sm:px-11"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-xl border border-hugme-border p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow shrink-0 w-[70%] xs:w-[45%] sm:w-[31%] lg:w-[23%] snap-start"
                >
                  <Link to={`/product/${prod.id}`}>
                    <div className="w-full h-44 bg-hugme-image rounded-lg flex items-center justify-center text-content-muted text-xs font-medium mb-3">
                      {prod.imagePlaceholder}
                    </div>
                    <h3 className="font-bold text-base text-content-primary">{prod.title}</h3>
                    <span className="text-content-muted text-xs block mb-2">{prod.subtitle}</span>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-earth-brown font-bold text-lg">฿{prod.price}</span>
                      <StarRating rating={prod.avgRating} size={14} />
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(e, prod)}
                    className="w-full py-2.5 bg-matcha hover:bg-matcha-hover text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <BiShoppingBag size={16} />
                    <span>{addedId === prod.id ? t.addedToCart : t.addToCart}</span>
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollByOneCard(-1)}
              aria-label={t.prevAriaLabel}
              className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-hugme-border shadow-md items-center justify-center text-content-primary opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <BiChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => scrollByOneCard(1)}
              aria-label={t.nextAriaLabel}
              className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-hugme-border shadow-md items-center justify-center text-content-primary opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <BiChevronRight size={20} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
