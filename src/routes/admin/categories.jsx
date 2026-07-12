import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";
import Swal from "sweetalert2";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import {  addCategory, updateCategory, deleteCategory, slugify } from "../../services/categoryService.js";
import { firebaseReady } from "../../firebase/config.jsx";
import {useCategories} from "../../hooks/useCategories.js"

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories
});

const empty = { name: "", slug: "", description: "", image: "", active: true };

function AdminCategories() {
  const { items } = useCategories();
  const [editing, setEditing] = useState(null);

  const del = async (c) => {
    const r = await Swal.fire({
      icon: "warning",
      title: `Delete "${c.name}"?`,
      showCancelButton: true,
      confirmButtonText: "Delete"
    });
    if (!r.isConfirmed || !c.id) return;
    try {
      await removeCategory(c.id);
      Swal.fire({
        icon: "success",
        title: "Deleted",
        timer: 1200,
        showConfirmButton: false
      });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: e.message
      });
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div>
          <h1 className="font-display text-4xl">Categories</h1>
          {!firebaseReady && (
            <p className="text-xs text-amber-600 mt-1">
              Firebase not configured.
            </p>
          )}
        </div>
        <button
          onClick={() => setEditing({ ...empty })}
          disabled={!firebaseReady}
          className="btn-gold px-5 py-2.5 rounded-full flex items-center gap-2 disabled:opacity-50"
        >
          <FiPlus /> Add
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((c) => (
          <div key={c.id || c.slug} className="bg-background rounded-xl p-4 shadow-luxe">
            <img
              src={c.image}
              alt=""
              className="rounded-lg h-32 w-full object-cover bg-secondary"
            />
            <div className="mt-3 flex justify-between items-start">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">/{c.slug}</p>
              </div>
              {c.id && (
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditing({ ...c })}
                    className="p-1.5 rounded hover:bg-secondary"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button
                    onClick={() => del(c)}
                    className="p-1.5 rounded hover:bg-red-50 text-red-600"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <CategoryForm
          category={editing}
          setCategory={setEditing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function CategoryForm({ category, setCategory, onClose }) {
  const [saving, setSaving] = useState(false);
  const isNew = !category.id;

  const upd = (k, v) => setCategory((c) => ({
    ...c,
    [k]: v,
    ...(k === "name" && !c.slug ? { slug: slugify(v) } : {})
  }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { id, ...data } = category;
      data.slug = data.slug || slugify(data.name);
      if (isNew) {
        await addCategory(data);
      } else {
        await updateCategory(id, data);
      }
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Saved",
        timer: 1200,
        showConfirmButton: false
      });
      onClose();
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Save failed",
        text: e.message
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4 overflow-auto"
      onClick={onClose}
    >
      <form
        onSubmit={save}
        onClick={(e) => e.stopPropagation()}
        className="bg-background rounded-2xl max-w-lg w-full my-8 shadow-luxe"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-display text-2xl">
            {isNew ? "New Category" : `Edit: ${category.name}`}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded hover:bg-secondary"
          >
            <FiX />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <label className="text-sm block">
            Name
            <input
              required
              value={category.name}
              onChange={(e) => upd("name", e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded border"
            />
          </label>
          <label className="text-sm block">
            Slug
            <input
              value={category.slug}
              onChange={(e) => upd("slug", slugify(e.target.value))}
              className="mt-1 w-full px-3 py-2 rounded border"
            />
          </label>
          <label className="text-sm block">
            Image URL
            <input
              value={category.image}
              onChange={(e) => upd("image", e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded border"
            />
          </label>
          <label className="text-sm block">
            Description
            <textarea
              value={category.description}
              onChange={(e) => upd("description", e.target.value)}
              rows="2"
              className="mt-1 w-full px-3 py-2 rounded border"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!category.active}
              onChange={(e) => upd("active", e.target.checked)}
            />
            Active
          </label>
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full border"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-gold px-6 py-2 rounded-full font-medium disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}