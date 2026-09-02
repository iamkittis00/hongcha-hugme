import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BiLeaf, BiSearch, BiShoppingBag, BiX, BiMenu } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import AccountDropdown from "./AccountDropdown";
import translations from "../i18n/navbar";

export default function Navbar() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { count: cartCount } = useCart();
  const { lang } = useLanguage();
  const t = translations[lang];
  const location = useLocation();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <header className="w-full bg-white border-b border-hugme-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-lg text-content-primary hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <BiMenu size={24} />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full bg-matcha-soft flex justify-center items-center">
              <BiLeaf className="text-matcha text-xl" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-content-primary text-lg font-bold leading-tight">โฮงชาฮักมี</span>
              <span className="text-content-muted text-[9px] tracking-widest font-semibold uppercase">{t.tagline}</span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {t.navLinks.map((link) => {
            const isActive =
              link.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(link.path);

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center transition-colors ${
                  isActive
                    ? "text-matcha font-bold"
                    : "text-content-primary hover:text-matcha font-normal"
                }`}
              >
                <span>{link.thai}</span>
                {link.eng && (
                  <span className={`text-[10px] ${isActive ? "text-matcha/80" : "text-content-muted"}`}>
                    {link.eng}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-4">
          {searchOpen ? (
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-1">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => !searchQuery && setSearchOpen(false)}
                placeholder={t.searchPlaceholder}
                className="w-28 sm:w-48 px-3 py-1.5 rounded-full border border-hugme-border text-xs sm:text-sm focus:outline-none focus:border-matcha"
              />
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="p-2 rounded-full hover:bg-gray-100 text-content-muted transition-colors cursor-pointer"
              >
                <BiX size={18} />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 text-content-primary transition-colors cursor-pointer"
            >
              <BiSearch size={20} />
            </button>
          )}

          <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 text-content-primary transition-colors">
            <BiShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-earth-brown text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <AccountDropdown />
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="flex items-center gap-2 bg-matcha hover:bg-matcha-hover text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <FiUser size={16} />
              <span>{t.account}</span>
            </button>
          )}
        </div>
      </div>

      <div
        className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${
          mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ease-in-out ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        <div
          className={`relative w-[280px] bg-white h-full shadow-2xl p-5 flex flex-col justify-between z-50 text-left transition-transform duration-300 ease-in-out transform ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-hugme-border mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-matcha-soft flex justify-center items-center">
                  <BiLeaf className="text-matcha text-lg" />
                </div>
                <span className="font-bold text-base text-content-primary">โฮงชาฮักมี</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-content-muted transition-colors cursor-pointer"
              >
                <BiX size={22} />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              {t.navLinks.map((link) => {
                const isActive =
                  link.path === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(link.path);

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                      isActive
                        ? "bg-matcha text-white"
                        : "text-content-primary hover:bg-gray-100"
                    }`}
                  >
                    <span>{link.thai}</span>
                    {link.eng && (
                      <span className={`text-xs ${isActive ? "text-white/80" : "text-content-muted"}`}>
                        {link.eng}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
