import { useEffect, useState } from "react";
import { uploadImage } from "../../services/storageService";

export default function CategoryModal({
  open,
  onClose,
  onSave,
  category,
}) {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name || "",
        slug: category.slug || "",
        image: category.image || "",
      });
    } else {
      setForm({
        name: "",
        slug: "",
        image: "",
      });
    }

    setImageFile(null);
  }, [category, open]);

  async function handleSave() {
    try {
      setSaving(true);

      let image = form.image;

      if (imageFile) {
        image = await uploadImage(imageFile, "categories");
      }

      await onSave({
        ...form,
        image,
      });

      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save category.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-xl p-6 w-full max-w-lg">

        <h2 className="font-display text-2xl mb-6">
          {category ? "Edit Category" : "Add Category"}
        </h2>

        <div className="space-y-4">

          <input
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Category Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <input
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Slug"
            value={form.slug}
            onChange={(e) =>
              setForm({
                ...form,
                slug: e.target.value,
              })
            }
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />

          {(imageFile || form.image) && (
            <img
              src={
                imageFile
                  ? URL.createObjectURL(imageFile)
                  : form.image
              }
              alt="Preview"
              className="w-full h-44 object-cover rounded-lg border"
            />
          )}

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            disabled={saving}
            className="border px-5 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-gold px-5 py-2 rounded-lg disabled:opacity-50"
          >
            {saving ? "Uploading..." : "Save"}
          </button>

        </div>

      </div>
    </div>
  );
}