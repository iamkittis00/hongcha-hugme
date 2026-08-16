import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import AuthCard from "./AuthCard";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const translations = {
  th: {
    title: "สมัครสมาชิก",
    subtitle: "เริ่มต้นช่วงเวลาแห่งความผ่อนคลายกับโฮงชาฮักมี",
    termsError: "กรุณายอมรับเงื่อนไขการใช้งานก่อนสมัครสมาชิก",
    passwordMismatch: "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน",
    nameLabel: "ชื่อ-นามสกุล",
    namePlaceholder: "กรอกชื่อและนามสกุลของคุณ",
    emailLabel: "อีเมล",
    emailPlaceholder: "example@email.com",
    phoneLabel: "เบอร์โทรศัพท์",
    phonePlaceholder: "08X-XXX-XXXX",
    passwordLabel: "รหัสผ่าน",
    passwordPlaceholder: "กำหนดรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)",
    confirmPasswordLabel: "ยืนยันรหัสผ่าน",
    confirmPasswordPlaceholder: "กรอกรหัสผ่านอีกครั้งเพื่อยืนยัน",
    termsAccept: "ยอมรับ",
    termsOfService: "เงื่อนไขการใช้งาน",
    and: "และ",
    privacyPolicy: "นโยบายความเป็นส่วนตัว",
    submitting: "กำลังสมัครสมาชิก...",
    submit: "สมัครสมาชิก",
    or: "หรือ",
    socialLoading: "กำลังเข้าสู่ระบบ...",
    google: "Google",
    facebook: "Facebook",
    demoDisclaimer: "* โหมดทดลองสำหรับ demo — ยังไม่ได้เชื่อมต่อ Google/Facebook จริง",
    haveAccount: "มีบัญชีอยู่แล้ว? ",
    login: "เข้าสู่ระบบ",
  },
  en: {
    title: "Sign Up",
    subtitle: "Begin your moment of relaxation with HongCha Hugme",
    termsError: "Please accept the Terms of Service before signing up",
    passwordMismatch: "Password and confirmation password do not match",
    nameLabel: "Full Name",
    namePlaceholder: "Enter your first and last name",
    emailLabel: "Email",
    emailPlaceholder: "example@email.com",
    phoneLabel: "Phone Number",
    phonePlaceholder: "08X-XXX-XXXX",
    passwordLabel: "Password",
    passwordPlaceholder: "Create a password (at least 6 characters)",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Re-enter your password to confirm",
    termsAccept: "I accept the",
    termsOfService: "Terms of Service",
    and: "and",
    privacyPolicy: "Privacy Policy",
    submitting: "Signing up...",
    submit: "Sign Up",
    or: "or",
    socialLoading: "Signing in...",
    google: "Google",
    facebook: "Facebook",
    demoDisclaimer: "* Demo mode — not yet connected to real Google/Facebook",
    haveAccount: "Already have an account? ",
    login: "Log In",
  },
};

