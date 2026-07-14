import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import Swal from "sweetalert2";
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiUpload, FiImage, FiSearch
} from "react-icons/fi";
import { formatKES} from "../../utils/currency.js";
import {
  addProduct, updateProduct, deleteProduct
} from "../../services/productService.js";
import { useCategories } from "../../hooks/useCategories.js";
import { useProducts } from "../../hooks/useProducts.js";
import { firebaseReady } from "../../firebase/config.jsx";
import { useAuth } from "../../context/AppProviders.jsx";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts
});

function AdminProducts() {
  const { user } = useAuth();
  const sellerId = user?.role === "superadmin" ? null : user?.id;
  const { items } = useProducts(sellerId);
  const { items: categories } = useCategories();
  const [editing, setEditing] = useState(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  const close = () => setEditing(null);
  const openNew = () => setEditing({ colors: [], sizes: [] });
  const openEdit = (p) => setEditing(JSON.parse(JSON.stringify(p)));

  const filtered = useMemo(() => items.filter((p) => {
    if (cat && p.category !== cat) return false;
    if (q && !`${p.name} ${p.brand} ${p.sku}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [items, q, cat]);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-4xl">Products</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your storefront. Images are set via URLs (no uploads).
          </p>
          {!firebaseReady && (
            <p className="text-xs text-amber-600 mt-1">
              Firebase not configured — CRUD is disabled. Add VITE_FIREBASE_* env vars to enable.
            </p>
          )}
        </div>
        <button
          onClick={openNew}
          disabled={!firebaseReady}
          className="btn-gold px-5 py-2.5 rounded-full flex items-center gap-2 disabled:opacity-50"
        >
          <FiPlus /> Add Product
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex-1 min-w-[200px] relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border bg-background text-sm"
          />
        </div>
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="px-4 py-2.5 rounded-full border bg-background text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-background rounded-xl shadow-luxe overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-secondary text-left">
            <tr>
              {["Product", "Brand", "Category", "Price", "Stock", "Status", ""].map((h) => (
                <th key={h} className="px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-16 text-center text-muted-foreground">
                  No products yet.{" "}
                  <button
                    onClick={openNew}
                    disabled={!firebaseReady}
                    className="text-accent underline"
                  >
                    Add your first product
                  </button>.
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const stock = p.stock || 0;
                return (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3">{p.brand}</td>
                    <td className="px-4 py-3">{p.category}</td>
                    <td className="px-4 py-3">{formatKES(p.price)}</td>
                    <td className="px-4 py-3">{stock}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {stock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 rounded hover:bg-secondary"
                        >
                          <FiEdit2 className="text-sm" />
                        </button>
                        <button
                          onClick={async () => {
                            if (await Swal.fire({
                              title: "Delete product?",
                              text: "This action cannot be undone.",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Delete",
                              confirmButtonColor: "#ef4444"
                            }).then((r) => r.isConfirmed)) {
                              await deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 rounded hover:bg-secondary text-red-500"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <ProductForm
          product={editing}
          onClose={close}
          setProduct={setEditing}
          categories={categories}
          seller={user}
        />
      )}
    </div>
  );
}

function ImageUrlList({ urls, onChange }) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...(urls || []), v]);
    setDraft("");
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {(urls || []).map((im, i) => (
          <div key={i} className="relative group">
            <img src={im} alt="" className="h-16 w-16 object-cover rounded border" />
            <button
              type="button"
              onClick={() => onChange(urls.filter((_, ix) => ix !== i))}
              className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full h-5 w-5 grid place-items-center text-xs"
            >
              ×
            </button>
          </div>
        ))}
        {(!urls || urls.length === 0) && (
          <div className="h-16 w-16 rounded border-2 border-dashed grid place-items-center text-muted-foreground">
            <FiImage />
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Paste image URL"
          className="flex-1 px-3 py-1.5 rounded border text-xs"
        />
        <button type="button" onClick={add} className="px-3 py-1.5 rounded-full border text-xs">
          Add
        </button>
      </div>
    </div>
  );
}

function ProductForm({ product, setProduct, onClose, categories, seller }) {
  const [saving, setSaving] = useState(false);
  const isNew = !product.id;

  const upd = (k, v) => setProduct((p) => ({ ...p, [k]: v }));

  const updColor = (i, k, v) => setProduct((p) => {
    const colors = [...p.colors];
    colors[i] = { ...colors[i], [k]: v };
    return { ...p, colors };
  });

  const addColor = () => setProduct((p) => ({
    ...p,
    colors: [...p.colors, { name: "New", hex: "#000000", stock: 0, images: [] }]
  }));

  const removeColor = (i) => setProduct((p) => ({
    ...p,
    colors: p.colors.filter((_, ix) => ix !== i)
  }));

  const updSize = (i, k, v) => setProduct((p) => {
    const sizes = [...p.sizes];
    sizes[i] = { ...sizes[i], [k]: v };
    return { ...p, sizes };
  });

  const addSize = () => setProduct((p) => ({
    ...p,
    sizes: [...p.sizes, { label: "M", stock: 0 }]
  }));

  const removeSize = (i) => setProduct((p) => ({
    ...p,
    sizes: p.sizes.filter((_, ix) => ix !== i)
  }));

  const uploadImages = async (colorIdx, files) => {
    if (!files?.length) return;
    try {
      const uploaded = await Promise.all(
        Array.from(files).map((f) => uploadProductImage(f, product.sku || "misc"))
      );
      setProduct((p) => {
        const colors = [...p.colors];
        colors[colorIdx] = {
          ...colors[colorIdx],
          images: [...(colors[colorIdx].images || []), ...uploaded.map((u) => u.url)]
        };
        return { ...p, colors };
      });
    } catch (e) {
      Swal.fire({ icon: "error", title: "Upload failed", text: e.message });
    }
  };

  const removeImage = (colorIdx, imgIdx) => {
    setProduct((p) => {
      const colors = [...p.colors];
      colors[colorIdx] = {
        ...colors[colorIdx],
        images: colors[colorIdx].images.filter((_, i) => i !== imgIdx)
      };
      return { ...p, colors };
    });
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { id, ...data } = product;
      data.price = Number(data.price) || 0;
      data.discount = Number(data.discount) || 0;
      data.rating = Number(data.rating) || 0;
      data.reviewsCount = Number(data.reviewsCount) || 0;
      data.colors = data.colors.map((c) => ({
        ...c,
        stock: Number(c.stock) || 0,
        images: c.images || []
      }));
      data.sizes = data.sizes.map((s) => ({
        ...s,
        stock: Number(s.stock) || 0
      }));

      if (isNew) {
        await addProduct(data, seller);
      } else {
        await updateProduct(id, data);
      }

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: isNew ? "Product added" : "Product updated",
        showConfirmButton: false,
        timer: 1400
      });
      onClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background z-10 p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg">
            {isNew ? "Add Product" : "Edit Product"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded hover:bg-secondary"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={save} className="p-4 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block text-sm">
              Name
              <input
                required
                value={product.name}
                onChange={(e) => upd("name", e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded border"
              />
            </label>
            <label className="block text-sm">
              Brand
              <input
                value={product.brand}
                onChange={(e) => upd("brand", e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded border"
              />
            </label>
            <label className="block text-sm">
              SKU
              <input
                value={product.sku}
                onChange={(e) => upd("sku", e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded border"
              />
            </label>
            <label className="block text-sm">
              Material
              <input
                value={product.material}
                onChange={(e) => upd("material", e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded border"
              />
            </label>
            <label className="block text-sm">
              Category
              <select
                value={product.category}
                onChange={(e) => upd("category", e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded border bg-background"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Gender
              <select
                value={product.gender || ""}
                onChange={(e) => upd("gender", e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded border bg-background"
              >
                <option value="">Any</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </select>
            </label>
          </div>

          <label className="block text-sm">
            Description
            <textarea
              rows="3"
              value={product.description}
              onChange={(e) => upd("description", e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded border"
            />
          </label>

          <div className="grid sm:grid-cols-3 gap-4">
            <label className="block text-sm">
              Price (KES)
              <input
                type="number"
                value={product.price}
                onChange={(e) => upd("price", e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded border"
              />
            </label>
            <label className="block text-sm">
              Discount (%)
              <input
                type="number"
                value={product.discount}
                onChange={(e) => upd("discount", e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded border"
              />
            </label>
            <label className="block text-sm">
              Rating
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={product.rating}
                onChange={(e) => upd("rating", e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded border"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!product.featured}
                onChange={(e) => upd("featured", e.target.checked)}
              />
              Featured
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!product.trending}
                onChange={(e) => upd("trending", e.target.checked)}
              />
              Trending
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!product.newArrival}
                onChange={(e) => upd("newArrival", e.target.checked)}
              />
              New arrival
            </label>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-sm">Colors & images</h3>
              <button
                type="button"
                onClick={addColor}
                className="text-xs text-accent"
              >
                + Add color
              </button>
            </div>
            <div className="space-y-3">
              {product.colors?.map((c, i) => (
                <div key={i} className="border rounded-lg p-3 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-center">
                    <input
                      placeholder="Name"
                      value={c.name}
                      onChange={(e) => updColor(i, "name", e.target.value)}
                      className="px-2 py-1.5 rounded border text-sm"
                    />
                    {/* <input
                      type="color"
                      value={c.hex}
                      onChange={(e) => updColor(i, "hex", e.target.value)}
                      className="h-9 w-full rounded border"
                    /> */}
                    <input
                      placeholder="Stock"
                      type="number"
                      value={c.stock}
                      onChange={(e) => updColor(i, "stock", e.target.value)}
                      className="px-2 py-1.5 rounded border text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeColor(i)}
                      className="text-red-600 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    {c.images?.map((im, ii) => (
                      <div key={ii} className="relative">
                        <img
                          src={im}
                          alt=""
                          className="h-16 w-16 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i, ii)}
                          className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full h-5 w-5 grid place-items-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {/* <label className={`h-16 w-16 rounded border-2 border-dashed grid place-items-center cursor-pointer hover:border-accent ${
                      !firebaseReady ? "opacity-40" : ""
                    }`}>
                      <FiUpload />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        disabled={!firebaseReady}
                        onChange={(e) => uploadImages(i, e.target.files)}
                      />
                    </label> */}
                  </div>
                  <ImageUrlList
                    urls={c.images}
                    onChange={(urls) => updColor(i, "images", urls)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-sm">Sizes</h3>
              <button
                type="button"
                onClick={addSize}
                className="text-xs text-accent"
              >
                + Add size
              </button>
            </div>
            <div className="space-y-2">
              {product.sizes?.map((s, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    placeholder="Label"
                    value={s.label}
                    onChange={(e) => updSize(i, "label", e.target.value)}
                    className="px-2 py-1.5 rounded border text-sm flex-1"
                  />
                  <input
                    placeholder="Stock"
                    type="number"
                    value={s.stock}
                    onChange={(e) => updSize(i, "stock", e.target.value)}
                    className="px-2 py-1.5 rounded border text-sm w-24"
                  />
                  <button
                    type="button"
                    onClick={() => removeSize(i)}
                    className="text-red-600 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-gold px-6 py-2 rounded-full text-sm disabled:opacity-60"
            >
              {saving ? "Saving..." : isNew ? "Add Product" : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}