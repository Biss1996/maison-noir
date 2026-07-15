import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import Loader from "../components/ui/Loader";
import Hero from "../components/ui/Hero.jsx";
import CategoryCard from "../components/ui/CategoryCard.jsx";
import ProductCard from "../components/ui/ProductCard.jsx";
import CountdownTimer from "../components/ui/CountdownTimer.jsx";

import { useCategories } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";

import {
  FaShippingFast,
  FaLock,
  FaMedal,
  FaHeadset,
} from "react-icons/fa";

export const Route = createFileRoute("/")({ component: Home });

function Section({ eyebrow, title, children, cta }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between gap-6 mb-10">
        <div>
          {eyebrow && <p className="text-xs uppercase tracking-[0.3em] text-accent">{eyebrow}</p>}
          <h2 className="mt-2 font-display text-3xl md:text-5xl">{title}</h2>
        </div>
        {cta}
      </motion.div>
      {children}
    </section>
  );
}

function Home() {
  const {
  items: products,
  loading: productsLoading,
} = useProducts();

const {
  items: categories,
  loading: categoriesLoading,
} = useCategories();

  const featured = products.filter((p) => p.featured).slice(0, 8);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);
  const trending = products.filter((p) => p.trending).slice(0, 4);

  const flashSaleEnd = new Date(Date.now() + 1000 * 60 * 60 * 36);

if (productsLoading || categoriesLoading) {
  return <Loader />;
}

return (
  <>
    <Hero />

    {/* Trust badges - more compact */}
    <div className="border-y border-border bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs sm:text-sm">
          {[
            { i: FaShippingFast, t: "Free delivery over KSh 5,000" },
            { i: FaLock, t: "Secure M-Pesa checkout" },
            { i: FaMedal, t: "Authenticated luxury" },
            { i: FaHeadset, t: "Support 7 days a week" },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-3">
              <b.i className="text-accent" size={16} />
              <span>{b.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Categories */}
    <Section
      eyebrow="Trending in Kenya"
      title="Shop by Category"
      cta={<Link to="/shop" className="text-sm underline hover:no-underline">View all</Link>}
    >
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.length > 0 ? (
          categories.map((c, i) => (
            <CategoryCard key={c.id || c.slug} cat={c} index={i} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No categories found.
          </div>
        )}
      </div>
    </Section>

    {/* Featured */}
    <Section eyebrow="Curated" title="Featured Pieces">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4"
      >
        {featured.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </motion.div>
    </Section>

    {/* Flash sale - MINIMIZED & PROFESSIONAL */}
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl bg-ink text-cream p-6 md:p-8 lg:p-10 shadow-luxe"
      >
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          <div>
            <p className="text-accent uppercase tracking-[0.25em] text-xs">Limited Time</p>
            <h2 className="mt-2 font-display text-2xl md:text-3xl lg:text-4xl leading-tight">
              Exclusive savings on select items
            </h2>
            <p className="mt-3 text-cream/70 text-sm">
              Handpicked from our newest collections. Ends soon.
            </p>
            <Link
              to="/shop"
              className="inline-block mt-4 btn-gold px-6 py-2.5 rounded-full text-sm font-medium"
            >
              Shop Now
            </Link>
          </div>
          <div className="text-center md:text-right">
            <CountdownTimer target={flashSaleEnd} />
          </div>
        </div>
      </motion.div>
    </section>

    {/* New arrivals */}
    <Section eyebrow="Just Landed" title="New Arrivals">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4"
      >
        {newArrivals.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </motion.div>
    </Section>

    {/* Trending */}
    <Section eyebrow="Best Sellers" title="Trending Now">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4"
      >
        {trending.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </motion.div>
    </Section>

    {/* Reviews */}
    <section className="bg-secondary py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">Customer Love</p>
        <h2 className="mt-2 font-display text-3xl md:text-4xl">Words from our clients</h2>
        <div className="mt-8 md:mt-10 grid md:grid-cols-3 gap-4 md:gap-6">
          {[
            { n: "Amina W.", t: "The silk dress is breathtaking. Delivery to Nairobi was next-day. Obsessed." },
            { n: "Brian O.", t: "Best Oxford shoes I've owned. Fit is spot on and the leather is stunning." },
            { n: "Zawadi K.", t: "M-Pesa checkout was seamless. Will absolutely be back for the tote." },
          ].map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="bg-background rounded-xl p-4 md:p-6 shadow-luxe"
            >
              <div className="text-accent text-sm">★★★★★</div>
              <p className="mt-3 text-sm italic">"{r.t}"</p>
              <p className="mt-4 text-sm font-semibold">— {r.n}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Newsletter */}
    <section className="mx-auto max-w-4xl px-6 py-16 md:py-24 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl">Join The List</h2>
        <p className="mt-3 text-muted-foreground">
          Early access to drops, private sales, and 10% off your first order.
        </p>
        <form onSubmit={(e) => e.preventDefault()} className="mt-6 max-w-md mx-auto flex">
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-l-full border border-r-0 border-gray-300 bg-background outline-none focus:ring-2 focus:ring-accent/20"
          />
          <button className="btn-gold px-6 py-3 rounded-r-full font-medium">
            Subscribe
          </button>
        </form>
      </motion.div>
    </section>
  </>
);
}