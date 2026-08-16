import { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { BiShoppingBag, BiChevronRight, BiPlus, BiMinus } from "react-icons/bi";
import { FiStar } from "react-icons/fi";
import { api } from "../lib/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import StarRating from "../components/StarRating";

const packageSizes = ["50g", "100g", "200g"];

const translations = {
  th: {
    loadingProduct: "กำลังโหลดสินค้า...",
    productNotFound: "ไม่พบสินค้านี้",
    breadcrumbHome: "หน้าแรก (Home)",
    packageSizeLabel: "ขนาดบรรจุภัณฑ์ / Package Size",
    quantityLabel: "จำนวน / Quantity",
    addToCart: "เพิ่มลงตะกร้า / Add to Cart",
    buyNow: "ซื้อทันที / Buy Now",
    addedToCart: "เพิ่มลงตะกร้าแล้ว! / Added to cart",
    tabDescription: "รายละเอียดสินค้า / Description",
    tabBrewing: "วิธีชง / Brewing Guide",
    tabReviews: "รีวิวจากลูกค้า / Reviews",
    noRatingYet: "ยังไม่มีคะแนน",
    reviewsUnit: "รีวิว",
    starsUnit: "ดาว",
    avgRatingFromReviews: "คะแนนเฉลี่ยจากการรีวิว",
    writeReviewHeading: "เขียนรีวิวสินค้านี้ / Write a Review",
    reviewCommentRequired: "กรุณาเขียนความคิดเห็นก่อนส่งรีวิว",
    reviewRatingRequired: "กรุณาเลือกจำนวนดาวก่อนส่งรีวิว",
    reviewPlaceholderAuth: "แชร์ความคิดเห็นของคุณเกี่ยวกับสินค้านี้...",
    reviewPlaceholderGuest: "กรุณาเข้าสู่ระบบก่อนเขียนรีวิว",
    submitReview: "ส่งรีวิว / Submit",
    sendingReview: "กำลังส่ง...",
    loginToReview: "เข้าสู่ระบบเพื่อรีวิว",
    customerFeedbackHeading: "รีวิวล่าสุดจากลูกค้า / Customer Feedback",
    noReviewsYet: "ยังไม่มีรีวิวสำหรับสินค้านี้ เป็นคนแรกที่รีวิวเลย!",
    descTabHeading: "รายละเอียดสินค้าแบบเจาะลึก",
    brewingHeading: "คำแนะนำในการชง (Brewing Guide)",
    brewingStep1: "ตักใบชา 1-2 ช้อนชา ต่อน้ำร้อน 200 ml",
    brewingStep2: "แช่ทิ้งไว้ 3-5 นาทีตามความเข้มข้นที่ต้องการ",
    brewingStep3: "กรองกากชาออก เสิร์ฟร้อนหรือใส่น้ำแข็งตามชอบ",
  },
  en: {
    loadingProduct: "Loading product...",
    productNotFound: "Product not found",
    breadcrumbHome: "Home",
    packageSizeLabel: "Package Size",
    quantityLabel: "Quantity",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    addedToCart: "Added to cart",
    tabDescription: "Description",
    tabBrewing: "Brewing Guide",
    tabReviews: "Reviews",
    noRatingYet: "No rating yet",
    reviewsUnit: "reviews",
    starsUnit: "stars",
    avgRatingFromReviews: "Average rating from reviews",
    writeReviewHeading: "Write a Review",
    reviewCommentRequired: "Please write a comment before submitting your review",
    reviewRatingRequired: "Please select a star rating before submitting",
    reviewPlaceholderAuth: "Share your thoughts about this product...",
    reviewPlaceholderGuest: "Please log in before writing a review",
    submitReview: "Submit",
    sendingReview: "Sending...",
    loginToReview: "Log in to review",
    customerFeedbackHeading: "Customer Feedback",
    noReviewsYet: "No reviews yet for this product. Be the first to review it!",
    descTabHeading: "In-depth Product Details",
    brewingHeading: "Brewing Guide",
    brewingStep1: "Use 1-2 teaspoons of tea leaves per 200 ml of hot water",
    brewingStep2: "Steep for 3-5 minutes depending on desired strength",
    brewingStep3: "Strain the leaves and serve hot or over ice as preferred",
  },
};

export default function ProductDetail() {
  const { id } = useParams();
  const productId = Number(id) || 1;
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { lang } = useLanguage();
  const t = translations[lang];

  const [selectedSize, setSelectedSize] = useState("100g");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");
  const [addedMessage, setAddedMessage] = useState("");

  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState({ average: 0, count: 0, breakdown: [] });
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const loadProduct = useCallback(() => {
    setLoading(true);
    setError("");
    Promise.all([api.get(`/products/${productId}`), api.get(`/products/${productId}/reviews`)])
      .then(([detail, reviewData]) => {
        setProduct(detail.product);
        setRating(reviewData.rating);
        setReviews(reviewData.reviews);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    loadProduct();
    setSelectedSize("100g");
    setQuantity(1);
  }, [loadProduct]);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize);
    setAddedMessage(t.addedToCart);
    setTimeout(() => setAddedMessage(""), 1800);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, selectedSize);
    navigate("/checkout");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }
    setReviewError("");
    if (reviewForm.rating === 0) {
      setReviewError(t.reviewRatingRequired);
      return;
    }
    if (!reviewForm.comment.trim()) {
      setReviewError(t.reviewCommentRequired);
      return;
    }
    setReviewSubmitting(true);
    try {
      await api.post(
        "/reviews",
        { productId, rating: reviewForm.rating, comment: reviewForm.comment },
        localStorage.getItem("hongcha_token")
      );
      setReviewForm({ rating: 0, comment: "" });
      loadProduct();
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center text-content-muted text-sm">{t.loadingProduct}</div>;
  }

  if (error || !product) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center text-red-600 text-sm">{error || t.productNotFound}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full text-content-primary">
      <div className="flex items-center gap-1.5 text-xs text-content-muted mb-6 text-left flex-wrap">
        <Link to="/" className="hover:text-matcha transition-colors">{t.breadcrumbHome}</Link>
        <BiChevronRight size={14} />
        <Link to="/products" className="hover:text-matcha transition-colors">{product.category}</Link>
        <BiChevronRight size={14} />
        <span className="text-matcha font-medium">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
        <div className="flex flex-col gap-4">
          <div className="w-full h-80 sm:h-96 bg-hugme-image rounded-xl border border-hugme-border flex items-center justify-center text-content-muted text-xs sm:text-sm font-medium p-4 relative overflow-hidden">
            <div className="absolute inset-0 border border-content-muted/20 rotate-45 transform scale-150 pointer-events-none"></div>
            <span>{product.imagePlaceholder}</span>
          </div>
        </div>

        <div className="flex flex-col text-left justify-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-content-primary">{product.title}</h1>
            <p className="text-content-muted text-xs sm:text-sm mt-0.5">{product.subtitle}</p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <StarRating rating={rating.average} size={14} />
            <span className="font-bold text-content-primary">{rating.average || t.noRatingYet} / 5.0</span>
            <span className="text-content-muted">|</span>
            <span className="text-content-muted">{rating.count} {t.reviewsUnit}</span>
          </div>

          <div className="border-t border-b border-hugme-border py-4 flex items-center gap-3 flex-wrap">
            <span className="text-earth-brown font-bold text-2xl sm:text-3xl">฿{product.price}</span>
          </div>

          <p className="text-content-muted text-xs sm:text-sm leading-relaxed">{product.description}</p>

          <div>
            <label className="block text-content-primary font-bold text-xs sm:text-sm mb-2">
              {t.packageSizeLabel}
            </label>
            <div className="flex gap-3">
              {packageSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`px-5 py-2 rounded-lg border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    selectedSize === size
                      ? "bg-matcha text-white border-matcha"
                      : "bg-white text-content-primary border-hugme-border hover:border-matcha"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-content-primary font-bold text-xs sm:text-sm mb-2">
              {t.quantityLabel}
            </label>
            <div className="inline-flex items-center border border-hugme-border bg-white rounded-lg">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                className="px-3 py-2 text-content-muted hover:text-content-primary transition-colors cursor-pointer"
              >
                <BiMinus size={16} />
              </button>
              <span className="px-4 text-sm font-bold text-content-primary">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2 text-content-muted hover:text-content-primary transition-colors cursor-pointer"
              >
                <BiPlus size={16} />
              </button>
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 py-3 bg-matcha hover:bg-matcha-hover text-white font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <BiShoppingBag size={18} />
              <span>{t.addToCart}</span>
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 py-3 bg-earth-brown hover:bg-[#68432F] text-white font-bold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer"
            >
              {t.buyNow}
            </button>
          </div>

          {addedMessage && (
            <span className="text-matcha font-bold text-xs">{addedMessage}</span>
          )}
        </div>
      </div>

      <div className="w-full border-b border-hugme-border mb-8 flex gap-6 text-xs sm:text-sm font-bold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("desc")}
          className={`pb-3 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "desc" ? "text-matcha border-b-2 border-matcha" : "text-content-muted hover:text-content-primary"
          }`}
        >
          {t.tabDescription}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("brewing")}
          className={`pb-3 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "brewing" ? "text-matcha border-b-2 border-matcha" : "text-content-muted hover:text-content-primary"
          }`}
        >
          {t.tabBrewing}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={`pb-3 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "reviews" ? "text-matcha border-b-2 border-matcha" : "text-content-muted hover:text-content-primary"
          }`}
        >
          {t.tabReviews}
        </button>
      </div>

      {activeTab === "reviews" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start text-left mb-12">
          <div className="bg-hugme-section rounded-xl border border-hugme-border p-6 flex flex-col items-center text-center">
            <span className="text-4xl sm:text-5xl font-bold text-content-primary mb-2">{rating.average || "-"}</span>
            <StarRating rating={rating.average} size={18} className="mb-1" />
            <span className="text-content-muted text-xs mb-6">{t.avgRatingFromReviews} ({rating.count} {t.reviewsUnit})</span>

            <div className="w-full flex flex-col gap-2.5 text-xs text-content-muted">
              {rating.breakdown.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <span className="w-8 font-medium text-right">{item.stars} {t.starsUnit}</span>
                  <div className="flex-1 h-2.5 bg-hugme-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-matcha rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="w-6 font-medium text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-xl border border-hugme-border p-4 sm:p-5">
              <h3 className="font-bold text-sm sm:text-base text-content-primary mb-3">{t.writeReviewHeading}</h3>
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3">
                {reviewError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2">
                    {reviewError}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm((f) => ({ ...f, rating: star }))}
                      className="cursor-pointer text-earth-gold"
                    >
                      <FiStar size={20} fill={star <= reviewForm.rating ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
                <textarea
                  rows={3}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                  placeholder={isAuthenticated ? t.reviewPlaceholderAuth : t.reviewPlaceholderGuest}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-hugme-border bg-[#F9F8F6] text-content-primary text-xs sm:text-sm focus:outline-none focus:border-matcha focus:bg-white transition-colors resize-none"
                />
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="self-start px-5 py-2.5 bg-matcha hover:bg-matcha-hover text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isAuthenticated ? (reviewSubmitting ? t.sendingReview : t.submitReview) : t.loginToReview}
                </button>
              </form>
            </div>

            <h3 className="font-bold text-base text-content-primary">
              {t.customerFeedbackHeading}
            </h3>

            <div className="flex flex-col gap-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white rounded-xl border border-hugme-border p-4 sm:p-5 flex flex-col gap-3 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-matcha text-white font-bold text-xs flex items-center justify-center">
                        {rev.user.name.slice(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-content-primary">{rev.user.name}</span>
                        <span className="text-content-muted text-[11px]">
                          {new Date(rev.createdAt).toLocaleDateString(lang === "th" ? "th-TH" : "en-US")}
                        </span>
                      </div>
                    </div>
                    <StarRating rating={rev.rating} size={14} />
                  </div>

                  <p className="text-content-primary text-xs sm:text-sm leading-relaxed">{rev.comment}</p>
                </div>
              ))}

              {reviews.length === 0 && (
                <p className="text-content-muted text-xs sm:text-sm">{t.noReviewsYet}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "desc" && (
        <div className="bg-white rounded-xl border border-hugme-border p-6 text-left text-sm leading-relaxed mb-12">
          <h3 className="font-bold text-base mb-2">{t.descTabHeading}</h3>
          <p className="text-content-muted">{product.description}</p>
        </div>
      )}

      {activeTab === "brewing" && (
        <div className="bg-white rounded-xl border border-hugme-border p-6 text-left text-sm leading-relaxed mb-12">
          <h3 className="font-bold text-base mb-2">{t.brewingHeading}</h3>
          <ul className="list-disc list-inside text-content-muted flex flex-col gap-1">
            <li>{t.brewingStep1}</li>
            <li>{t.brewingStep2}</li>
            <li>{t.brewingStep3}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
