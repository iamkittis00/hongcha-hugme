import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiCheck } from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../lib/api";

const translations = {
  th: {
    title: "ตั้งรหัสผ่านใหม่",
    subtitle: "กรอกรหัสผ่านใหม่ที่ต้องการใช้เข้าสู่ระบบ",
    invalidTitle: "ลิงก์ไม่ถูกต้อง",
    invalidDesc: "ลิงก์รีเซ็ตรหัสผ่านนี้ไม่ถูกต้องหรือหมดอายุแล้ว กรุณาขอลิงก์ใหม่",
    backToHome: "กลับสู่หน้าแรก",
    newPasswordLabel: "รหัสผ่านใหม่",
    confirmPasswordLabel: "ยืนยันรหัสผ่านใหม่",
    submit: "ตั้งรหัสผ่านใหม่",
    submitting: "กำลังบันทึก...",
    mismatch: "รหัสผ่านและการยืนยันไม่ตรงกัน",
    successTitle: "ตั้งรหัสผ่านใหม่สำเร็จ!",
    successDesc: "คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว",
    goToLogin: "ไปหน้าเข้าสู่ระบบ",
  },
  en: {
    title: "Set a New Password",
    subtitle: "Enter the new password you'd like to use",
    invalidTitle: "Invalid Link",
    invalidDesc: "This password reset link is invalid or has expired. Please request a new one.",
    backToHome: "Back to Home",
    newPasswordLabel: "New Password",
    confirmPasswordLabel: "Confirm New Password",
    submit: "Set New Password",
    submitting: "Saving...",
    mismatch: "Password and confirmation do not match",
    successTitle: "Password Reset Successful!",
    successDesc: "You can now log in with your new password.",
    goToLogin: "Go to Login",
  },
};

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { lang } = useLanguage();
  const t = translations[lang];

  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.newPassword !== form.confirmPassword) {
      setError(t.mismatch);
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/auth/reset-password", { token, newPassword: form.newPassword });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 w-full text-center text-content-primary">
        <h1 className="text-xl font-bold mb-2">{t.invalidTitle}</h1>
        <p className="text-content-muted text-sm mb-6">{t.invalidDesc}</p>
        <Link to="/" className="inline-block px-6 py-3 bg-matcha hover:bg-matcha-hover text-white font-bold text-sm rounded-xl transition-colors">
          {t.backToHome}
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 w-full text-center text-content-primary">
        <div className="w-16 h-16 rounded-full bg-matcha flex justify-center items-center text-white mb-5 shadow-sm mx-auto">
          <FiCheck size={32} strokeWidth={3} />
        </div>
        <h1 className="text-xl font-bold mb-2">{t.successTitle}</h1>
        <p className="text-content-muted text-sm mb-6">{t.successDesc}</p>
        <Link to="/login" className="inline-block px-6 py-3 bg-matcha hover:bg-matcha-hover text-white font-bold text-sm rounded-xl transition-colors">
          {t.goToLogin}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16 w-full text-content-primary">
      <div className="text-left mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-content-primary">{t.title}</h1>
        <p className="text-content-muted text-xs sm:text-sm mt-1">{t.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-left">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm rounded-lg px-3.5 py-2.5">
            {error}
          </div>
        )}
        <div>
          <label className="block text-content-primary font-bold text-xs sm:text-sm mb-1">{t.newPasswordLabel}</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-hugme-border bg-[#F9F8F6] text-content-primary text-sm focus:outline-none focus:border-matcha focus:bg-white transition-colors"
          />
        </div>
        <div>
          <label className="block text-content-primary font-bold text-xs sm:text-sm mb-1">{t.confirmPasswordLabel}</label>
          <input
            type="password"
            required
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-hugme-border bg-[#F9F8F6] text-content-primary text-sm focus:outline-none focus:border-matcha focus:bg-white transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-matcha hover:bg-matcha-hover text-white font-bold text-sm rounded-xl transition-colors cursor-pointer disabled:opacity-60 mt-1"
        >
          {submitting ? t.submitting : t.submit}
        </button>
      </form>
    </div>
  );
}
