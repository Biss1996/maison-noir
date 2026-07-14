import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
import { useCart, useWishlist, useAuth } from "../../context/AppProviders.jsx";
const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/shop", label: "New Arrivals", search: { sort: "new" } },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const cart = useCart();
  const wish = useWishlist();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
      className="sticky top-0 z-40 glass border-b border-border/60"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <button className="md:hidden text-ink" onClick={() => setOpen(true)} aria-label="Open menu">
          <FiMenu size={22} />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl tracking-tight">Maison<span className="text-accent">·</span>Noir</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm">
          {nav.map((n) => (
            <Link key={n.label} to={n.to} className="hover:text-accent transition-colors relative group">
              {n.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-ink">
          <button className="hidden sm:grid place-items-center h-9 w-9 rounded-full hover:bg-secondary" aria-label="Search"><FiSearch /></button>
          <Link to={user ? "/profile" : "/login"} className="grid place-items-center h-9 w-9 rounded-full hover:bg-secondary" aria-label="Account"><FiUser /></Link>
          <Link to="/wishlist" className="relative grid place-items-center h-9 w-9 rounded-full hover:bg-secondary" aria-label="Wishlist">
            <FiHeart />
            {wish.count > 0 && <span className="absolute -top-0.5 -right-0.5 bg-accent text-ink text-[10px] font-semibold rounded-full h-4 min-w-4 px-1 grid place-items-center">{wish.count}</span>}
          </Link>
          <button onClick={() => cart.setOpen(true)} className="relative grid place-items-center h-9 w-9 rounded-full hover:bg-secondary" aria-label="Bag">
            <FiShoppingBag />
            {cart.count > 0 && <span className="absolute -top-0.5 -right-0.5 bg-ink text-cream text-[10px] font-semibold rounded-full h-4 min-w-4 px-1 grid place-items-center">{cart.count}</span>}
          </button>
        </div>
      </div>

     <AnimatePresence>
  {open && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-1 bg-black/70 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <motion.aside
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        exit={{ x: -320 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 28,
        }}
        onClick={(e) => e.stopPropagation()}
        className="absolute left-0 top-0 h-full w-72 bg-[#0d0d0d] text-white border-r border-amber-400/20 shadow-[0_0_40px_rgba(0,0,0,.6)] p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <h2 className="font-display text-2xl tracking-wide">
              Maison
              <span className="text-amber-400">·</span>
              Noir
            </h2>
            <p className="text-xs uppercase tracking-[0.25em] text-white/50 mt-1">
              Luxury Fashion
            </p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-2 hover:bg-white/10 transition"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex flex-col">
          {nav.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              search={n.search}
              onClick={() => setOpen(false)}
              className="group flex items-center justify-between py-4 border-b border-white/5 text-white/90 hover:text-amber-400 transition-all duration-300"
            >
              <span>{n.label}</span>

              <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-amber-400">
                →
              </span>
            </Link>
          ))}
        </nav>

        {/* Bottom Accent */}
        <div className="absolute bottom-8 left-6 right-6">
          <div className="h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mb-4" />

          
        </div>
      </motion.aside>
    </motion.div>
  )}
</AnimatePresence>
    </motion.header>
  );
}
