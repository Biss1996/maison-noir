import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../context/AppProviders.jsx";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!loading && !user) navigate({ to: "/login" }); }, [loading, user, navigate]);
  if (!user) return null;
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-4xl">My Account</h1>
      <div className="mt-8 grid gap-4">
        <div className="bg-card border rounded-xl p-6">
          <p className="text-xs uppercase text-muted-foreground">Full Name</p>
          <p className="font-medium">{user.fullName}</p>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <p className="text-xs uppercase text-muted-foreground">Phone</p>
          <p className="font-medium">{user.phone}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/orders" className="btn-gold px-5 py-2.5 rounded-full">My Orders</Link>
          <Link to="/wishlist" className="px-5 py-2.5 rounded-full border">Wishlist</Link>
          <button onClick={logout} className="px-5 py-2.5 rounded-full border">Logout</button>
        </div>
      </div>
    </div>
  );
}
