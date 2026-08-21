import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiChevronRight } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const translations = {
  th: {
    account: "บัญชีของฉัน",
    payment: "การชำระเงิน",
    admin: "แผงควบคุมแอดมิน",
    language: "ภาษา",
    logout: "ออกจากระบบ",
    thai: "ไทย",
    english: "อังกฤษ",
  },
  en: {
    account: "My Account",
    payment: "Payment",
    admin: "Admin Panel",
    language: "Language",
    logout: "Log Out",
    thai: "Thai",
    english: "English",
  },
};

export default function AccountDropdown() {
  const { user, logout, isAdmin } = useAuth();
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const [open, setOpen] = useState(false);
  const [showLangSubmenu, setShowLangSubmenu] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setShowLangSubmenu(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setShowLangSubmenu(false);
      }
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
        onClick={() => {
          setOpen((o) => !o);
          setShowLangSubmenu(false);
        }}
        className="w-10 h-10 rounded-full bg-white border border-hugme-border hover:bg-gray-50 flex items-center justify-center text-content-primary transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
      >
        <FiUser size={20} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-hugme-border shadow-lg p-3 z-50 text-left text-sm animate-dropdown-pop">
          <div className="flex items-center gap-3 pb-2.5 mb-2 border-b border-hugme-border px-1">
            <FiUser size={22} className="text-content-primary shrink-0" />
            <span className="font-semibold text-content-primary truncate">
              {user?.name || t.account}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <Link
              to="/account"
              onClick={() => {
                setOpen(false);
                setShowLangSubmenu(false);
              }}
              className="px-2 py-1.5 rounded-lg text-content-primary hover:bg-gray-100 transition-colors duration-150"
            >
              {t.account}
            </Link>

            <Link
              to="/payment"
              onClick={() => {
                setOpen(false);
                setShowLangSubmenu(false);
              }}
              className="px-2 py-1.5 rounded-lg text-content-primary hover:bg-gray-100 transition-colors duration-150"
            >
              {t.payment}
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => {
                  setOpen(false);
                  setShowLangSubmenu(false);
                }}
                className="px-2 py-1.5 rounded-lg text-content-primary hover:bg-gray-100 transition-colors duration-150"
              >
                {t.admin}
              </Link>
            )}

            <div
              className="relative group"
              onMouseEnter={() => setShowLangSubmenu(true)}
              onMouseLeave={() => setShowLangSubmenu(false)}
            >
              <button
                type="button"
                onClick={() => setShowLangSubmenu((s) => !s)}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-content-primary transition-colors duration-150 cursor-pointer ${
                  showLangSubmenu ? "bg-gray-100 font-semibold" : "hover:bg-gray-100"
                }`}
              >
                <span>{t.language}</span>
                <FiChevronRight size={16} className={`text-content-primary transition-transform duration-200 ${showLangSubmenu ? "translate-x-1" : "group-hover:translate-x-1"}`} />
              </button>

              {showLangSubmenu && (
                <div className="absolute left-full top-0 -ml-2 pl-3 z-50 animate-submenu-slide">
                  <div className="w-32 bg-white rounded-2xl border border-hugme-border shadow-lg p-2 flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setLang("th");
                        setShowLangSubmenu(false);
                        setOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors duration-150 cursor-pointer ${
                        lang === "th"
                          ? "font-bold text-matcha bg-matcha-soft/30"
                          : "text-content-primary hover:bg-gray-100"
                      }`}
                    >
                      {t.thai}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLang("en");
                        setShowLangSubmenu(false);
                        setOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors duration-150 cursor-pointer ${
                        lang === "en"
                          ? "font-bold text-matcha bg-matcha-soft/30"
                          : "text-content-primary hover:bg-gray-100"
                      }`}
                    >
                      {t.english}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setShowLangSubmenu(false);
                logout();
              }}
              className="w-full text-left px-2 py-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors duration-150 cursor-pointer font-medium"
            >
              {t.logout}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
