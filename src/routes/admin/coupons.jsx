import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Swal from "sweetalert2";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { addCoupon, updateCoupon, deleteCoupon } from "../../services/couponService.js";
import { firebaseReady } from "../../firebase/config.jsx";
import {useCoupons, useSellerCoupons} from "../../hooks/useCoupons.js";
import { useAuth } from "../../context/AppProviders.jsx";
import { formatKES } from "../../utils/currency.js";
export const Route = createFileRoute("/admin/coupons")({ component: AdminCoupons });
const empty = { code: "", type: "percent", value: 10, minSubtotal: 0, expiresAt: "", active: true };
function AdminCoupons() {
  const { user } = useAuth();
  const sellerId = user?.role === "superadmin" ? null : user?.id;
const { coupons: items, loading } = sellerId
  ? useSellerCoupons(sellerId)
  : useCoupons();
    const [editing, setEditing] = useState(null);
  const del = async (c) => {
    const r = await Swal.fire({ icon: "warning", title: `Delete "${c.code}"?`, showCancelButton: true, confirmButtonText: "Delete" });
    if (!r.isConfirmed) return;
    try { await deleteCoupon(c.id); Swal.fire({ icon: "success", title: "Deleted", timer: 1200, showConfirmButton: false }); }
    catch (e) { Swal.fire({ icon: "error", title: "Failed", text: e.message }); }
  };
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="font-display text-4xl">Coupons</h1>
          <p className="text-xs text-muted-foreground mt-1">Discount codes for your store.</p>
          {!firebaseReady && <p className="text-xs text-amber-600 mt-1">Firebase not configured.</p>}
        </div>
        <button onClick={() => setEditing({ ...empty })} disabled={!firebaseReady} className="btn-gold px-5 py-2.5 rounded-full flex items-center gap-2 disabled:opacity-50"><FiPlus /> Add Coupon</button>
      </div>
      <div className="mt-6 bg-background rounded-xl shadow-luxe overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-secondary text-left"><tr>{["Code", "Type", "Value", "Min Subtotal", "Expires", "Active", ""].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan="7" className="px-4 py-10 text-center text-muted-foreground">No coupons yet.</td></tr>}
            {items.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-3 font-mono font-semibold">{c.code}</td>
                <td className="px-4 py-3 capitalize">{c.type}</td>
                <td className="px-4 py-3">{c.type === "percent" ? `${c.value}%` : formatKES(c.value)}</td>
                <td className="px-4 py-3">{c.minSubtotal ? formatKES(c.minSubtotal) : "—"}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{c.expiresAt || "never"}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${c.active !== false ? "bg-emerald-100 text-emerald-700" : "bg-secondary"}`}>{c.active !== false ? "Active" : "Off"}</span></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditing({ ...c })} className="p-2 rounded hover:bg-secondary"><FiEdit2 /></button>
                    <button onClick={() => del(c)} className="p-2 rounded hover:bg-red-50 text-red-600"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && <CouponForm coupon={editing} setCoupon={setEditing} onClose={() => setEditing(null)} sellerId={sellerId} />}
    </div>
  );
}
function CouponForm({ coupon, setCoupon, onClose, sellerId }) {
  const [saving, setSaving] = useState(false);
  const isNew = !coupon.id;
  const upd = (k, v) => setCoupon((c) => ({ ...c, [k]: v }));
  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { id, ...data } = coupon;
      if (isNew && sellerId) data.sellerId = sellerId;
      if (isNew) await addCoupon(data);
      else await updateCoupon(id, data);
      Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Saved", timer: 1200, showConfirmButton: false });
      onClose();
    } catch (e) { Swal.fire({ icon: "error", title: "Failed", text: e.message }); }
    finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4 overflow-auto" onClick={onClose}>
      <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="bg-background rounded-2xl max-w-lg w-full my-8 shadow-luxe">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-display text-2xl">{isNew ? "New Coupon" : `Edit: ${coupon.code}`}</h2>
          <button type="button" onClick={onClose} className="p-2 rounded hover:bg-secondary"><FiX /></button>
        </div>
        <div className="p-6 space-y-3">
          <label className="text-sm block">Code<input required value={coupon.code} onChange={(e) => upd("code", e.target.value.toUpperCase())} className="mt-1 w-full px-3 py-2 rounded border font-mono uppercase" /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">Type
              <select value={coupon.type} onChange={(e) => upd("type", e.target.value)} className="mt-1 w-full px-3 py-2 rounded border bg-background">
                <option value="percent">Percent (%)</option><option value="fixed">Fixed (KSh)</option>
              </select>
            </label>
            <label className="text-sm">Value<input required type="number" value={coupon.value} onChange={(e) => upd("value", e.target.value)} className="mt-1 w-full px-3 py-2 rounded border" /></label>
          </div>
          <label className="text-sm block">Minimum subtotal (KSh)<input type="number" value={coupon.minSubtotal} onChange={(e) => upd("minSubtotal", e.target.value)} className="mt-1 w-full px-3 py-2 rounded border" /></label>
          <label className="text-sm block">Expires (YYYY-MM-DD, optional)<input type="date" value={coupon.expiresAt || ""} onChange={(e) => upd("expiresAt", e.target.value)} className="mt-1 w-full px-3 py-2 rounded border" /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={coupon.active !== false} onChange={(e) => upd("active", e.target.checked)} /> Active</label>
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-full border">Cancel</button>
          <button disabled={saving} className="btn-gold px-6 py-2 rounded-full font-medium">{saving ? "Saving…" : "Save"}</button>
        </div>
      </form>
    </div>
  );
}
