import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Swal from "sweetalert2";
import { FiEdit2, FiX, FiMinus, FiPlus } from "react-icons/fi";

import { useProducts } from "../../hooks/useProducts";
import { useAuth } from "../../context/AppProviders";
import { updateProduct } from "../../services/productService";
import { Card } from "../../components/admin/shared/Card";

export const Route = createFileRoute("/admin/inventory")({
  component: Inventory,
});

const LOW_STOCK = 3;

function Inventory() {
  const { user } = useAuth();
const { items: Products = [], loading,} = useProducts();
  const [editing, setEditing] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const totalStock = Products.reduce(
    (sum, p) => sum + (Number(p.stock) || 0),
    0
  );
  const lowStock = Products.filter(
    (p) => p.stock > 0 && p.stock <= LOW_STOCK
  ).length;
  const outOfStock = Products.filter((p) => (p.stock || 0) === 0).length;

  const handleQuickUpdate = async (productId, newStock) => {
  try {
    setUpdatingId(productId);

    await updateProduct(productId, {
      stock: Math.max(0, Number(newStock)),
    });

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Stock updated",
      timer: 1600,
      showConfirmButton: false,
      background: "#111111",
      color: "#ffffff",
    });

  } catch (error) {
    Swal.fire({
      title: "Error",
      text: error.message,
      icon: "error",
      background: "#111111",
      color: "#ffffff",
    });
  } finally {
    setUpdatingId(null);
  }
};

  // === Status Badge Component ===
  const StatusBadge = ({ stock }) => {
    if (stock === 0) return (
      <span className="rounded-full bg-red-900/30 text-red-400 px-3 py-1 text-xs">
        Out of Stock
      </span>
    );
    if (stock <= LOW_STOCK) return (
      <span className="rounded-full bg-amber-900/30 text-amber-400 px-3 py-1 text-xs">
        Low Stock
      </span>
    );
    return (
      <span className="rounded-full bg-green-900/30 text-green-400 px-3 py-1 text-xs">
        In Stock
      </span>
    );
  };

  // === Stock Controls ===
  const StockControls = ({ product }) => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleQuickUpdate(product.id, product.stock - 1)}
        disabled={updatingId === product.id || product.stock <= 0}
        className="rounded-lg p-1.5 hover:bg-amber-400/10 disabled:opacity-50"
      >
        <FiMinus className="text-amber-400" />
      </button>
      <span className={`font-medium ${product.stock < LOW_STOCK ? "text-red-400" : "text-white"}`}>
        {product.stock || 0}
      </span>
      <button
        onClick={() => handleQuickUpdate(product.id, product.stock + 1)}
        disabled={updatingId === product.id}
        className="rounded-lg p-1.5 hover:bg-amber-400/10 disabled:opacity-50"
      >
        <FiPlus className="text-amber-400" />
      </button>
    </div>
  );

  // === Product Row (reused) ===
  const ProductRow = ({ product }) => (
    <>
      <img
        src={product.images?.[0] || product.image || "/placeholder.png"}
        className="h-14 w-14 rounded-lg object-cover border border-amber-400/20"
      />
      <div>
        <p className="font-medium">{product.name}</p>
        <p className="text-xs text-gray-400">{product.brand}</p>
      </div>
    </>
  );

  return (
    <div className="p-4 md:p-6 text-white min-h-screen">
      <h1 className="text-3xl text-amber-300 font-bold">Inventory</h1>
      <p className="text-gray-700 font-bold mt-1">Manage your stock and availability.</p>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <Card title="Products" value={Products.length} />
        <Card title="Total Stock" value={totalStock} />
        <Card title="Low Stock" value={lowStock} />
        <Card title="Out of Stock" value={outOfStock} />
      </div>

      {/* ===== MOBILE CARDS VIEW ===== */}
      <div className="lg:hidden mt-6 space-y-4">
        {Products.map((product) => (
          <div key={product.id} className="rounded-xl border border-amber-400/20 bg-[#111111] p-4">
            <div className="flex items-center gap-4">
              <ProductRow product={product} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Stock:</span>
                <StockControls product={product} />
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge stock={product.stock} />
                <button
                  onClick={() => setEditing(product)}
                  className="rounded-lg p-2 hover:bg-amber-400/10"
                >
                  <FiEdit2 className="text-amber-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {Products.length === 0 && (
          <p className="text-center text-gray-400 py-8">No inventory found.</p>
        )}
      </div>

      {/* ===== DESKTOP TABLE VIEW ===== */}
      <div className="hidden lg:block mt-6 overflow-x-auto rounded-xl border border-amber-400/20 bg-[#111111]">
        <table className="w-full min-w-[700px]">
          <thead className="bg-[#1a1a1a]">
            <tr>
              <th className="px-4 py-3 text-left text-sm text-gray-400">Product</th>
              <th className="px-4 py-3 text-left text-sm text-gray-400">Stock</th>
              <th className="px-4 py-3 text-left text-sm text-gray-400">Status</th>
              <th className="px-4 py-3 text-right text-sm text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Products.map((product) => (
              <tr key={product.id} className="border-t border-amber-400/10">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-4">
                    <ProductRow product={product} />
                  </div>
                </td>
                <td className="px-4 py-3"><StockControls product={product} /></td>
                <td className="px-4 py-3"><StatusBadge stock={product.stock} /></td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setEditing(product)}
                    className="rounded-lg p-2 hover:bg-amber-400/10"
                  >
                    <FiEdit2 className="text-amber-400" />
                  </button>
                </td>
              </tr>
            ))}
            {Products.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                  No inventory found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <StockEditor
  product={editing}
  onClose={() => setEditing(null)}
/>
      )}
    </div>
  );
}

function StockEditor({ product, onClose, onUpdate }) {
  const [stock, setStock] = useState(product.stock || 0);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    try {
      setSaving(true);
      await updateProduct(product.id, { stock: Number(stock) });
      Swal.fire({
        icon: "success",
        title: "Stock updated",
        timer: 1200,
        showConfirmButton: false,
        background: "#111111",
        color: "white",
      });
      if (onUpdate) await onUpdate();
      onClose();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        background: "#111111",
        color: "white",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-[#111111] border border-amber-400/20 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-amber-400/20 p-5">
          <h2 className="text-xl font-semibold">Update Stock</h2>
          <button onClick={onClose} className="p-2 hover:bg-amber-400/10 rounded-lg">
            <FiX className="text-amber-400" />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={product.images?.[0] || product.image || "/placeholder.png"}
              className="h-16 w-16 rounded-lg object-cover border border-amber-400/20"
            />
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-xs text-gray-400">{product.brand}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-2">Current Stock</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setStock(Math.max(0, stock - 1))}
                disabled={stock <= 0}
                className="rounded-lg p-3 bg-amber-400/10 hover:bg-amber-400/20 disabled:opacity-50"
              >
                <FiMinus className="text-amber-400 text-xl" />
              </button>
              <span className="text-3xl font-bold min-w-[60px] text-center">{stock}</span>
              <button
                onClick={() => setStock(stock + 1)}
                className="rounded-lg p-3 bg-amber-400/10 hover:bg-amber-400/20"
              >
                <FiPlus className="text-amber-400 text-xl" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-amber-400/20 p-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-amber-400/30 px-5 py-2 text-amber-400 hover:bg-amber-400/10"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-amber-400 px-5 py-2 text-black font-medium hover:bg-amber-300 disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}