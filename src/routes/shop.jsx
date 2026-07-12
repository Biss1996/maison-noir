import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../components/ui/ProductCard.jsx";
import { useCategories } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";
import { FiSearch } from "react-icons/fi";

export const Route = createFileRoute("/shop")({
  component: Shop,
  validateSearch: (s) => ({
    category: typeof s.category === "string" ? s.category : undefined,
    sort: typeof s.sort === "string" ? s.sort : undefined,
  }),
});

function Shop() {
  const search = useSearch({ from: "/shop" });
  const { items: products, loading: productsLoading } = useProducts();
const { items: categories, loading: categoriesLoading } = useCategories();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(search.category || "all");
  const [maxPrice, setMaxPrice] = useState(25000);
  const [sort, setSort] = useState(search.sort || "featured");

  const filtered = useMemo(() => {
    let list = products.filter((p) =>
      (cat === "all" || p.category === cat) &&
      p.price <= maxPrice &&
      (q === "" || p.name.toLowerCase().includes(q.toLowerCase()) || (p.brand || "").toLowerCase().includes(q.toLowerCase()))
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "new") list = [...list].sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
    if (sort === "rating") list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return list;
  }, [q, cat, maxPrice, sort, products]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl">Shop</h1>
        <p className="text-muted-foreground mt-2">{filtered.length} products</p>
      </motion.div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="space-y-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="w-full pl-10 pr-3 py-2.5 rounded-full border bg-background outline-none" />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Category</h4>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2"><input type="radio" name="cat" checked={cat === "all"} onChange={() => setCat("all")} /> All</label>
              {categories.map((c) => (
                <label key={c.slug} className="flex items-center gap-2"><input type="radio" name="cat" checked={cat === c.slug} onChange={() => setCat(c.slug)} /> {c.name}</label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Max price: KSh {maxPrice.toLocaleString()}</h4>
            <input type="range" min={1000} max={25000} step={500} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-accent" />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Sort by</h4>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full px-3 py-2 rounded-md border bg-background">
              <option value="featured">Featured</option>
              <option value="new">Newest</option>
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </aside>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          {filtered.length === 0 && <p className="col-span-full text-center py-20 text-muted-foreground">No products match your filters.</p>}
        </div>
      </div>
    </div>
  );
}
