import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { BiChevronRight } from "react-icons/bi";
import { api } from "../lib/api";
import StarRating from "../components/StarRating";
import { useLanguage } from "../context/LanguageContext";
import translations from "../i18n/reviews";

export default function Reviews() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [selectedFilter, setSelectedFilter] = useState("ทั้งหมด");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/reviews")
      .then((data) => setReviews(data.reviews))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filterOptions = useMemo(
    () => ["ทั้งหมด", ...new Set(reviews.map((r) => r.product.category))],
    [reviews]
  );

  const filteredReviews =
    selectedFilter === "ทั้งหมด" ? reviews : reviews.filter((r) => r.product.category === selectedFilter);

  const ratingCounts = useMemo(() => {
    const count = reviews.length;
    return [5, 4, 3, 2, 1].map((stars) => {
      const starCount = reviews.filter((r) => r.rating === stars).length;
      return { stars, count: starCount, percentage: count ? (starCount / count) * 100 : 0 };
    });
  }, [reviews]);

  const average = reviews.length
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full text-content-primary">
      <div className="flex items-center gap-1.5 text-xs text-content-muted mb-4 text-left">
        <Link to="/" className="hover:text-matcha transition-colors">{t.breadcrumbHome}</Link>
        <BiChevronRight size={14} />
        <span className="text-matcha font-medium">{t.breadcrumbReviews}</span>
      </div>

      <div className="text-left mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-content-primary">
          {t.title}
        </h1>
        <p className="text-content-muted text-xs sm:text-sm mt-1">
          {t.subtitle}
        </p>
      </div>

      {loading && <div className="text-center text-content-muted text-sm py-12">{t.loading}</div>}
      {error && !loading && <div className="text-center text-red-600 text-sm py-12">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-10 text-left">
          <div className="bg-hugme-section rounded-xl border border-hugme-border p-6 flex flex-col items-center text-center">
            <span className="text-4xl sm:text-5xl font-bold text-content-primary mb-2">{average || "-"}</span>
            <StarRating rating={average} size={20} className="mb-1" />
            <span className="text-content-muted text-xs mb-6">{t.ratingSummary(reviews.length)}</span>

            <div className="w-full flex flex-col gap-2.5 text-xs text-content-muted">
              {ratingCounts.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <span className="w-8 font-medium text-right">{item.stars} {t.starsLabel}</span>
                  <div className="flex-1 h-2.5 bg-hugme-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-matcha rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="w-8 font-medium text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelectedFilter(opt)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedFilter === opt
                      ? "bg-matcha text-white"
                      : "bg-white text-content-primary border border-hugme-border hover:border-matcha"
                  }`}
                >
                  {opt === "ทั้งหมด" ? t.allFilter : opt}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReviews.map((rev) => (
                <div key={rev.id} className="bg-white rounded-xl border border-hugme-border p-5 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2.5">
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

                    <Link
                      to={`/product/${rev.product.id}`}
                      className="inline-block bg-[#F4EFE6] text-earth-brown text-[11px] font-bold px-2.5 py-0.5 rounded-md mb-2 hover:underline"
                    >
                      {rev.product.title}
                    </Link>

                    <p className="text-content-primary text-xs leading-relaxed">{rev.comment}</p>
                  </div>
                </div>
              ))}

              {filteredReviews.length === 0 && (
                <div className="md:col-span-2 text-center text-content-muted text-sm py-12">
                  {t.noReviews}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
