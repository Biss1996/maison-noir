import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useSettings, saveSettings, DEFAULT_SETTINGS } from "../../services/settingsService.js";
import { firebaseReady } from "../../firebase/config.jsx";
import { useAuth } from "../../context/AppProviders.jsx";
export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });
function AdminSettings() {
  const { user } = useAuth();
  const isSuper = user?.role === "superadmin";
  const { settings, loading } = useSettings();
  const [form, setForm] = useState(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (!loading) setForm(settings); }, [settings, loading]);
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSettings({ ...form, deliveryFee: Number(form.deliveryFee) || 0, freeDeliveryOver: Number(form.freeDeliveryOver) || 0 });
      Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Settings saved", timer: 1400, showConfirmButton: false });
    } catch (e) { Swal.fire({ icon: "error", title: "Failed", text: e.message }); }
    finally { setSaving(false); }
  };
  if (!isSuper) return (
    <div>
      <h1 className="font-display text-4xl">Settings</h1>
      <p className="text-muted-foreground mt-2">Only the store owner can edit global store settings. Update your profile to change your seller WhatsApp number.</p>
    </div>
  );
  return (
    <div>
      <h1 className="font-display text-4xl">Store Settings</h1>
      {!firebaseReady && <p className="text-xs text-amber-600 mt-1">Firebase not configured — changes won't persist.</p>}
      <form onSubmit={save} className="mt-6 max-w-2xl bg-background rounded-xl shadow-luxe p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="text-sm">Store name<input value={form.storeName} onChange={(e) => upd("storeName", e.target.value)} className="mt-1 w-full px-3 py-2 rounded border" /></label>
          <label className="text-sm">Tagline<input value={form.tagline} onChange={(e) => upd("tagline", e.target.value)} className="mt-1 w-full px-3 py-2 rounded border" /></label>
          <label className="text-sm">Logo URL<input value={form.logoUrl} onChange={(e) => upd("logoUrl", e.target.value)} className="mt-1 w-full px-3 py-2 rounded border" /></label>
          <label className="text-sm">Banner URL<input value={form.bannerUrl} onChange={(e) => upd("bannerUrl", e.target.value)} className="mt-1 w-full px-3 py-2 rounded border" /></label>
          <label className="text-sm">Contact phone<input value={form.phone} onChange={(e) => upd("phone", e.target.value)} className="mt-1 w-full px-3 py-2 rounded border" /></label>
          <label className="text-sm">Contact email<input value={form.email} onChange={(e) => upd("email", e.target.value)} className="mt-1 w-full px-3 py-2 rounded border" /></label>
          <label className="text-sm">WhatsApp (fallback)<input value={form.whatsapp} onChange={(e) => upd("whatsapp", e.target.value)} className="mt-1 w-full px-3 py-2 rounded border" /></label>
          <label className="text-sm">Facebook<input value={form.facebook} onChange={(e) => upd("facebook", e.target.value)} className="mt-1 w-full px-3 py-2 rounded border" /></label>
          <label className="text-sm">Instagram<input value={form.instagram} onChange={(e) => upd("instagram", e.target.value)} className="mt-1 w-full px-3 py-2 rounded border" /></label>
          <label className="text-sm">Delivery fee (KSh)<input type="number" value={form.deliveryFee} onChange={(e) => upd("deliveryFee", e.target.value)} className="mt-1 w-full px-3 py-2 rounded border" /></label>
          <label className="text-sm">Free delivery over (KSh)<input type="number" value={form.freeDeliveryOver} onChange={(e) => upd("freeDeliveryOver", e.target.value)} className="mt-1 w-full px-3 py-2 rounded border" /></label>
        </div>
        <div className="pt-2 flex justify-end">
          <button disabled={saving || !firebaseReady} className="btn-gold px-6 py-2 rounded-full font-medium">{saving ? "Saving…" : "Save changes"}</button>
        </div>
      </form>
    </div>
  );
}