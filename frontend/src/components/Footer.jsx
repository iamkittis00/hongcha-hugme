import { BiLeaf } from "react-icons/bi";
import { FaFacebookF, FaInstagram, FaTwitter, FaLine } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import translations from "../i18n/footer";

export default function Footer() {
  const { lang } = useLanguage();
  const t = translations[lang];
  return (
    <footer className="w-full bg-hugme-section border-t border-hugme-border mt-16 text-content-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-left text-xs sm:text-sm">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-matcha-soft flex justify-center items-center">
              <BiLeaf className="text-matcha text-lg" />
            </div>
            <div className="flex flex-col">
              <span className="text-content-primary font-bold leading-tight">{t.brandName}</span>
              <span className="text-content-muted text-[8px] tracking-widest font-semibold uppercase">{t.tagline}</span>
            </div>
          </div>
          <p className="text-content-muted leading-relaxed text-xs">
            {t.description}
          </p>
        </div>

        <div>
          <h3 className="font-bold text-content-primary text-sm mb-3">{t.contactHeading}</h3>
          <ul className="flex flex-col gap-2 text-content-muted text-xs">
            <li>{t.address}</li>
            <li>{t.phone}</li>
            <li>{t.email}</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-content-primary text-sm mb-3">{t.policiesHeading}</h3>
          <ul className="flex flex-col gap-2 text-content-muted text-xs">
            <li><a href="#" className="hover:text-matcha underline">{t.shippingPolicy}</a></li>
            <li><a href="#" className="hover:text-matcha underline">{t.refundPolicy}</a></li>
            <li><a href="#" className="hover:text-matcha underline">{t.faqs}</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-content-primary text-sm mb-3">{t.socialHeading}</h3>
          <div className="flex gap-2">
            <a href="#" className="w-8 h-8 rounded-full bg-white border border-hugme-border flex items-center justify-center text-content-primary hover:text-matcha hover:border-matcha transition-colors">
              <FaFacebookF size={14} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white border border-hugme-border flex items-center justify-center text-content-primary hover:text-matcha hover:border-matcha transition-colors">
              <FaInstagram size={14} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white border border-hugme-border flex items-center justify-center text-content-primary hover:text-matcha hover:border-matcha transition-colors">
              <FaTwitter size={14} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white border border-hugme-border flex items-center justify-center text-content-primary hover:text-matcha hover:border-matcha transition-colors">
              <FaLine size={14} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-hugme-border max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-content-muted text-[11px] gap-2">
        <span>{t.copyright}</span>
        <span>{t.wireframeNote}</span>
      </div>
    </footer>
  );
}
