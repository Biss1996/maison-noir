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
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
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

      {/* Trust badges */}
      <div className="border-y border-border bg-cream">
        <div className="mx-auto max-w-7xl px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          {[
            { i: FaShippingFast, t: "Free delivery over KSh 5,000" },
            { i: FaLock, t: "Secure M-Pesa checkout" },
            { i: FaMedal, t: "Authenticated luxury" },
            { i: FaHeadset, t: "Support 7 days a week" },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-3">
              <b.i className="text-accent" size={20} /><span>{b.t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <Section eyebrow="Trending in Kenya" title="Shop by Category" cta={<Link to="/shop" className="text-sm underline">View all</Link>}>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {categories.length > 0 ? (
    categories.map((c, i) => (
      <CategoryCard
        key={c.id || c.slug}
        cat={c}
        index={i}
      />
    ))
  ) : (
    <div className="col-span-full text-center py-12 text-muted-foreground">
      No categories found.
    </div>
  )}
</div>
      </Section>

      {/* Featured */}
      <Section eyebrow="Curated" title="Featured Pieces">
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </Section>

      {/* Flash sale */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl bg-ink text-cream p-10 md:p-16 relative overflow-hidden shadow-luxe">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-accent blur-3xl" />
          </div>
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-accent uppercase tracking-[0.3em] text-xs">Flash Sale</p>
              <h2 className="mt-3 font-display text-4xl md:text-6xl leading-tight">Up to <span className="text-accent">40% off</span> selected pieces</h2>
              <p className="mt-4 text-cream/70">Ends soon. Handpicked from the newest collections.</p>
              <Link to="/shop" className="inline-block mt-6 btn-gold px-8 py-3 rounded-full font-medium">Shop the Sale</Link>
            </div>
            <div><CountdownTimer target={flashSaleEnd} /></div>
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <Section eyebrow="Just Landed" title="New Arrivals">
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </Section>

      {/* Trending / Best sellers */}
      <Section eyebrow="Best Sellers" title="Trending Now">
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
          {trending.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </Section>

      {/* Reviews */}
      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Customer Love</p>
          <h2 className="mt-2 font-display text-4xl">Words from our clients</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              { n: "Amina W.", t: "The silk dress is breathtaking. Delivery to Nairobi was next-day. Obsessed." },
              { n: "Brian O.", t: "Best Oxford shoes I've owned. Fit is spot on and the leather is stunning." },
              { n: "Zawadi K.", t: "M-Pesa checkout was seamless. Will absolutely be back for the tote." },
            ].map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-background rounded-2xl p-6 shadow-luxe">
                <div className="text-accent">★★★★★</div>
                <p className="mt-3 text-sm italic">"{r.t}"</p>
                <p className="mt-4 text-sm font-semibold">— {r.n}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="font-display text-4xl md:text-5xl">Join The List</h2>
        <p className="mt-3 text-muted-foreground">Early access to drops, private sales, and 10% off your first order.</p>
        <form onSubmit={(e) => e.preventDefault()} className="mt-6 max-w-md mx-auto flex">
          <input type="email" required placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-l-full border border-r-0 bg-background outline-none" />
          <button className="btn-gold px-6 py-3 rounded-r-full font-medium">Subscribe</button>
        </form>
      </section>
    </>
  );
}
