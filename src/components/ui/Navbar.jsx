import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  FiSearch,
  FiUser,
  FiHeart,
  FiShoppingBag,
  FiMenu,
  FiX,
  FiHome,
  FiGrid,
  FiPackage,
  FiInfo,
  FiPhone,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";

import {
  useCart,
  useWishlist,
  useAuth,
} from "../../context/AppProviders.jsx";

const nav = [
  {
    to: "/",
    label: "Home",
    icon: <FiHome size={18} />,
  },
  {
    to: "/shop",
    label: "Shop",
    icon: <FiGrid size={18} />,
  },
  {
    to: "/shop",
    label: "New Arrivals",
    search: { sort: "new" },
    icon: <FiPackage size={18} />,
  },
  {
    to: "/about",
    label: "About",
    icon: <FiInfo size={18} />,
  },
  {
    to: "/contact",
    label: "Contact",
    icon: <FiPhone size={18} />,
  },
];

export default function Navbar() {
  const cart = useCart();
  const wish = useWishlist();
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: .5 }}
        className="sticky top-0 z-40 glass border-b border-border/60"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Mobile Menu */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden"
          >
            <FiMenu size={22} />
          </button>

          {/* Logo */}
          <Link to="/">
            <h1 className="font-display text-2xl tracking-wide">
              Maison
              <span className="text-amber-400">·</span>
              Noir
            </h1>
          </Link>

          {/* Desktop */}
          <nav className="hidden md:flex gap-8 text-sm">
            {nav.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                search={item.search}
                className="hover:text-amber-400 transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-2">

            <button className="hidden sm:grid place-items-center h-9 w-9 rounded-full hover:bg-secondary">
              <FiSearch />
            </button>

            <Link
              to={user ? "/profile" : "/login"}
              className="grid place-items-center h-9 w-9 rounded-full hover:bg-secondary"
            >
              <FiUser />
            </Link>

            <Link
              to="/wishlist"
              className="relative grid place-items-center h-9 w-9 rounded-full hover:bg-secondary"
            >
              <FiHeart />

              {wish.count > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-black text-[10px] h-4 min-w-4 rounded-full grid place-items-center">
                  {wish.count}
                </span>
              )}
            </Link>

            <button
              onClick={() => cart.setOpen(true)}
              className="relative grid place-items-center h-9 w-9 rounded-full hover:bg-secondary"
            >
              <FiShoppingBag />

              {cart.count > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] h-4 min-w-4 rounded-full grid place-items-center">
                  {cart.count}
                </span>
              )}
            </button>

          </div>
        </div>
      </motion.header>

      {/* Drawer */}

      <AnimatePresence>

        {open && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          >

            <motion.aside
              initial={{ x: -340 }}
              animate={{ x: 0 }}
              exit={{ x: -340 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 30,
              }}
              onClick={(e) => e.stopPropagation()}
              className="fixed left-0 top-0 h-screen w-[88%] max-w-[330px] bg-[#090909] border-r border-amber-400/20 shadow-2xl flex flex-col text-white"
            >

              {/* Header */}

              <div className="px-6 py-6 border-b border-white/10">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="font-display text-3xl tracking-wide">
                      Maison
                      <span className="text-amber-400">·</span>
                      Noir
                    </h2>

                    <p className="text-[11px] uppercase tracking-[0.35em] text-white/40 mt-2">
                      Luxury Fashion
                    </p>

                  </div>

                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-full p-2 hover:bg-white/10"
                  >
                    <FiX size={22} />
                  </button>

                </div>

              </div>

              {/* User */}

              {user && (

                <div className="px-6 py-5 border-b border-white/10">

                  <p className="text-xs uppercase tracking-widest text-white/40">
                    Welcome
                  </p>

                  <h3 className="mt-1 text-lg font-semibold">
                    {user.fullName ||
                      user.displayName ||
                      user.email}
                  </h3>

                </div>

              )}

              {/* Navigation */}

              <nav className="flex-1 overflow-y-auto py-3">

                {nav.map((item) => (

                  <Link
                    key={item.label}
                    to={item.to}
                    search={item.search}
                    onClick={() => setOpen(false)}
                    className="group flex items-center justify-between px-6 py-4 hover:bg-white/5 transition"
                  >

                    <div className="flex items-center gap-4">

                      <span className="text-amber-400">
                        {item.icon}
                      </span>

                      <span className="text-[15px] tracking-wide">
                        {item.label}
                      </span>

                    </div>

                    <FiChevronRight className="opacity-40 group-hover:translate-x-1 transition" />

                  </Link>

                ))}

                <div className="my-4 border-t border-white/10" />

                <Link
                  to="/orders"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-6 py-4 hover:bg-white/5"
                >
                  <span>My Orders</span>
                  <FiChevronRight />
                </Link>

                <Link
                  to="/wishlist"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-6 py-4 hover:bg-white/5"
                >
                  <span>
                    Wishlist ({wish.count})
                  </span>

                  <FiChevronRight />
                </Link>

                <Link
                  to={user ? "/profile" : "/login"}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-6 py-4 hover:bg-white/5"
                >
                  <span>
                    {user ? "My Account" : "Sign In"}
                  </span>

                  <FiChevronRight />
                </Link>

                {user && (

                  <button
                    onClick={() => {
                      logout?.();
                      setOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-6 py-4 text-red-400 hover:bg-red-500/10"
                  >
                    <span className="flex items-center gap-3">
                      <FiLogOut />
                      Sign Out
                    </span>

                    <FiChevronRight />
                  </button>

                )}

              </nav>

              {/* Footer */}

              <div className="p-6 border-t border-white/10">

                <Link
                  to="/shop"
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 py-3 text-center font-semibold text-black hover:scale-[1.02] transition"
                >
                  Shop Collection
                </Link>

                <p className="mt-5 text-center text-xs text-white/35 tracking-widest uppercase">
                  Maison Noir © 2026
                </p>

              </div>

            </motion.aside>

          </motion.div>

        )}

      </AnimatePresence>
    </>
  );
}