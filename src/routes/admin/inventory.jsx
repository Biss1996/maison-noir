import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Swal from "sweetalert2";
import { FiEdit2, FiX } from "react-icons/fi";

import { useProducts } from "../../hooks/useProducts";
import { useAuth } from "../../context/AppProviders";
import { updateProduct } from "../../services/productService";
export const Route = createFileRoute("/admin/inventory")({
  component: Inventory,
});

const LOW_STOCK = 3;

function Inventory() {
  const { user } = useAuth();

  const sellerId =
    user?.role === "superadmin"
      ? null
      : user?.uid;

  const { products = [] } = useProducts(sellerId);

  const [editing, setEditing] = useState(null);

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Inventory
      </h1>

      <p className="text-gray-500 mt-1">
        Manage stock levels for products.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">
                Product
              </th>

              <th className="px-4 py-3 text-left">
                Stock
              </th>

              <th className="px-4 py-3 text-left">
                Status
              </th>

              <th className="px-4 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-t"
              >
                <td className="px-4 py-3">
                  {product.name}
                </td>

                <td
                  className={`px-4 py-3 ${
                    product.stock < LOW_STOCK
                      ? "text-red-600 font-semibold"
                      : ""
                  }`}
                >
                  {product.stock || 0}
                </td>

                <td className="px-4 py-3">
                  {product.stock > 0 ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                      In Stock
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">
                      Out of Stock
                    </span>
                  )}
                </td>

                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() =>
                      setEditing(product)
                    }
                    className="rounded-lg p-2 hover:bg-gray-100"
                  >
                    <FiEdit2 />
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-gray-500"
                >
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

function StockEditor({
  product,
  onClose,
}) {
  const [stock, setStock] = useState(
    product.stock || 0
  );

  const [saving, setSaving] =
    useState(false);

  const save = async () => {
    try {
      setSaving(true);

      await updateProduct(product.id, {
        stock: Number(stock),
      });

      Swal.fire({
        icon: "success",
        title: "Stock updated",
        timer: 1200,
        showConfirmButton: false,
      });

      onClose();
    } catch (error) {
      Swal.fire(
        "Error",
        error.message,
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-xl font-semibold">
            Update Stock
          </h2>

          <button
            onClick={onClose}
            className="p-2"
          >
            <FiX />
          </button>
        </div>

        <div className="p-5">
          <p className="mb-4 font-medium">
            {product.name}
          </p>

          <input
            type="number"
            value={stock}
            onChange={(e) =>
              setStock(e.target.value)
            }
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="flex justify-end gap-2 border-t p-4">
          <button
            onClick={onClose}
            className="rounded-lg border px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-black px-5 py-2 text-white"
          >
            {saving
              ? "Saving..."
              : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}