export default function ModalRegister({ isOpen = true, isModal = false, onClose, onSwitchToLogin, onSuccess }) {
  const { register, loginWithProvider } = useAuth();
  const { lang } = useLanguage();
  const t = translations[lang];
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  const handleSocialLogin = async (provider) => {
    setError("");
    setSocialLoading(provider);
    try {
      await loginWithProvider(provider);
      (onSuccess || onClose)?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSocialLoading("");
    }
  };

  const updateField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!acceptTerms) {
      setError(t.termsError);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    setSubmitting(true);
    try {
      await register(form);
      (onSuccess || onClose)?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      isOpen={isOpen}
      isModal={isModal}
      onClose={onClose}
      title={t.title}
      subtitle={t.subtitle}
    >
      <form onSubmit={handleSubmit} className="w-full text-left flex flex-col gap-3">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm rounded-lg px-3.5 py-2.5">
            {error}
          </div>
        )}

        <div>
          <label className="block text-content-primary font-bold text-xs sm:text-sm mb-1">
            {t.nameLabel}
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={updateField("name")}
            placeholder={t.namePlaceholder}
            className="w-full px-3.5 py-2.5 rounded-xl border border-hugme-border bg-[#F9F8F6] text-content-primary text-xs sm:text-sm focus:outline-none focus:border-matcha focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-content-primary font-bold text-xs sm:text-sm mb-1">
            {t.emailLabel}
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={updateField("email")}
            placeholder={t.emailPlaceholder}
            className="w-full px-3.5 py-2.5 rounded-xl border border-hugme-border bg-[#F9F8F6] text-content-primary text-xs sm:text-sm focus:outline-none focus:border-matcha focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-content-primary font-bold text-xs sm:text-sm mb-1">
            {t.phoneLabel}
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={updateField("phone")}
            placeholder={t.phonePlaceholder}
            className="w-full px-3.5 py-2.5 rounded-xl border border-hugme-border bg-[#F9F8F6] text-content-primary text-xs sm:text-sm focus:outline-none focus:border-matcha focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-content-primary font-bold text-xs sm:text-sm mb-1">
            {t.passwordLabel}
          </label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={form.password}
              onChange={updateField("password")}
              placeholder={t.passwordPlaceholder}
              className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-hugme-border bg-[#F9F8F6] text-content-primary text-xs sm:text-sm focus:outline-none focus:border-matcha focus:bg-white transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-content-muted hover:text-content-primary cursor-pointer"
            >
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-content-primary font-bold text-xs sm:text-sm mb-1">
            {t.confirmPasswordLabel}
          </label>
          <div className="relative flex items-center">
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              value={form.confirmPassword}
              onChange={updateField("confirmPassword")}
              placeholder={t.confirmPasswordPlaceholder}
              className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-hugme-border bg-[#F9F8F6] text-content-primary text-xs sm:text-sm focus:outline-none focus:border-matcha focus:bg-white transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 text-content-muted hover:text-content-primary cursor-pointer"
            >
              {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-0.5 select-none">
          <input
            type="checkbox"
            id="terms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="w-3.5 h-3.5 accent-matcha rounded cursor-pointer"
          />
          <label htmlFor="terms" className="text-content-primary text-xs sm:text-sm cursor-pointer">
            {t.termsAccept} <a href="#" className="text-matcha underline">{t.termsOfService}</a> {t.and} <a href="#" className="text-matcha underline">{t.privacyPolicy}</a>
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-matcha hover:bg-matcha-hover text-white font-bold rounded-xl shadow-xs transition-colors mt-1 text-xs sm:text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? t.submitting : t.submit}
        </button>
      </form>

      <div className="w-full flex items-center my-3.5">
        <div className="flex-1 border-t border-hugme-border"></div>
        <span className="px-2.5 text-content-muted text-xs sm:text-sm">{t.or}</span>
        <div className="flex-1 border-t border-hugme-border"></div>
      </div>

      <div className="w-full grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => handleSocialLogin("google")}
          disabled={!!socialLoading}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 border border-hugme-border rounded-xl text-xs sm:text-sm font-semibold text-content-primary hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60"
        >
          <FcGoogle size={18} />
          <span>{socialLoading === "google" ? t.socialLoading : t.google}</span>
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin("facebook")}
          disabled={!!socialLoading}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 border border-hugme-border rounded-xl text-xs sm:text-sm font-semibold text-content-primary hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60"
        >
          <FaFacebook size={18} className="text-[#1877F2]" />
          <span>{socialLoading === "facebook" ? t.socialLoading : t.facebook}</span>
        </button>
      </div>
      <p className="text-content-muted text-[10px] mt-2 text-center">
        {t.demoDisclaimer}
      </p>

      <div className="mt-5 text-xs sm:text-sm">
        <span className="text-content-muted">{t.haveAccount}</span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-matcha font-bold hover:underline cursor-pointer"
        >
          {t.login}
        </button>
      </div>
    </AuthCard>
  );
}
