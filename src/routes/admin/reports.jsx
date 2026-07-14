import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { FiDownload } from "react-icons/fi";
import { formatKES } from "../../utils/currency.js";
import { useSellerOrders } from "../../hooks/useSellerOrders.js";
import { useProducts } from "../../hooks/useProducts.js";
import { useAuth } from "../../context/AppProviders.jsx";
import { toCSV, downloadCSV } from "../../services/csv.js";
export const Route = createFileRoute("/admin/reports")({ component: Reports });
function Reports() {
  const { user } = useAuth();
  const sellerId = user?.role === "superadmin" ? null : user?.id;
  const { orders } = useSellerOrders(sellerId);
  const { items: products } = useProducts(sellerId);
  const totals = useMemo(() => {
    const paid = orders.filter((o) => ["paid", "delivered", "shipped", "processing"].includes(o.status));
    return {
      revenue: paid.reduce((s, o) => s + (o.total || 0), 0),
      orders: orders.length,
      unitsSold: orders.reduce((s, o) => s + (o.items || []).reduce((n, i) => n + i.quantity, 0), 0),
      customers: new Set(orders.map((o) => o.customer?.phone).filter(Boolean)).size,
    };
  }, [orders]);
  const exportSales = () => {
    const rows = orders.map((o) => ({
      id: o.id,
      date: o.createdAt?.toDate?.().toISOString?.() || "",
      customer: o.customer?.fullName,
      phone: o.customer?.phone,
      total: o.total, status: o.status,
    }));
    downloadCSV(`sales-${Date.now()}.csv`, toCSV(rows));
  };
  const exportProducts = () => {
    const rows = products.map((p) => ({
      id: p.id, sku: p.sku, name: p.name, category: p.category, brand: p.brand,
      price: p.price, discount: p.discount,
      stock: p.stock || 0,
    }));
    downloadCSV(`products-${Date.now()}.csv`, toCSV(rows));
  };
  const exportOrderItems = () => {
    const rows = [];
    orders.forEach((o) => (o.items || []).forEach((i) => rows.push({
      orderId: o.id,
      date: o.createdAt?.toDate?.().toISOString?.() || "",
      product: i.name, color: i.color || "",size: i.size || "",
      qty: i.quantity, unitPrice: i.price, discount: i.discount,
      lineTotal: Math.round(i.price * (1 - (i.discount || 0) / 100)) * i.quantity,
    })));
    downloadCSV(`order-items-${Date.now()}.csv`, toCSV(rows));
  };
  return (
    <div>
      <h1 className="font-display text-4xl">Reports</h1>
      <p className="text-muted-foreground text-sm mt-1">Snapshot of your store performance. Export raw data as CSV.</p>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Revenue" value={formatKES(totals.revenue)} />
        <Stat label="Orders" value={totals.orders} />
        <Stat label="Units sold" value={totals.unitsSold} />
        <Stat label="Customers" value={totals.customers} />
      </div>
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <ExportCard title="Sales report" desc="One row per order" onClick={exportSales} />
        <ExportCard title="Order items" desc="Line-level detail" onClick={exportOrderItems} />
        <ExportCard title="Products catalog" desc="Your product list" onClick={exportProducts} />
      </div>
    </div>
  );
}
function Stat({ label, value }) {
  return <div className="bg-background rounded-xl p-5 shadow-luxe"><p className="text-xs uppercase text-muted-foreground">{label}</p><p className="mt-2 font-display text-3xl">{value}</p></div>;
}
function ExportCard({ title, desc, onClick }) {
  return (
    <button onClick={onClick} className="text-left bg-background rounded-xl p-5 shadow-luxe hover:shadow-lg transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-xl">{title}</p>
          <p className="text-xs text-muted-foreground mt-1">{desc}</p>
        </div>
        <span className="btn-gold rounded-full h-9 w-9 grid place-items-center"><FiDownload /></span>
      </div>
    </button>
  );
}