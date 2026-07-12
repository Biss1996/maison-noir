import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "../context/AppProviders.jsx";
import { useUserOrders } from "../hooks/useUserOrders.js";
import { formatKES } from "../utils/currency";
export const Route = createFileRoute("/orders")({ component: Orders });

function Orders() {
  const { user } = useAuth();
  const { orders, loading } = useUserOrders(user?.id);

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="font-display text-4xl">My Orders</h1>
        <p className="text-muted-foreground mt-3">Sign in to view your orders.</p>
        <Link to="/login" className="btn-gold inline-block mt-6 px-6 py-2.5 rounded-full">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-4xl">My Orders</h1>
      {loading && <p className="mt-6 text-muted-foreground">Loading…</p>}
      {!loading && orders.length === 0 && (
        <div className="mt-8 text-center border rounded-xl py-16 bg-secondary">
          <p className="text-muted-foreground">You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn-gold inline-block mt-4 px-6 py-2.5 rounded-full">Shop now</Link>
        </div>
      )}
      <div className="mt-6 space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="border rounded-xl p-5 bg-background">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8)}</p>
                <p className="text-xs text-muted-foreground">{o.createdAt?.toDate?.().toLocaleString?.() || ""}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs uppercase ${o.status === "paid" || o.status === "delivered" ? "bg-emerald-100 text-emerald-700" : o.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                {o.status}
              </span>
            </div>
            <div className="mt-3 divide-y">
              {o.items?.map((i) => (
                <div key={i.key} className="flex gap-3 items-center py-2">
                  <img src={i.image} alt="" className="w-14 h-16 object-cover rounded" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{i.name}</p>
                    <p className="text-xs text-muted-foreground">{i.color?.name} · {i.size?.label} · Qty {i.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatKES(Math.round(i.price * (1 - i.discount / 100)) * i.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-muted-foreground">Payment: {o.payment?.method?.toUpperCase()}</span>
              <span className="font-display text-lg">{formatKES(o.total || 0)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
