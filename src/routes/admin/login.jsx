import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AppProviders.jsx";

export const Route = createFileRoute("/admin/login")({ component: AdminLogin });

function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const u = await login(phone, password);
      if (u.role !== "admin") throw new Error("Admin access required");
      navigate({ to: "/admin" });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Login failed", text: err.message });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-ink text-cream px-6">
      <form onSubmit={submit} className="w-full max-w-sm">
        <h1 className="font-display text-4xl text-center">Admin Access</h1>
        <p className="text-center text-cream/60 text-sm mt-2">Restricted area</p>
        <div className="mt-8 space-y-3">
          <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Admin phone" className="w-full px-4 py-3 rounded-md bg-white/10 outline-none placeholder:text-cream/40" />
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-3 rounded-md bg-white/10 outline-none placeholder:text-cream/40" />
          <button disabled={loading} className="btn-gold w-full py-3 rounded-full font-medium">{loading ? "Signing in…" : "Sign In"}</button>
        </div>
      </form>
    </div>
  );
}
