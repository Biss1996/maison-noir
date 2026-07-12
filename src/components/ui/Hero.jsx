import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[92vh] flex items-center">
      <div className="absolute inset-0 -z-10">
        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=80" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/40" />
      </div>

      <motion.div className="absolute top-24 right-10 h-40 w-40 rounded-full bg-accent/30 blur-3xl animate-float-slow" />
      <motion.div className="absolute bottom-20 left-10 h-56 w-56 rounded-full bg-beige/40 blur-3xl animate-float-slow" style={{ animationDelay: "1.5s" }} />

      <div className="relative mx-auto max-w-7xl px-6 text-cream">
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-xs uppercase tracking-[0.35em] text-accent"
        >
          Season 2026 · Curated in Nairobi
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.9 }}
          className="mt-4 font-display text-5xl sm:text-7xl md:text-8xl leading-[0.95] max-w-3xl"
        >
          Effortless <em className="text-accent not-italic">Luxury</em>,<br /> Delivered.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="mt-6 max-w-lg text-cream/80 text-lg"
        >
          Discover pieces from Kenya's most refined designers. Timeless silhouettes, considered materials, delivered to your door.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
          className="mt-9 flex flex-wrap gap-3"
        >
          <Link to="/shop" className="btn-gold px-8 py-3.5 rounded-full font-medium">Shop Now</Link>
          <Link to="/shop" className="px-8 py-3.5 rounded-full font-medium glass-dark text-cream">New Arrivals</Link>
        </motion.div>
      </div>
    </section>
  );
}
