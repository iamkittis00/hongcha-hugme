import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { BiShoppingBag, BiRightArrowAlt, BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { api } from "../lib/api";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import StarRating from "../components/StarRating";
import ProductImage from "../components/ProductImage";
import heroBanner from "../assets/hero-banner.webp";
import translations from "../i18n/home";

const AUTO_SCROLL_MS = 3200;

export default function Home() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [addedId, setAddedId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);

  const categories = [
    { title: "ถุงซิป", subtitle: "Zip Bag", image: "/products/thungzip-4.webp" },
    { title: "กระปุกแก้ว", subtitle: "Glass Jar", image: "/products/kapukkaew-4.webp" },
    { title: "กระปุกพลาสติก", subtitle: "Plastic Jar", image: "/products/kapukplastic-4.webp" },
    { title: "ขายส่ง/กิโล", subtitle: "Wholesale (kg)", image: "/products/khaisong-1.webp" },
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
    addItem(product, 1, product.flavors?.[0] || null);
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

          <div className="w-full h-64 sm:h-80 rounded-xl border border-hugme-border overflow-hidden">
            <img
              src={heroBanner}
              alt={t.heroImagePlaceholder}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-content-primary">{t.categoriesTitle}</h2>
        <p className="text-content-muted text-xs sm:text-sm mt-1 mb-6">{t.categoriesSubtitle}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/products?category=${encodeURIComponent(cat.title)}`}
              className="bg-white rounded-xl border border-hugme-border p-4 flex flex-col items-center shadow-xs hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="w-full h-36 rounded-lg overflow-hidden mb-3">
                <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-base text-content-primary group-hover:text-matcha transition-colors">{cat.title}</h3>
              <span className="text-content-muted text-xs">{cat.subtitle}</span>
            </Link>
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
                    <ProductImage
                      src={prod.imageUrl}
                      alt={prod.title}
                      placeholder={prod.imagePlaceholder}
                      className="w-full h-44 rounded-lg mb-3"
                    />
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
