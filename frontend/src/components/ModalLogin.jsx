import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import AuthCard from "./AuthCard";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const translations = {
  th: {
    title: "เข้าสู่ระบบ",
    subtitle: "ยินดีต้อนรับกลับสู่ช่วงเวลาแห่งความผ่อนคลาย",
    email: "อีเมล",
    emailPlaceholder: "example@email.com",
    password: "รหัสผ่าน",
    passwordPlaceholder: "ระบุรหัสผ่านของคุณ",
    rememberMe: "จดจำฉันไว้",
    forgotPassword: "ลืมรหัสผ่าน?",
    loggingIn: "กำลังเข้าสู่ระบบ...",
    login: "เข้าสู่ระบบ",
    or: "หรือ",
    google: "Google",
    facebook: "Facebook",
    demoDisclaimer: "* โหมดทดลองสำหรับ demo — ยังไม่ได้เชื่อมต่อ Google/Facebook จริง",
    noAccount: "ยังไม่มีบัญชี? ",
    signUp: "สมัครสมาชิก",
  },
  en: {
    title: "Log In",
    subtitle: "Welcome back to your moment of relaxation",
    email: "Email",
    emailPlaceholder: "example@email.com",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    loggingIn: "Logging in...",
    login: "Log In",
    or: "or",
    google: "Google",
    facebook: "Facebook",
    demoDisclaimer: "* Demo mode — not connected to real Google/Facebook.",
    noAccount: "Don't have an account? ",
    signUp: "Sign Up",
  },
};

export default function ModalLogin({ isOpen = true, isModal = false, onClose, onSwitchToRegister, onSwitchToForgot, onSuccess }) {
  const { login, loginWithProvider } = useAuth();
  const { lang } = useLanguage();
  const t = translations[lang];
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      (onSuccess || onClose)?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

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
            {t.email}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            className="w-full px-3.5 py-2.5 rounded-xl border border-hugme-border bg-[#F9F8F6] text-content-primary text-xs sm:text-sm focus:outline-none focus:border-matcha focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-content-primary font-bold text-xs sm:text-sm mb-1">
            {t.password}
          </label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <div className="flex items-center justify-between text-xs sm:text-sm mt-0.5">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 accent-matcha rounded cursor-pointer"
            />
            <span className="text-content-primary text-xs sm:text-sm font-medium">{t.rememberMe}</span>
          </label>
          <button
            type="button"
            onClick={onSwitchToForgot}
            className="text-matcha text-xs sm:text-sm font-semibold hover:underline cursor-pointer"
          >
            {t.forgotPassword}
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-matcha hover:bg-matcha-hover text-white font-bold rounded-xl shadow-xs transition-colors mt-1 text-xs sm:text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? t.loggingIn : t.login}
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
          <span>{socialLoading === "google" ? t.loggingIn : t.google}</span>
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin("facebook")}
          disabled={!!socialLoading}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 border border-hugme-border rounded-xl text-xs sm:text-sm font-semibold text-content-primary hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60"
        >
          <FaFacebook size={18} className="text-[#1877F2]" />
          <span>{socialLoading === "facebook" ? t.loggingIn : t.facebook}</span>
        </button>
      </div>
      <p className="text-content-muted text-[10px] mt-2 text-center">
        {t.demoDisclaimer}
      </p>

      <div className="mt-5 text-xs sm:text-sm">
        <span className="text-content-muted">{t.noAccount}</span>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-matcha font-bold hover:underline cursor-pointer"
        >
          {t.signUp}
        </button>
      </div>
    </AuthCard>
  );
}