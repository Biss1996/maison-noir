import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db, firebaseReady } from "../../firebase/config.jsx";
import { formatKES } from "../../utils/currency.js";
import { useSellerOrders } from "../../hooks/useSellerOrders.js";
import { useAuth } from "../../context/AppProviders.jsx";
import { FiX } from "react-icons/fi";

export const Route = createFileRoute("/admin/customers")({
  component: Customers
});

function Customers() {
  const { user } = useAuth();
  const sellerId = user?.role === "superadmin" ? null : user?.id;
  const { orders } = useSellerOrders(sellerId);
  const [detail, setDetail] = useState(null);

  // Build customer directory from orders (seller-scoped)
  const customers = useMemo(() => {
    const map = new Map();
    orders.forEach((o) => {
      const key = o.customer?.phone || o.userId || o.id;
      if (!key) return;
      const prev = map.get(key) || {
        key,
        fullName: o.customer?.fullName,
        phone: o.customer?.phone,
        email: o.customer?.email,
        orders: 0,
        spend: 0,
        lastOrder: null,
        orderList: [],
      };
      prev.orders += 1;
      prev.spend += o.total || 0;
      prev.orderList.push(o);
      const t = o.createdAt?.toDate?.()?.getTime?.() || 0;
      if (!prev.lastOrder || t > prev.lastOrder) prev.lastOrder = t;
      map.set(key, prev);
    });
    return [...map.values()].sort((a, b) => (b.lastOrder || 0) - (a.lastOrder || 0));
  }, [orders]);

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="font-display text-4xl">Customers</h1>
        <p className="text-muted-foreground text-sm mt-1">
          People who have ordered from your store.
        </p>
        {!firebaseReady && (
          <p className="text-xs text-amber-600 mt-1">
            Firebase not configured.
          </p>
        )}
      </div>

      <div className="bg-background rounded-xl shadow-luxe overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-secondary text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Total Spend</th>
              <th className="px-4 py-3">Last Order</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-10 text-center text-muted-foreground">
                  No customers yet.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.key} className="border-t">
                  <td className="px-4 py-3">{c.fullName || "Anonymous"}</td>
                  <td className="px-4 py-3">{c.phone || "N/A"}</td>
                  <td className="px-4 py-3">{c.orders}</td>
                  <td className="px-4 py-3 font-semibold">{formatKES(c.spend)}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {c.lastOrder ? new Date(c.lastOrder).toLocaleDateString() : ""}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setDetail(c)}
                      className="text-accent text-xs underline hover:no-underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {detail && (
        <div
          className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4 overflow-auto"
          onClick={() => setDetail(null)}
        >
          <div
            className="bg-background rounded-2xl max-w-2xl w-full my-8 shadow-luxe"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="font-display text-2xl">{detail.fullName || "Anonymous"}</h2>
                <p className="text-xs text-muted-foreground">
                  {detail.phone} · {detail.email || "no email"}
                </p>
              </div>
              <button
                onClick={() => setDetail(null)}
                className="p-2 rounded hover:bg-secondary"
              >
                <FiX />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded bg-secondary">
                  <p className="text-xs text-muted-foreground">Orders</p>
                  <p className="text-xl font-display">{detail.orders}</p>
                </div>
                <div className="p-3 rounded bg-secondary">
                  <p className="text-xs text-muted-foreground">Lifetime spend</p>
                  <p className="text-xl font-display">{formatKES(detail.spend)}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm">Order history</h3>
                <div className="mt-2 space-y-2 text-sm">
                  {detail.orderList.length === 0 ? (
                    <p className="text-muted-foreground text-xs">No orders found.</p>
                  ) : (
                    detail.orderList
                      .sort((a, b) => (b.createdAt?.toDate?.()?.getTime?.() || 0) - (a.createdAt?.toDate?.()?.getTime?.() || 0))
                      .map((o) => (
                        <div
                          key={o.id}
                          className="flex justify-between items-center border-b py-2"
                        >
                          <span className="font-mono text-xs">#{o.id.slice(0, 8)}</span>
                          <span className="text-xs uppercase">{o.status}</span>
                          <span className="font-semibold">{formatKES(o.total || 0)}</span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}