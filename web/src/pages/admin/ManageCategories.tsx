import { Edit3, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

import {
  useAdminCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/useAdminCategories";
import type { AdminCategory } from "@/hooks/useAdminCategories";

export default function ManageCategories() {
  const { data: resp, isLoading } = useAdminCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", name_te: "", slug: "", color: "#0891B2", icon: "" });

  const categories = resp?.data ?? [];

  function resetForm() {
    setFormData({ name: "", name_te: "", slug: "", color: "#0891B2", icon: "" });
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(cat: AdminCategory) {
    setFormData({
      name: cat.name,
      name_te: cat.name_te || "",
      slug: cat.slug,
      color: cat.color || "#0891B2",
      icon: cat.icon || "",
    });
    setEditingId(cat.id);
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      updateCategory.mutate({ id: editingId, ...formData }, { onSuccess: resetForm });
    }
    else {
      createCategory.mutate(formData, { onSuccess: resetForm });
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl tracking-[2px] text-[var(--color-text-primary)]">
            MANAGE CATEGORIES
          </h1>
          <p className="mt-1 font-[var(--font-body)] text-sm text-[var(--color-text-muted)]">
            {categories.length}
            {" "}
            categories
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex cursor-pointer items-center gap-2 rounded-lg border-none bg-[var(--color-primary)] px-4 py-2.5 font-[var(--font-heading)] text-xs font-bold text-white transition-opacity hover:opacity-90"
        >
          <Plus size={14} />
          Add Category
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="mb-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-[var(--font-display)] text-sm uppercase tracking-[1px] text-[var(--color-text-primary)]">
              {editingId ? "EDIT CATEGORY" : "ADD CATEGORY"}
            </h3>
            <button onClick={resetForm} className="cursor-pointer border-none bg-transparent p-1 text-[var(--color-text-muted)]">
              <X size={16} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 min-[600px]:grid-cols-2">
            <input
              type="text"
              placeholder="Category Name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
            />
            <input
              type="text"
              placeholder="Telugu Name"
              value={formData.name_te}
              onChange={e => setFormData({ ...formData, name_te: e.target.value })}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 font-[var(--font-telugu)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
            />
            <input
              type="text"
              placeholder="Slug (e.g. politics)"
              value={formData.slug}
              onChange={e => setFormData({ ...formData, slug: e.target.value })}
              required
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
            />
            <div className="flex gap-3">
              <input
                type="color"
                value={formData.color}
                onChange={e => setFormData({ ...formData, color: e.target.value })}
                className="h-[42px] w-[42px] cursor-pointer rounded-lg border border-[var(--color-border)] bg-[var(--color-background)]"
              />
              <input
                type="text"
                placeholder="Icon name"
                value={formData.icon}
                onChange={e => setFormData({ ...formData, icon: e.target.value })}
                className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div className="flex gap-2 min-[600px]:col-span-2">
              <button
                type="submit"
                disabled={createCategory.isPending || updateCategory.isPending}
                className="cursor-pointer rounded-lg border-none bg-[var(--color-primary)] px-6 py-2.5 font-[var(--font-heading)] text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="cursor-pointer rounded-lg border border-[var(--color-border)] bg-transparent px-6 py-2.5 font-[var(--font-heading)] text-xs font-bold text-[var(--color-text-secondary)]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Cards */}
      {isLoading
        ? (
            <div className="flex h-40 items-center justify-center text-sm text-[var(--color-text-muted)]">Loading...</div>
          )
        : (
            <div className="grid grid-cols-1 gap-4 min-[500px]:grid-cols-2 min-[900px]:grid-cols-3">
              {categories.map(cat => (
                <div
                  key={cat.id}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg font-[var(--font-display)] text-sm font-bold text-white"
                      style={{ backgroundColor: cat.color || "#0891B2" }}
                    >
                      {cat.name.charAt(0)}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="cursor-pointer rounded-lg border-none bg-[var(--color-surface-1)] p-2 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => deleteCategory.mutate(cat.id)}
                        className="cursor-pointer rounded-lg border-none bg-[var(--color-surface-1)] p-2 text-[var(--color-text-muted)] transition-colors hover:text-red-500"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-[var(--font-heading)] text-sm font-bold text-[var(--color-text-primary)]">
                    {cat.name}
                  </h3>
                  {cat.name_te && (
                    <p className="mt-0.5 font-[var(--font-telugu)] text-xs text-[var(--color-text-muted)]">{cat.name_te}</p>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-full bg-[var(--color-surface-1)] px-2 py-0.5 font-[var(--font-mono)] text-[10px] text-[var(--color-text-muted)]">
                      {cat.slug}
                    </span>
                    {cat.video_count !== undefined && (
                      <span className="font-[var(--font-body)] text-[11px] text-[var(--color-text-muted)]">
                        {cat.video_count}
                        {" "}
                        videos
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
    </div>
  );
}
