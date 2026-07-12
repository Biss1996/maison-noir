import { useEffect } from "react";
import ProductForm from "./ProductForm";

export default function ProductDialog({
  open,
  title = "Product",
  initialData,
  categories = [],
  loading = false,
  onClose,
  onSubmit,
}) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () =>
      window.removeEventListener(
        "keydown",
        handleEscape
      );
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b p-6">

          <h2 className="text-2xl font-semibold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-3xl leading-none"
          >
            ×
          </button>

        </div>

        <div className="p-6">

          <ProductForm
            initialData={initialData}
            categories={categories}
            loading={loading}
            onSubmit={onSubmit}
          />

        </div>

      </div>

    </div>
  );
}