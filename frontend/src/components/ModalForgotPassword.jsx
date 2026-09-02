import { useState } from "react";
import AuthCard from "./AuthCard";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../lib/api";

const translations = {
  th: {
    title: "ลืมรหัสผ่าน",
    subtitle: "กรอกอีเมลของคุณเพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่",
    emailLabel: "อีเมลของคุณ",
    submit: "ส่งลิงก์รีเซ็ตรหัสผ่าน",
    sending: "กำลังส่ง...",
    backToLogin: "← กลับไปหน้าเข้าสู่ระบบ",
    demoNote: "โหมดทดลอง: ปกติจะส่งลิงก์นี้ไปที่อีเมลของคุณ แต่ตอนนี้ขอแสดงให้กดตรงนี้ได้เลย",
    resetLinkLabel: "ลิงก์รีเซ็ตรหัสผ่านของคุณ",
    sentGeneric: "ถ้าอีเมลนี้มีบัญชีอยู่ในระบบ เราได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปให้แล้ว กรุณาตรวจสอบกล่องจดหมายของคุณ",
  },
  en: {
    title: "Forgot Password",
    subtitle: "Enter your email to receive a password reset link",
    emailLabel: "Your Email",
    submit: "Send Reset Link",
    sending: "Sending...",
    backToLogin: "← Back to Login",
    demoNote: "Demo mode: normally this link would be emailed to you — here it is directly instead",
    resetLinkLabel: "Your password reset link",
    sentGeneric: "If an account exists for this email, we've sent a password reset link. Please check your inbox.",
  },
};

export default function ModalForgotPassword({ isOpen = true, isModal = false, onClose, onSwitchToLogin }) {
  const { lang } = useLanguage();
  const t = translations[lang];

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [blockedMessage, setBlockedMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBlockedMessage("");
    setSubmitting(true);
    try {
      const data = await api.post("/auth/forgot-password", { email });
      if (data.blocked || !data.resetToken) {
        setBlockedMessage(data.message || t.sentGeneric);
      } else {
        setResetToken(data.resetToken);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetLink = resetToken ? `${window.location.origin}/reset-password?token=${resetToken}` : "";

  return (
    <AuthCard
      isOpen={isOpen}
      isModal={isModal}
      onClose={onClose}
      title={t.title}
      subtitle={t.subtitle}
    >
      {blockedMessage ? (
        <div className="w-full text-left flex flex-col gap-3">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-amber-800">
            {blockedMessage}
          </div>
        </div>
      ) : resetToken ? (
        <div className="w-full text-left flex flex-col gap-3">
          <div className="bg-matcha-soft/30 border border-matcha/30 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-content-primary">
            <p className="text-content-muted text-[11px] mb-2">{t.demoNote}</p>
            <p className="font-bold text-xs mb-1">{t.resetLinkLabel}</p>
            <a
              href={resetLink}
              onClick={onClose}
              className="text-matcha font-bold underline break-all text-xs"
            >
              {resetLink}
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full text-left flex flex-col gap-3">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm rounded-lg px-3.5 py-2.5">
              {error}
            </div>
          )}
          <div>
            <label className="block text-content-primary font-bold text-xs sm:text-sm mb-1">
              {t.emailLabel}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-hugme-border bg-[#F9F8F6] text-content-primary text-xs sm:text-sm focus:outline-none focus:border-matcha focus:bg-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-matcha hover:bg-matcha-hover text-white font-bold rounded-xl shadow-xs transition-colors mt-1 text-xs sm:text-sm cursor-pointer disabled:opacity-60"
          >
            {submitting ? t.sending : t.submit}
          </button>
        </form>
      )}

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
