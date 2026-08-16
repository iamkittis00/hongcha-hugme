import { BiLeaf } from "react-icons/bi";
import { FiX } from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";

const translations = {
  th: { tagline: "CHARIN TEA SHOP" },
  en: { tagline: "CHARIN TEA SHOP" },
};

export default function AuthCard({ isOpen = true, isModal = false, onClose, title, subtitle, children }) {
  const { lang } = useLanguage();
  const t = translations[lang];

  if (!isOpen) return null;

  const containerStyle = isModal
    ? "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5 sm:p-4 overflow-y-auto"
    : "min-h-screen w-full flex items-center justify-center bg-hugme-bg text-content-primary p-3 sm:p-4 overflow-y-auto";

  return (
    <div className={containerStyle}>
      <div className="relative bg-white rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-[420px] flex flex-col items-center p-5 sm:p-7 text-center shadow-lg border border-hugme-border my-auto">
        {isModal && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-content-muted hover:text-content-primary p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <FiX size={20} />
          </button>
        )}

        <div className="w-12 h-12 rounded-full bg-matcha-soft flex justify-center items-center mb-2">
          <BiLeaf className="text-matcha text-xl" />
        </div>
        <h2 className="text-content-primary text-lg font-bold tracking-wide">โฮงชาฮักมี</h2>
        <span className="text-content-muted text-[10px] tracking-widest font-semibold uppercase">{t.tagline}</span>

        <h1 className="text-content-primary text-xl sm:text-2xl font-bold mt-3">{title}</h1>
        {subtitle && <p className="text-content-muted text-xs sm:text-sm mt-0.5">{subtitle}</p>}

        <div className="w-full mt-3">
          {children}
        </div>
      </div>
    </div>
  );
}
