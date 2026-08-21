import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BiShoppingBag, BiChevronRight, BiChevronLeft, BiSearch, BiX } from "react-icons/bi";
import { api } from "../lib/api";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import StarRating from "../components/StarRating";
import ProductImage from "../components/ProductImage";
import CustomSelect from "../components/CustomSelect";

const PAGE_SIZE = 6;

const translations = {
  th: {
    breadcrumbHome: "หน้าแรก (Home)",
    breadcrumbCurrent: "สินค้าทั้งหมด",
    heading: "สินค้าทั้งหมด",
    searchPlaceholder: "ค้นหาชา เช่น มัทฉะ, อู่หลง...",
    searchResultsFor: "ผลการค้นหาสำหรับ",
    searchResultsFound: (count) => `พบ ${count} รายการ`,
    sortLabel: "เรียงตาม:",
    sortLowHigh: "ราคาต่ำ - สูง (Price: Low - High)",
    sortHighLow: "ราคาสูง - ต่ำ (Price: High - Low)",
    filtersTitle: "ตัวกรองสินค้า",
    clearAll: "ล้างทั้งหมด",
    categoriesTitle: "หมวดหมู่ชา",
    priceRangeTitle: "ช่วงราคา",
    caffeineTitle: "ระดับคาเฟอีน",
    loading: "กำลังโหลดสินค้า...",
    addedToCart: "เพิ่มแล้ว!",
    addToCart: "เพิ่มลงตะกร้า",
    noProductsFound: "ไม่พบสินค้าที่ตรงกับตัวกรองที่เลือก",
    previousPage: "หน้าก่อนหน้า",
    nextPage: "หน้าถัดไป",
    pageNumber: (n) => `หน้า ${n}`,
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbCurrent: "All Products",
    heading: "All Products",
    searchPlaceholder: "Search tea, e.g. matcha, oolong...",
    searchResultsFor: "Search results for",
    searchResultsFound: (count) => `${count} items found`,
    sortLabel: "Sort:",
    sortLowHigh: "Price: Low - High",
    sortHighLow: "Price: High - Low",
    filtersTitle: "Filters",
    clearAll: "Clear All",
    categoriesTitle: "Categories",
    priceRangeTitle: "Price Range",
    caffeineTitle: "Caffeine",
    loading: "Loading products...",
    addedToCart: "Added!",
    addToCart: "Add to Cart",
    noProductsFound: "No products match the selected filters",
    previousPage: "Previous page",
    nextPage: "Next page",
    pageNumber: (n) => `Page ${n}`,
  },
};

