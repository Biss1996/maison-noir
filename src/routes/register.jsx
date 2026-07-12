import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useAuth } from "../context/AppProviders.jsx";
import { normalizePhone } from "../utils/phone.js";

export const Route = createFileRoute("/register")({
  component: Register,
});

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!form.fullName.trim()) {
      return Swal.fire({
        icon: "error",
        title: "Full name is required",
      });
    }

    if (form.password !== form.confirm) {
      return Swal.fire({
        icon: "error",
        title: "Passwords don't match",
      });
    }

    if (form.password.length < 6) {
      return Swal.fire({
        icon: "error",
        title: "Password too short",
        text: "Password must contain at least 6 characters.",
      });
    }

    setLoading(true);

    try {
      await register({
        fullName: form.fullName.trim(),
        phone: normalizePhone(form.phone),
        password: form.password,
      });

      await Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: "Your account has been created successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate({
        to: "/profile",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] grid md:grid-cols-2">
      <div className="grid place-items-center p-8">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submit}
          className="w-full max-w-sm"
        >
          <h1 className="font-display text-4xl">
            Create Account
          </h1>

          <p className="text-muted-foreground text-sm mt-2">
            Join Maison Noir for exclusive collections,
            luxury fashion and members-only offers.
          </p>

          <div className="mt-8 space-y-4">
            <input
              required
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              placeholder="Full Name"
              className="w-full rounded-lg border px-4 py-3"
            />

            <input
              required
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="0712345678"
              className="w-full rounded-lg border px-4 py-3"
            />

            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="Password"
              className="w-full rounded-lg border px-4 py-3"
            />

            <input
              required
              type="password"
              value={form.confirm}
              onChange={(e) => update("confirm", e.target.value)}
              placeholder="Confirm Password"
              className="w-full rounded-lg border px-4 py-3"
            />

            <button
              disabled={loading}
              className="btn-gold w-full py-3 rounded-full font-medium disabled:opacity-50"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </div>

          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-accent underline"
            >
              Sign In
            </Link>
          </p>
        </motion.form>
      </div>

      <div className="hidden md:block relative">
        <img
          src="https://images.unsplash.com/photo-1520975916090-3105956dac38?w=1200&q=80"
          alt="Fashion"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
    </div>
  );
}