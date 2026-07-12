import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useAuth } from "../context/AppProviders.jsx";
import { normalizePhone } from "../utils/phone.js";

export const Route = createFileRoute("/login")({
  validateSearch: (search) => ({
    redirect: search.redirect || "/profile",
  }),
  component: Login,
});

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { redirect } = useSearch({
    from: "/login",
  });

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(normalizePhone(phone), password);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `Welcome back ${user.fullName || ""}`,
        timer: 1500,
        showConfirmButton: false,
      });

      // Redirect admins to admin dashboard
      if (user.role === "admin") {
        navigate({ to: "/admin" });
        return;
      }

      // Redirect customers to their original destination
      navigate({
        to: redirect,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] grid md:grid-cols-2">
      <div className="hidden md:block relative">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80"
          alt="Fashion"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="grid place-items-center p-8">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submit}
          className="w-full max-w-sm"
        >
          <h1 className="font-display text-4xl">Welcome Back</h1>

          <p className="text-muted-foreground text-sm mt-2">
            Sign in using your Kenyan phone number.
          </p>

          <div className="mt-8 space-y-4">
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0712345678 or +254712345678"
              className="w-full px-4 py-3 rounded-md border"
            />

            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-md border"
            />

            <button
              disabled={loading}
              className="btn-gold w-full py-3 rounded-full font-medium disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <div className="mt-4 text-center text-sm">
            <Link
              to="/forgot-password"
              className="text-accent hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <p className="mt-6 text-center text-sm">
            New here?{" "}
            <Link
              to="/register"
              className="text-accent font-medium hover:underline"
            >
              Create an account
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}