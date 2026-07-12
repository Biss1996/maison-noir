
import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers, FiBarChart2,
  FiSettings, FiLogOut, FiTag, FiBell, FiMenu, FiX, FiPercent, FiDollarSign
} from "react-icons/fi";
import { useAuth } from "../context/AppProviders.jsx";
import { useSellerNotifications, markRead } from "../services/notifications.js";

export const Route = createFileRoute("/admin")({
  component: AdminLayout
});

const items = [
  { to: "/admin", label: "Dashboard", icon: FiGrid },
  { to: "/admin/categories", label: "Categories", icon: FiTag },
  { to: "/admin/products", label: "Products", icon: FiPackage },
  { to: "/admin/inventory", label: "Inventory", icon: FiGrid },
  { to: "/admin/orders", label: "Orders", icon: FiShoppingBag },
  { to: "/admin/sales", label: "Sales", icon: FiDollarSign },
  { to: "/admin/coupons", label: "Coupons", icon: FiPercent },
  { to: "/admin/customers", label: "Customers", icon: FiUsers },
  { to: "/admin/reports", label: "Reports", icon: FiBarChart2 },
  { to: "/admin/settings", label: "Settings", icon: FiSettings },
];

function AdminLayout() {
  const { user, loading, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [navOpen, setNavOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const notifications = useSellerNotifications(user?.role === "superadmin" ? null : user?.id);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (loading) return;
    if (!isAdmin && pathname !== "/admin/login") {
      navigate({ to: "/" });
    }
  }, [loading, user, isAdmin, navigate, pathname]);

  useEffect(() => {
    setNavOpen(false);
    setBellOpen(false);
  }, [pathname]);

  if (pathname === "/admin/login") return <Outlet />;
  if (!user || !isAdmin) return null;

  const Nav = (
    <nav className="mt-8 space-y-1">
      {items.map((it) => {
        const active = pathname === it.to || (it.to !== "/admin" && pathname.startsWith(it.to + "/"));
        return (
          <Link
            key={it.to}
            to={it.to}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
              active ? "btn-gold text-ink" : "hover:bg-white/5"
            }`}
          >
            <it.icon /> {it.label}
          </Link>
        );
      })}
      <button
        onClick={() => { logout(); navigate({ to: "/" }); }}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white/5 w-full mt-6"
      >
        <FiLogOut /> Logout
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr] bg-secondary">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block bg-ink text-cream p-6">
        <h2 className="font-display text-2xl">
          Maison<span className="text-accent">·</span>Noir
        </h2>
        <p className="text-xs text-cream/60 mt-1">Admin Panel</p>
        <p className="text-[11px] text-cream/50 mt-2 truncate">
          {user.displayName || user.fullName}
        </p>
        {Nav}
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden bg-ink text-cream flex items-center justify-between px-4 py-3">
        <button onClick={() => setNavOpen(true)} className="p-2">
          <FiMenu />
        </button>
        <span className="font-display">
          Maison<span className="text-accent">·</span>Noir
        </span>
        <button onClick={() => setBellOpen(true)} className="p-2 relative">
          <FiBell />
          {unread > 0 && (
            <span className="absolute top-1 right-1 bg-accent text-ink text-[10px] rounded-full h-4 min-w-4 px-1 grid place-items-center">
              {unread}
            </span>
          )}
        </button>
      </div>

      {/* Main content */}
      <main className="p-4 sm:p-6 lg:p-8 overflow-auto min-h-screen">
        {/* Desktop bell */}
        <div className="hidden lg:flex justify-end mb-4">
          <button
            onClick={() => setBellOpen(true)}
            className="relative p-2 rounded-full bg-background shadow-luxe"
          >
            <FiBell />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-ink text-[10px] rounded-full h-4 min-w-4 px-1 grid place-items-center">
                {unread}
              </span>
            )}
          </button>
        </div>
        <Outlet />
      </main>

      {/* Mobile nav drawer */}
      {navOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 lg:hidden"
          onClick={() => setNavOpen(false)}
        >
          <aside
            className="bg-ink text-cream w-72 h-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h2 className="font-display text-2xl">
                Maison<span className="text-accent">·</span>Noir
              </h2>
              <button onClick={() => setNavOpen(false)}>
                <FiX />
              </button>
            </div>
            {Nav}
          </aside>
        </div>
      )}

      {/* Notifications drawer */}
      {bellOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60"
          onClick={() => setBellOpen(false)}
        >
          <aside
            className="bg-background w-full max-w-md ml-auto h-full p-6 overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-2xl">Notifications</h3>
              <button onClick={() => setBellOpen(false)}>
                <FiX />
              </button>
            </div>
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No notifications yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`p-3 rounded-lg border ${
                      n.read ? "opacity-70" : "bg-accent/5"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="text-sm font-semibold">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.body}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {n.createdAt?.toDate?.().toLocaleString?.() || ""}
                        </p>
                      </div>
                      {!n.read && (
                        <button
                          onClick={() => markRead(n.id)}
                          className="text-[10px] text-accent underline"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}