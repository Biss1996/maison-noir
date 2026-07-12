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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)}>
            <motion.aside
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="absolute left-0 top-0 h-full w-72 bg-background p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-display text-xl">Menu</span>
                <button onClick={() => setOpen(false)}><FiX size={22} /></button>
              </div>
              <div className="flex flex-col gap-4">
                {nav.map((n) => (
                  <Link key={n.label} to={n.to} onClick={() => setOpen(false)} className="text-lg">{n.label}</Link>
                ))}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
