import { Link } from "@tanstack/react-router";
import { FiInstagram, FiFacebook, FiTwitter, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-10 md:grid-cols-4">
        <div>
          <h3 className="font-display text-2xl">Maison<span className="text-accent">·</span>Noir</h3>
          <p className="mt-3 text-sm text-cream/70 max-w-xs">Premium fashion, curated for the modern Kenyan. Free delivery on orders over KSh 5,000.</p>
          <div className="flex gap-3 mt-5 text-cream/80">
            <a href="#" aria-label="Instagram" className="hover:text-accent"><FiInstagram size={18} /></a>
            <a href="#" aria-label="Facebook" className="hover:text-accent"><FiFacebook size={18} /></a>
            <a href="#" aria-label="Twitter" className="hover:text-accent"><FiTwitter size={18} /></a>
            <a href="mailto:hello@maisonnoir.co.ke" aria-label="Email" className="hover:text-accent"><FiMail size={18} /></a>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-accent">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li><Link to="/shop">All Products</Link></li>
            <li><Link to="/shop">New Arrivals</Link></li>
            <li><Link to="/shop">Best Sellers</Link></li>
            <li><Link to="/shop">Sale</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-accent">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/terms">Terms</Link></li>
            <li><Link to="/privacy">Privacy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-accent">Newsletter</h4>
          <p className="mt-4 text-sm text-cream/70">Get 10% off your first order.</p>
          <form className="mt-3 flex" onSubmit={(e) => e.preventDefault()}>
            <input type="email" required placeholder="you@example.com" className="flex-1 bg-white/10 px-3 py-2 rounded-l-md text-sm outline-none placeholder:text-cream/50" />
            <button className="btn-gold px-4 rounded-r-md text-sm font-medium">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-cream/60">
        © {new Date().getFullYear()} Maison Noir. All rights reserved.
      </div>
    </footer>
  );
}
