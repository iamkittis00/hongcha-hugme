const translations = {
  th: {
    breadcrumbHome: "หน้าแรก (Home)",
    breadcrumbReviews: "รีวิวจากลูกค้า (Reviews)",
    title: "รีวิวจากลูกค้าทั้งหมด / Customer Reviews",
    subtitle: "ความประทับใจจริงจากผู้ดื่มชาโฮงชาฮักมีทั่วประเทศ",
    loading: "กำลังโหลดรีวิว...",
    allFilter: "ทั้งหมด",
    starsLabel: "ดาว",
    ratingSummary: (count) => `คะแนนเฉลี่ยจากการรีวิวทั้งหมด (${count} รีวิว)`,
    noReviews: "ยังไม่มีรีวิวในหมวดหมู่นี้",
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbReviews: "Reviews",
    title: "Customer Reviews",
    subtitle: "Real impressions from Hongcha Hugmee tea drinkers nationwide",
    loading: "Loading reviews...",
    allFilter: "All",
    starsLabel: "stars",
    ratingSummary: (count) => `Average rating from all reviews (${count} reviews)`,
    noReviews: "No reviews in this category yet",
  },
};

export default translations;
