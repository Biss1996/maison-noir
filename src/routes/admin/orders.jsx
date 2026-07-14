import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { FiEye, FiX, FiExternalLink } from "react-icons/fi";
import { formatKES } from "../../utils/currency.js";
import { updateOrderStatus } from "../../services/orderService.js";
import { useSellerOrders } from "../../hooks/useSellerOrders.js";
import { firebaseReady } from "../../firebase/config.jsx";
import { useAuth } from "../../context/AppProviders.jsx";
import { toCSV, downloadCSV } from "../../services/csv.js";
import { buildOrderMessage } from "../../utils/orderMessage.js";
import { waLink } from "../../utils/whatsapp.js";
export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders
});

const STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

const badge = (s) => ({
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-200 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
}[s] || "bg-secondary");

function AdminOrders() {
  const { user } = useAuth();
  const sellerId = user?.role === "superadmin" ? null : user?.id;
  const { orders, loading } = useSellerOrders(sellerId);
  const [detail, setDetail] = useState(null);
  const [status, setStatus] = useState("");

  const filtered = useMemo(
    () => status ? orders.filter((o) => o.status === status) : orders,
    [orders, status]
  );

  const changeStatus = async (id, s) => {
    try {
      await updateOrderStatus(id, s);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Status updated",
        timer: 1200,
        showConfirmButton: false
      });
    } catch (e) {
      Swal.fire({ icon: "error", title: "Failed", text: e.message });
    }
  };

  

  const exportCSV = () => {
    const rows = filtered.map((o) => ({
      id: o.id,
      date: o.createdAt?.toDate?.().toISOString?.() || "",
      customer: o.customer?.fullName,
      phone: o.customer?.phone,
      items: o.items?.reduce((s, i) => s + i.quantity, 0),
      subtotal: o.subtotal,
      discount: o.discount || 0,
      total: o.total,
      status: o.status,
      payment: o.payment?.method,
    }));
    downloadCSV(`orders-${Date.now()}.csv`, toCSV(rows));
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-4xl">Orders</h1>
          {!firebaseReady && (
            <p className="text-xs text-amber-600 mt-1">
              Firebase not configured — orders can't be persisted.
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 rounded-full border bg-background text-sm"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-full border text-sm"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-background rounded-xl shadow-luxe overflow-x-auto">
        <table className="w-full text-sm min-w-[820px]">
          <thead className="bg-secondary text-left">
            <tr>
              {["Order", "Customer", "Items", "Total", "Payment", "Status", "Date", ""].map((h) => (
                <th key={h} className="px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="8" className="px-4 py-6 text-center text-muted-foreground">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan="8" className="px-4 py-10 text-center text-muted-foreground">
                  No orders yet.
                </td>
              </tr>
            )}
            {!loading && filtered.map((o) => {
              const itemCount = o.items?.reduce((s, i) => s + i.quantity, 0) || 0;
              return (
                <tr key={o.id} className="border-t align-top">
                  <td className="px-4 py-3 font-mono text-xs">#{o.id.slice(0, 8)}</td>
                  <td className="px-4 py-3">
                    <p>{o.customer?.fullName}</p>
                    <p className="text-xs text-muted-foreground">{o.customer?.phone}</p>
                  </td>
                  <td className="px-4 py-3">{itemCount}</td>
                  <td className="px-4 py-3 font-semibold">{formatKES(o.total || 0)}</td>
                  <td className="px-4 py-3 uppercase text-xs">{o.payment?.method}</td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => changeStatus(o.id, e.target.value)}
                      className={`px-2 py-1 rounded text-xs ${badge(o.status)}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {o.createdAt?.toDate?.().toLocaleString?.() || ""}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setDetail(o)}
                      className="p-2 rounded hover:bg-secondary"
                    >
                      <FiEye />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {detail && (
        <OrderDetail
          order={detail}
          onClose={() => setDetail(null)}
          onStatus={(s) => changeStatus(detail.id, s)}
        />
      )}
    </div>
  );
}

function OrderDetail({ order, onClose, onStatus }) {
  const message = buildOrderMessage({ order });
const link = waLink(message);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4 overflow-auto">
      <div className="bg-background rounded-2xl max-w-2xl w-full my-8 shadow-luxe">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="font-display text-2xl">Order #{order.id.slice(0, 8)}</h2>
            <p className="text-xs text-muted-foreground">
              {order.createdAt?.toDate?.().toLocaleString?.() || ""}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded hover:bg-secondary">
            <FiX />
          </button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-1">Customer</h3>
              <p>{order.customer?.fullName}</p>
              <p className="text-muted-foreground">{order.customer?.phone}</p>
              {order.customer?.email && (
                <p className="text-muted-foreground">{order.customer.email}</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-1">Delivery</h3>
              <p>{order.shipping?.address}</p>
              <p className="text-muted-foreground">
                {order.shipping?.city}, {order.shipping?.country}
              </p>
              {order.shipping?.notes && (
                <p className="text-xs mt-1 italic">"{order.shipping.notes}"</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-sm">Items</h3>
            <div className="space-y-2">
              {order.items?.map((i) => (
                <div key={i.key} className="flex gap-3 items-center border rounded p-2">
                  <img
                    src={i.image}
                    alt=""
                    className="h-12 w-12 rounded object-cover bg-secondary"
                  />
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{i.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {i.color?.name} · {i.size?.label} · Qty {i.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatKES(Math.round(i.price * (1 - (i.discount || 0) / 100)) * i.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm space-y-1 border-t pt-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatKES(order.subtotal || 0)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount</span>
                <span>−{formatKES(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>
                {order.shipping?.cost ? formatKES(order.shipping.cost) : "Free"}
              </span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total</span>
              <span>{formatKES(order.total || 0)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <select
              defaultValue={order.status}
              onChange={(e) => onStatus(e.target.value)}
              className="px-3 py-2 rounded border text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="btn-gold px-4 py-2 rounded-full text-sm flex items-center gap-2"
              >
                <FiExternalLink /> Message customer
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}