export default function Products() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const { addItem } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [caffeine, setCaffeine] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState("low-high");
  const [currentPage, setCurrentPage] = useState(1);
  const [addedId, setAddedId] = useState(null);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const categoryQuery = searchParams.get("category") || "";

  useEffect(() => {
    setSearchInput(searchQuery);
    if (categoryQuery) {
      setSelectedCategories([categoryQuery]);
    }
    setCurrentPage(1);
  }, [searchQuery, categoryQuery]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setCurrentPage(1);
    setSearchParams(value.trim() ? { search: value.trim() } : {}, { replace: true });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchParams({});
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get("/products")
      .then((data) => {
        if (!cancelled) setProducts(data.products);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products]
  );
  const caffeineOptions = useMemo(
    () => [...new Set(products.map((p) => p.caffeine).filter(Boolean))],
    [products]
  );

  const handleCategoryToggle = (cat) => {
    setCurrentPage(1);
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleMinPriceChange = (e) => {
    setCurrentPage(1);
    setMinPrice(Math.min(Number(e.target.value), maxPrice - 50));
  };

  const handleMaxPriceChange = (e) => {
    setCurrentPage(1);
    setMaxPrice(Math.max(Number(e.target.value), minPrice + 50));
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
    setCaffeine("");
    setMinPrice(0);
    setMaxPrice(1000);
    setCurrentPage(1);
  };

  const handleAddToCart = (product) => {
    addItem(product, 1, "100g");
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const filteredProducts = products
    .filter((prod) => prod.price >= minPrice && prod.price <= maxPrice)
    .filter((prod) => selectedCategories.length === 0 || selectedCategories.includes(prod.category))
    .filter((prod) => !caffeine || prod.caffeine === caffeine)
    .filter((prod) => {
      if (!searchInput.trim()) return true;
      const q = searchInput.trim().toLowerCase();
      return (
        prod.title.toLowerCase().includes(q) ||
        prod.subtitle.toLowerCase().includes(q) ||
        prod.category.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => (sortBy === "high-low" ? b.price - a.price : a.price - b.price));

  const totalPages = Math.max(Math.ceil(filteredProducts.length / PAGE_SIZE), 1);
  const pagedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full text-content-primary">
      <div className="flex items-center gap-1.5 text-xs text-content-muted mb-4 text-left">
        <Link to="/" className="hover:text-matcha transition-colors">{t.breadcrumbHome}</Link>
        <BiChevronRight size={14} />
        <span className="text-matcha font-medium">{t.breadcrumbCurrent}</span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-content-primary">{t.heading}</h1>
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <BiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-8 py-2 rounded-lg border border-hugme-border bg-white text-content-primary text-xs sm:text-sm focus:outline-none focus:border-matcha"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary cursor-pointer"
              >
                <BiX size={16} />
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        {searchInput.trim() && (
          <p className="text-content-muted text-xs sm:text-sm">
            {t.searchResultsFor} "<span className="font-bold text-content-primary">{searchInput.trim()}</span>" {t.searchResultsFound(filteredProducts.length)}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs sm:text-sm ml-auto">
          <label className="text-content-muted whitespace-nowrap">{t.sortLabel}</label>
          <CustomSelect
            value={sortBy}
            onChange={(val) => setSortBy(val)}
            options={[
              { value: "low-high", label: t.sortLowHigh },
              { value: "high-low", label: t.sortHighLow },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <aside className="bg-hugme-section rounded-xl border border-hugme-border p-5 text-left flex flex-col gap-6">
          <div className="flex justify-between items-center pb-3 border-b border-hugme-border">
            <h2 className="font-bold text-base text-content-primary">{t.filtersTitle}</h2>
            <button type="button" onClick={handleClearAll} className="text-xs text-content-muted hover:text-matcha underline cursor-pointer">
              {t.clearAll}
            </button>
          </div>

          <div>
            <h3 className="font-bold text-xs sm:text-sm text-content-primary mb-3">{t.categoriesTitle}</h3>
            <div className="flex flex-col gap-2.5">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-2 text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryToggle(cat)}
                    className="w-3.5 h-3.5 accent-matcha rounded cursor-pointer"
                  />
                  <span className={selectedCategories.includes(cat) ? "font-bold text-content-primary" : "text-content-muted"}>
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xs sm:text-sm text-content-primary mb-2">{t.priceRangeTitle}</h3>
            <div className="relative w-full py-4 flex items-center">
              <div className="absolute w-full h-2 bg-hugme-border rounded-lg"></div>
              <div
                className="absolute h-2 bg-matcha rounded-lg"
                style={{
                  left: `${(minPrice / 1000) * 100}%`,
                  right: `${100 - (maxPrice / 1000) * 100}%`,
                }}
              ></div>

              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={minPrice}
                onChange={handleMinPriceChange}
                className="absolute w-full appearance-none bg-transparent pointer-events-none focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-matcha [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-matcha cursor-pointer z-10"
              />
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={maxPrice}
                onChange={handleMaxPriceChange}
                className="absolute w-full appearance-none bg-transparent pointer-events-none focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-matcha [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-matcha cursor-pointer z-20"
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-content-muted font-medium mt-1">
              <span>฿0</span>
              <span className="bg-[#E4ECD9] text-matcha font-bold px-2.5 py-0.5 rounded-md text-xs">
                ฿{minPrice} - ฿{maxPrice}
              </span>
              <span>฿1,000</span>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xs sm:text-sm text-content-primary mb-3">{t.caffeineTitle}</h3>
            <div className="flex flex-col gap-2.5">
              {caffeineOptions.map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-xs cursor-pointer select-none">
                  <input
                    type="radio"
                    name="caffeine"
                    checked={caffeine === opt}
                    onChange={() => {
                      setCurrentPage(1);
                      setCaffeine(caffeine === opt ? "" : opt);
                    }}
                    className="w-3.5 h-3.5 accent-matcha cursor-pointer"
                  />
                  <span className={caffeine === opt ? "font-bold text-content-primary" : "text-content-muted"}>
                    {opt}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <main className="lg:col-span-3 flex flex-col gap-8">
          {loading && (
            <div className="text-center text-content-muted text-sm py-12">{t.loading}</div>
          )}

          {error && !loading && (
            <div className="text-center text-red-600 text-sm py-12">{error}</div>
          )}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
                {pagedProducts.map((prod) => (
                  <div key={prod.id} className="bg-white rounded-xl border border-hugme-border p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
                    <Link to={`/product/${prod.id}`}>
                      <ProductImage
                        src={prod.imageUrl}
                        alt={prod.title}
                        placeholder={prod.imagePlaceholder}
                        className="w-full h-44 rounded-lg mb-3"
                      />
                      <h3 className="font-bold text-sm sm:text-base text-content-primary">{prod.title}</h3>
                      <span className="text-content-muted text-xs block mb-2">{prod.subtitle}</span>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-earth-brown font-bold text-base sm:text-lg">฿{prod.price}</span>
                        <StarRating rating={prod.avgRating} size={13} />
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(prod)}
                      className="w-full py-2.5 bg-matcha hover:bg-matcha-hover text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <BiShoppingBag size={15} />
                      <span>{addedId === prod.id ? t.addedToCart : t.addToCart}</span>
                    </button>
                  </div>
                ))}

                {pagedProducts.length === 0 && (
                  <div className="col-span-full text-center text-content-muted text-sm py-12">
                    {t.noProductsFound}
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 text-xs font-semibold">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    aria-label={t.previousPage}
                    className="w-8 h-8 rounded-lg border border-hugme-border bg-white flex items-center justify-center text-content-muted hover:border-matcha hover:text-matcha transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <BiChevronLeft size={18} />
                  </button>
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentPage(idx + 1)}
                      aria-label={t.pageNumber(idx + 1)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                        currentPage === idx + 1 ? "bg-matcha text-white" : "border border-hugme-border bg-white text-content-primary hover:border-matcha"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    aria-label={t.nextPage}
                    className="w-8 h-8 rounded-lg border border-hugme-border bg-white flex items-center justify-center text-content-muted hover:border-matcha hover:text-matcha transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <BiChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
