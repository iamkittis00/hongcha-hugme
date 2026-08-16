import { Link } from "react-router-dom";
import { BiChevronRight, BiLeaf, BiHeart, BiSun, BiAward } from "react-icons/bi";
import { useLanguage } from "../context/LanguageContext";

const translations = {
  th: {
    breadcrumbHome: "หน้าแรก",
    breadcrumbAbout: "เกี่ยวกับเรา",
    badge: "เกี่ยวกับเรา",
    heroTitle: "โฮงชาฮักมี — มรดกใบชาคุณภาพส่งตรงจากยอดดอย",
    heroDesc:
      "เรื่องราวความผูกพันและคุณค่าของชาไทยออร์แกนิกที่คัดสรรด้วยหัวใจ เรามุ่งมั่นที่จะส่งมอบสุนทรียภาพแห่งการดื่มชาอันละมุน อบอุ่น และคืนความสดชื่นบริสุทธิ์ให้กับคุณในทุกๆ วัน",
    exploreButton: "สำรวจชาของเรา",
    heroImageAlt: "[ ภาพไร่ชาออร์แกนิกบนยอดดอย ]",
    storyTitle: "จุดเริ่มต้นของเรา",
    storyDesc:
      "จากความรักในธรรมชาติและวิถีชาวไร่ชาบนยอดดอยจังหวัดเชียงใหม่ สู่แบรนด์ชาไทยพรีเมียม \"โฮงชาฮักมี\"",
    feature1Title: "ออร์แกนิก 100%",
    feature1Desc:
      "ใบชาออร์แกนิกแท้ 100% ปลูกบนพื้นที่ยอดดอยสูง ปราศจากสารเคมีสังเคราะห์ ชงแล้วให้กลิ่นหอมธรรมชาติบริสุทธิ์",
    feature2Title: "คัดสรรจากที่สูง",
    feature2Desc:
      "คัดสรรเฉพาะยอดใบชาชูคอสามใบแรก จากไร่ชาที่ตั้งอยู่สูงเหนือระดับน้ำทะเล รับหมอกเช้าสดชื่นและแสงแดดอบอุ่น",
    feature3Title: "การค้าที่เป็นธรรมโดยตรง",
    feature3Desc:
      "ส่งเสริมและสนับสนุนรายได้ให้เกษตรกรท้องถิ่นโดยตรง เพื่อการเติบโตอย่างยั่งยืนของชุมชนและสิ่งแวดล้อม",
    stat1Label: "ปีแห่งความเชี่ยวชาญ",
    stat2Label: "แก้วความสุขที่ส่งมอบ",
    stat3Label: "คัดมือด้วยความใส่ใจ",
    stat4Label: "คะแนนพึงพอใจจากลูกค้า",
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbAbout: "About Us",
    badge: "ABOUT HUGME",
    heroTitle: "HongCha HugMe — Premium Tea Heritage, Straight From the Mountain Peaks",
    heroDesc:
      "A story of devotion and value in organic Thai tea, hand-picked with heart. We are committed to delivering a gentle, warm tea experience and pure refreshment to you every day.",
    exploreButton: "Explore Tea",
    heroImageAlt: "[ Organic Tea Plantation ]",
    storyTitle: "Our Story",
    storyDesc:
      "From a love of nature and the way of life of tea farmers on the mountain peaks of Chiang Mai, comes the premium Thai tea brand \"HongCha HugMe\".",
    feature1Title: "100% Organic",
    feature1Desc:
      "100% genuine organic tea leaves grown on high mountain peaks, free from synthetic chemicals, brewed to release a pure, natural aroma.",
    feature2Title: "High Altitude Selection",
    feature2Desc:
      "We hand-pick only the first three young leaves and bud from tea gardens high above sea level, kissed by fresh morning mist and warm sunlight.",
    feature3Title: "Direct Fair Trade",
    feature3Desc:
      "We promote and support local farmers' income directly, fostering sustainable growth for the community and the environment.",
    stat1Label: "Years of Expertise",
    stat2Label: "Cups of Happiness Delivered",
    stat3Label: "Hand-Picked with Care",
    stat4Label: "Customer Satisfaction Rating",
  },
};

export default function About() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full text-content-primary">
      <div className="flex items-center gap-1.5 text-xs text-content-muted mb-4 text-left">
        <Link to="/" className="hover:text-matcha transition-colors">{t.breadcrumbHome}</Link>
        <BiChevronRight size={14} />
        <span className="text-matcha font-medium">{t.breadcrumbAbout}</span>
      </div>

      <section className="w-full bg-hugme-section rounded-2xl border border-hugme-border p-8 sm:p-12 mb-12 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-start gap-4">
            <span className="bg-[#E4ECD9] text-matcha font-bold text-xs px-3 py-1.5 rounded-md uppercase tracking-wider">
              {t.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-content-primary leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-content-muted text-xs sm:text-sm leading-relaxed">
              {t.heroDesc}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-matcha hover:bg-matcha-hover text-white font-bold px-6 py-3 rounded-xl transition-colors text-xs sm:text-sm cursor-pointer mt-2"
            >
              <span>{t.exploreButton}</span>
            </Link>
          </div>

          <div className="w-full h-64 sm:h-80 bg-hugme-image rounded-xl border border-hugme-border flex items-center justify-center text-content-muted text-xs sm:text-sm font-medium p-6 relative overflow-hidden">
            <div className="absolute inset-0 border border-content-muted/20 rotate-45 transform scale-150 pointer-events-none"></div>
            <span>{t.heroImageAlt}</span>
          </div>
        </div>
      </section>

      <section className="w-full mb-12 text-left">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-content-primary">{t.storyTitle}</h2>
          <p className="text-content-muted text-xs sm:text-sm mt-2">
            {t.storyDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-hugme-border p-6 flex flex-col items-center text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-matcha-soft flex justify-center items-center text-matcha mb-4">
              <BiLeaf size={24} />
            </div>
            <h3 className="font-bold text-base text-content-primary mb-2">{t.feature1Title}</h3>
            <p className="text-content-muted text-xs leading-relaxed">
              {t.feature1Desc}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-hugme-border p-6 flex flex-col items-center text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-matcha-soft flex justify-center items-center text-matcha mb-4">
              <BiSun size={24} />
            </div>
            <h3 className="font-bold text-base text-content-primary mb-2">{t.feature2Title}</h3>
            <p className="text-content-muted text-xs leading-relaxed">
              {t.feature2Desc}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-hugme-border p-6 flex flex-col items-center text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-matcha-soft flex justify-center items-center text-matcha mb-4">
              <BiHeart size={24} />
            </div>
            <h3 className="font-bold text-base text-content-primary mb-2">{t.feature3Title}</h3>
            <p className="text-content-muted text-xs leading-relaxed">
              {t.feature3Desc}
            </p>
          </div>
        </div>
      </section>

      <section className="w-full bg-white rounded-2xl border border-hugme-border p-8 text-center mb-8 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-hugme-border">
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-bold text-matcha mb-1">10+</span>
            <span className="text-content-muted text-xs">{t.stat1Label}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-bold text-earth-brown mb-1">50k+</span>
            <span className="text-content-muted text-xs">{t.stat2Label}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-bold text-matcha mb-1">100%</span>
            <span className="text-content-muted text-xs">{t.stat3Label}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-bold text-earth-brown mb-1">4.9/5</span>
            <span className="text-content-muted text-xs">{t.stat4Label}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
