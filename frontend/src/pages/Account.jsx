import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { BiChevronRight, BiPlus, BiEdit, BiTrash, BiCheck } from "react-icons/bi";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../lib/api";
import translations from "../i18n/account";

const emptyAddressForm = { label: "", fullName: "", phone: "", address: "", province: "", postalCode: "", isDefault: false };

export default function Account() {
  const { user, token, isAuthenticated, openAuthModal } = useAuth();
  const { lang } = useLanguage();
  const t = translations[lang];

  const [profileForm, setProfileForm] = useState({ name: "", phone: "", email: "" });
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState(emptyAddressForm);
  const [addressError, setAddressError] = useState("");

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || "", phone: user.phone || "", email: user.email || "" });
    }
  }, [user]);

  const loadAddresses = useCallback(() => {
    if (!token) return;
    api.get("/addresses", token).then((data) => setAddresses(data.addresses)).catch(() => {});
  }, [token]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setProfileSaving(true);
    try {
      await api.patch("/auth/me", profileForm, token);
      setProfileSuccess(t.profileSuccess);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError(t.passwordMismatch);
      return;
    }
    setPasswordSaving(true);
    try {
      await api.post(
        "/auth/change-password",
        { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword },
        token
      );
      setPasswordSuccess(t.passwordSuccess);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordSaving(false);
    }
  };

  const openNewAddressForm = () => {
    setEditingAddressId(null);
    setAddressForm(emptyAddressForm);
    setAddressError("");
    setAddressFormOpen(true);
  };

  const openEditAddressForm = (addr) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      label: addr.label,
      fullName: addr.fullName,
      phone: addr.phone,
      address: addr.address,
      province: addr.province,
      postalCode: addr.postalCode,
      isDefault: addr.isDefault,
    });
    setAddressError("");
    setAddressFormOpen(true);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setAddressError("");
    try {
      if (editingAddressId) {
        await api.patch(`/addresses/${editingAddressId}`, addressForm, token);
      } else {
        await api.post("/addresses", addressForm, token);
      }
      setAddressFormOpen(false);
      loadAddresses();
    } catch (err) {
      setAddressError(err.message);
    }
  };

  const handleSetDefault = async (id) => {
    await api.patch(`/addresses/${id}/default`, {}, token);
    loadAddresses();
  };

  const handleDeleteAddress = async (id) => {
    await api.del(`/addresses/${id}`, token);
    loadAddresses();
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 w-full text-center text-content-primary">
        <h1 className="text-xl font-bold mb-2">{t.loginRequiredTitle}</h1>
        <p className="text-content-muted text-sm mb-6">{t.loginRequiredDesc}</p>
        <button
          type="button"
          onClick={() => openAuthModal("login")}
          className="px-6 py-3 bg-matcha hover:bg-matcha-hover text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
        >
          {t.loginButton}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full text-content-primary">
      <div className="flex items-center gap-1.5 text-xs text-content-muted mb-4 text-left">
        <Link to="/" className="hover:text-matcha transition-colors">{t.breadcrumbHome}</Link>
        <BiChevronRight size={14} />
        <span className="text-matcha font-medium">{t.breadcrumbAccount}</span>
      </div>

      <div className="text-left mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-content-primary">{t.title}</h1>
        <p className="text-content-muted text-xs sm:text-sm mt-1">{t.subtitle}</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-hugme-border p-6 shadow-xs text-left">
          <h2 className="font-bold text-base text-content-primary mb-4">{t.profileTitle}</h2>
          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-3.5">
            {profileError && <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3.5 py-2.5">{profileError}</div>}
            {profileSuccess && <div className="bg-matcha-soft/30 border border-matcha/30 text-matcha text-xs rounded-lg px-3.5 py-2.5">{profileSuccess}</div>}
            <div>
              <label className="block text-content-primary font-bold text-xs mb-1">{t.nameLabel}</label>
              <input
                type="text"
                required
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-hugme-border bg-[#F9F8F6] text-content-primary text-sm focus:outline-none focus:border-matcha focus:bg-white transition-colors"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-content-primary font-bold text-xs mb-1">{t.phoneLabel}</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-hugme-border bg-[#F9F8F6] text-content-primary text-sm focus:outline-none focus:border-matcha focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-content-primary font-bold text-xs mb-1">{t.emailLabel}</label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-hugme-border bg-[#F9F8F6] text-content-primary text-sm focus:outline-none focus:border-matcha focus:bg-white transition-colors"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={profileSaving}
              className="self-start px-5 py-2.5 bg-matcha hover:bg-matcha-hover text-white font-bold text-sm rounded-xl transition-colors cursor-pointer disabled:opacity-60"
            >
              {profileSaving ? t.saving : t.saveProfile}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl border border-hugme-border p-6 shadow-xs text-left">
          <h2 className="font-bold text-base text-content-primary mb-4">{t.passwordTitle}</h2>
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3.5">
            {passwordError && <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3.5 py-2.5">{passwordError}</div>}
            {passwordSuccess && <div className="bg-matcha-soft/30 border border-matcha/30 text-matcha text-xs rounded-lg px-3.5 py-2.5">{passwordSuccess}</div>}
            <div>
              <label className="block text-content-primary font-bold text-xs mb-1">{t.currentPasswordLabel}</label>
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-hugme-border bg-[#F9F8F6] text-content-primary text-sm focus:outline-none focus:border-matcha focus:bg-white transition-colors"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-content-primary font-bold text-xs mb-1">{t.newPasswordLabel}</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-hugme-border bg-[#F9F8F6] text-content-primary text-sm focus:outline-none focus:border-matcha focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-content-primary font-bold text-xs mb-1">{t.confirmPasswordLabel}</label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-hugme-border bg-[#F9F8F6] text-content-primary text-sm focus:outline-none focus:border-matcha focus:bg-white transition-colors"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={passwordSaving}
              className="self-start px-5 py-2.5 bg-earth-brown hover:bg-[#68432F] text-white font-bold text-sm rounded-xl transition-colors cursor-pointer disabled:opacity-60"
            >
              {passwordSaving ? t.saving : t.changePassword}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl border border-hugme-border p-6 shadow-xs text-left">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-base text-content-primary">{t.addressesTitle}</h2>
            {!addressFormOpen && (
              <button
                type="button"
                onClick={openNewAddressForm}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-matcha hover:bg-matcha-hover text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                <BiPlus size={16} />
                {t.addAddress}
              </button>
            )}
          </div>

          {addressFormOpen && (
            <form onSubmit={handleAddressSubmit} className="flex flex-col gap-3 mb-5 bg-[#FAF8F5] rounded-xl p-4 border border-hugme-border">
              {addressError && <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3.5 py-2.5">{addressError}</div>}
              <input
                type="text"
                required
                placeholder={t.labelLabel}
                value={addressForm.label}
                onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-hugme-border bg-white text-content-primary text-sm focus:outline-none focus:border-matcha"
              />
              <input
                type="text"
                required
                placeholder={t.nameLabel}
                value={addressForm.fullName}
                onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-hugme-border bg-white text-content-primary text-sm focus:outline-none focus:border-matcha"
              />
              <input
                type="tel"
                required
                placeholder={t.phoneLabel}
                value={addressForm.phone}
                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-hugme-border bg-white text-content-primary text-sm focus:outline-none focus:border-matcha"
              />
              <textarea
                required
                rows={2}
                placeholder={t.addressLabel}
                value={addressForm.address}
                onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-hugme-border bg-white text-content-primary text-sm focus:outline-none focus:border-matcha resize-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder={t.provinceLabel}
                  value={addressForm.province}
                  onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-hugme-border bg-white text-content-primary text-sm focus:outline-none focus:border-matcha"
                />
                <input
                  type="text"
                  required
                  placeholder={t.postalCodeLabel}
                  value={addressForm.postalCode}
                  onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-hugme-border bg-white text-content-primary text-sm focus:outline-none focus:border-matcha"
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-content-primary cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="w-3.5 h-3.5 accent-matcha rounded cursor-pointer"
                />
                {t.setAsDefaultCheckbox}
              </label>
              <div className="flex gap-2">
                <button type="submit" className="px-5 py-2 bg-matcha hover:bg-matcha-hover text-white font-bold text-xs rounded-lg transition-colors cursor-pointer">
                  {t.save}
                </button>
                <button
                  type="button"
                  onClick={() => setAddressFormOpen(false)}
                  className="px-5 py-2 border border-hugme-border text-content-primary font-bold text-xs rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          )}

          <div className="flex flex-col gap-3">
            {addresses.map((addr) => (
              <div key={addr.id} className="border border-hugme-border rounded-xl p-4 flex justify-between items-start gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-content-primary">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="bg-matcha-soft text-matcha text-[10px] font-bold px-2 py-0.5 rounded-md">{t.defaultBadge}</span>
                    )}
                  </div>
                  <p className="text-content-muted text-xs">{addr.fullName} · {addr.phone}</p>
                  <p className="text-content-muted text-xs">{addr.address}, {addr.province} {addr.postalCode}</p>
                </div>
                <div className="flex flex-col gap-1.5 items-end shrink-0">
                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(addr.id)}
                      className="flex items-center gap-1 text-[11px] text-matcha hover:underline cursor-pointer"
                    >
                      <BiCheck size={14} />
                      {t.setDefault}
                    </button>
                  )}
                  <div className="flex gap-2">
                    <button type="button" onClick={() => openEditAddressForm(addr)} className="text-content-muted hover:text-content-primary cursor-pointer">
                      <BiEdit size={16} />
                    </button>
                    <button type="button" onClick={() => handleDeleteAddress(addr.id)} className="text-content-muted hover:text-red-500 cursor-pointer">
                      <BiTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {addresses.length === 0 && !addressFormOpen && (
              <p className="text-content-muted text-sm text-center py-4">{t.noAddresses}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
