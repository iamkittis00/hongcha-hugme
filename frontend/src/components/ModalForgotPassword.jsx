import AuthCard from "./AuthCard";
import { useLanguage } from "../context/LanguageContext";

const translations = {
  th: {
    title: "ลืมรหัสผ่าน",
    subtitle: "กรอกอีเมลของคุณเพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่",
    emailLabel: "อีเมลของคุณ",
    submit: "ส่งลิงก์รีเซ็ตรหัสผ่าน",
    backToLogin: "← กลับไปหน้าเข้าสู่ระบบ",
  },
  en: {
    title: "Forgot Password",
    subtitle: "Enter your email to receive a password reset link",
    emailLabel: "Your Email",
    submit: "Send Reset Link",
    backToLogin: "← Back to Login",
  },
};

export default function ModalForgotPassword({ isOpen = true, isModal = false, onClose, onSwitchToLogin }) {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <AuthCard
      isOpen={isOpen}
      isModal={isModal}
      onClose={onClose}
      title={t.title}
      subtitle={t.subtitle}
    >
      <form className="w-full text-left flex flex-col gap-3">
        <div>
          <label className="block text-content-primary font-bold text-xs sm:text-sm mb-1">
            {t.emailLabel}
          </label>
          <input
            type="email"
            placeholder="example@email.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-hugme-border bg-[#F9F8F6] text-content-primary text-xs sm:text-sm focus:outline-none focus:border-matcha focus:bg-white transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-matcha hover:bg-matcha-hover text-white font-bold rounded-xl shadow-xs transition-colors mt-1 text-xs sm:text-sm cursor-pointer"
        >
          {t.submit}
        </button>
      </form>

      <div className="mt-5 text-xs sm:text-sm">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-matcha font-bold hover:underline cursor-pointer"
        >
          {t.backToLogin}
        </button>
      </div>
    </AuthCard>
  );
}
