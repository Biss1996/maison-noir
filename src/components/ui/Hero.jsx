import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";

const heroImages = [
  "/hero/jewel1.avif",
  "/hero/shoe.avif",
  "/hero/jewel2.avif",
  "/hero/sneaker.avif",
  "/hero/maisonyellow.avif",
  "/hero/womenshoe.avif",
  "/hero/maison2.avif",
  "/hero/maison3.avif",
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative isolate min-h-[92vh] overflow-hidden flex items-center">

      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">

        <AnimatePresence mode="wait">

          <motion.img
            key={heroImages[current]}
            src={heroImages[current]}
            alt="Maison Noir"
            className="absolute inset-0 h-full w-full object-cover"
            initial={{
              opacity: 0,
              scale: 1,
              x: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1.08,
              x: -20,
            }}
            exit={{
              opacity: 0,
              scale: 1.02,
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
            }}
          />

        </AnimatePresence>

        {/* Luxury overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/35" />

        <div className="absolute inset-0 bg-black/20" />

      </div>

      {/* Floating Lights */}
      <motion.div
        className="absolute top-20 right-16 z-10 h-52 w-52 rounded-full bg-amber-400/20 blur-3xl"
        animate={{
          y: [0, -30, 0],
          opacity: [0.35, 0.8, 0.35],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
        }}
      />

      <motion.div
        className="absolute bottom-8 left-12 z-10 h-72 w-72 rounded-full bg-yellow-100/10 blur-3xl"
        animate={{
          y: [0, 25, 0],
          opacity: [0.25, 0.55, 0.25],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
        }}
      />

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-6 w-full text-white">

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .2 }}
          className="uppercase tracking-[0.35em] text-amber-300 text-xs"
        >
          Season 2026 · Curated in Nairobi
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: .35,
            duration: .9,
          }}
          className="mt-5 max-w-4xl font-display text-5xl leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Effortless{" "}
          <span className="text-amber-300">
            Luxury
          </span>
          ,
          <br />
          Delivered.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .65 }}
          className="mt-8 max-w-xl text-lg text-white/85"
        >
          Discover pieces from Kenya's most refined designers.
          Timeless silhouettes, considered materials and premium
          craftsmanship delivered to your door.
        </motion.p>

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: .9,
          }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Link
            to="/shop"
            className="btn-gold rounded-full px-8 py-4 font-semibold transition hover:scale-105"
          >
            Shop Collection
          </Link>

          <Link
            to="/shop"
            className="glass-dark rounded-full px-8 py-4 text-white transition hover:bg-white/10"
          >
            New Arrivals
          </Link>
        </motion.div>

      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-3">

        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-500 rounded-full ${
              current === index
                ? "w-10 h-2 bg-amber-300"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}

      </div>

    </section>
  );
}