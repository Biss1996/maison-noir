import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import {formatKES } from "../../utils/currency.js";
import { useProducts } from "../../hooks/useProducts.js";
import { useSellerOrders } from "../../hooks/useSellerOrders.js";
import { useCategories } from "../../hooks/useCategories.js";
import { useAuth } from "../../context/AppProviders.jsx";

Chart.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

export const Route = createFileRoute("/admin/")({
  component: Dashboard
});

const LOW_STOCK = 3;

function Stat({ label, value, delta, hint }) {
  return (
    <div className="bg-background rounded-xl p-5 shadow-luxe">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl">{value}</p>
      {delta && (
        <p className="text-xs text-emerald-600 mt-1">{delta}</p>
      )}
      {hint && (
        <p className="text-xs text-muted-foreground mt-1">{hint}</p>
      )}
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const sellerId = user?.role === "superadmin" ? null : user?.id;
  const { items: products } = useProducts(sellerId);
  const { orders } = useSellerOrders(sellerId);
  const { items: categories } = useCategories();

  const revenue = useMemo(
    () => orders
      .filter((o) => ["paid", "delivered", "shipped", "processing"].includes(o.status))
      .reduce((s, o) => s + (o.total || 0), 0),
    [orders]
  );

  const customerSet = useMemo(
    () => new Set(orders.map((o) => o.customer?.phone).filter(Boolean)),
    [orders]
  );

  const lowStock = useMemo(() => {
  return products.filter((p) => {
    if (Array.isArray(p.colors)) {
      return p.colors.some((c) => {
        if (typeof c === "object") {
          return (c.stock ?? 0) < LOW_STOCK;
        }
        return false;
      });
    }

    return (p.stock ?? 0) < LOW_STOCK;
  }).length;
}, [products]);

  const monthly = useMemo(() => {
    const buckets = {};
    orders.forEach((o) => {
      const d = o.createdAt?.toDate?.() || new Date();
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      buckets[key] = (buckets[key] || 0) + (o.total || 0);
    });
    const keys = Object.keys(buckets).sort().slice(-7);
    return {
      labels: keys.length ? keys : ["No data"],
      data: keys.length ? keys.map((k) => buckets[k]) : [0]
    };
  }, [orders]);

  const revenueData = {
    labels: monthly.labels,
    datasets: [{
      label: "Revenue (KSh)",
      data: monthly.data,
      borderColor: "#c9a24a",
      backgroundColor: "rgba(201,162,74,0.15)",
      fill: true,
      tension: 0.4,
    }],
  };

  const byCat = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [products]);

  const catData = {
    labels: byCat.map(([slug]) =>
      categories.find((c) => c.slug === slug)?.name || slug
    ),
    datasets: [{
      data: byCat.map(([, count]) => count),
      backgroundColor: ["#c9a24a", "#0b0b0b", "#d9c7a7", "#8b4a2b", "#c0c0c0"],
    }],
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-8">
        <div>
          <h1 className="font-display text-4xl">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Overview of your store
          </p>
        </div>
        <p className="text-muted-foreground text-sm">
          {sellerId
            ? `Your store, ${user?.displayName || user?.fullName || "Seller"}.`
            : "All stores (superadmin view)."
          }
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Stat label="Revenue" value={formatKES(revenue)} />
        <Stat label="Orders" value={orders.length} />
        <Stat label="Customers" value={customerSet.size} />
        <Stat label="Products" value={products.length} />
        <Stat
          label="Low stock"
          value={lowStock}
          hint={lowStock ? "Restock soon" : "All good"}
        />
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-4">
        <div className="bg-background rounded-xl p-6 shadow-luxe lg:col-span-2">
          <h3 className="font-semibold mb-4">Revenue trend</h3>
          <Line
            data={revenueData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } }
            }}
          />
        </div>
        <div className="bg-background rounded-xl p-6 shadow-luxe">
          <h3 className="font-semibold mb-4">Top categories</h3>
          {byCat.length > 0 ? (
            <Doughnut data={catData} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Add products to see distribution.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 bg-background rounded-xl shadow-luxe p-6 overflow-x-auto">
        <h3 className="font-semibold mb-4">Recent orders</h3>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <table className="w-full text-sm min-w-[520px]">
            <thead className="text-left text-muted-foreground text-xs uppercase">
              <tr>
                <th className="py-2">Order</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Total</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="py-2 font-mono text-xs">#{o.id.slice(0, 8)}</td>
                  <td className="py-2">{o.customer?.fullName}</td>
                  <td className="py-2 font-semibold">
                    {formatKES(o.total || 0)}
                  </td>
                  <td className="py-2">
                    <span className="text-xs uppercase">{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}