import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiCreditCard, FiGlobe, FiLogOut, FiChevronDown } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const translations = {
  th: {
    account: "บัญชีของฉัน",
    payment: "การชำระเงิน",
    language: "ภาษา",
    logout: "ออกจากระบบ",
  },
  en: {
    account: "My Account",
    payment: "Payment",
    language: "Language",
    logout: "Log Out",
  },
};

export default function AccountDropdown() {
  const { user, logout } = useAuth();
  const { lang, setLang } = useLanguage();
  const t = translations[lang];
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-white border border-hugme-border hover:bg-gray-50 text-content-primary text-xs sm:text-sm font-medium px-3.5 py-2 rounded-lg transition-colors cursor-pointer select-none"
      >
        <FiUser size={15} className="text-matcha" />
        <span className="hidden sm:inline max-w-[120px] truncate">{user?.name || t.account}</span>
        <FiChevronDown size={14} className={`text-content-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-hugme-border shadow-md py-2 z-50 text-left text-xs sm:text-sm">
          <Link
            to="/account"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-content-primary hover:bg-gray-50 transition-colors"
          >
            <FiUser size={16} className="text-content-muted" />
            <span>{t.account}</span>
          </Link>

          <Link
            to="/checkout"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-content-primary hover:bg-gray-50 transition-colors"
          >
            <FiCreditCard size={16} className="text-content-muted" />
            <span>{t.payment}</span>
          </Link>

          <div className="px-4 py-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 text-content-primary">
              <FiGlobe size={16} className="text-content-muted" />
              <span>{t.language}</span>
            </div>

            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setLang("th")}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  lang === "th"
                    ? "bg-matcha text-white"
                    : "bg-gray-100 text-content-muted hover:bg-gray-200"
                }`}
              >
                ไทย
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  lang === "en"
                    ? "bg-matcha text-white"
                    : "bg-gray-100 text-content-muted hover:bg-gray-200"
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="border-t border-hugme-border mt-1 pt-1">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors cursor-pointer font-medium"
            >
              <FiLogOut size={16} />
              <span>{t.logout}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
