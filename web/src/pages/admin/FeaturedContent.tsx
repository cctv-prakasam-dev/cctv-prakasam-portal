import { Edit3, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

import {
  useAdminFeatured,
  useCreateFeatured,
  useDeleteFeatured,
  useUpdateFeatured,
} from "@/hooks/useAdminFeatured";
import type { FeaturedContentItem } from "@/hooks/useAdminFeatured";

export default function FeaturedContent() {
  const { data: resp, isLoading } = useAdminFeatured();
  const createFeatured = useCreateFeatured();
  const updateFeatured = useUpdateFeatured();
  const deleteFeatured = useDeleteFeatured();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ type: "hero", video_id: "", title: "", sort_order: "0" });

  const items = resp?.data ?? [];

  function resetForm() {
    setFormData({ type: "hero", video_id: "", title: "", sort_order: "0" });
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(item: FeaturedContentItem) {
    setFormData({
      type: item.type,
      video_id: item.video_id ? String(item.video_id) : "",
      title: item.title || "",
      sort_order: String(item.sort_order ?? 0),
    });
    setEditingId(item.id);
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      type: formData.type,
      video_id: formData.video_id ? Number(formData.video_id) : undefined,
      title: formData.title || undefined,
      sort_order: Number(formData.sort_order),
    };
    if (editingId) {
      updateFeatured.mutate({ id: editingId, ...payload }, { onSuccess: resetForm });
    }
    else {
      createFeatured.mutate(payload, { onSuccess: resetForm });
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[var(--font-display)] text-xl tracking-[2px] text-[var(--color-text-primary)] sm:text-2xl">
            FEATURED CONTENT
          </h1>
          <p className="mt-1 font-[var(--font-body)] text-sm text-[var(--color-text-muted)]">
            Configure homepage featured sections
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex cursor-pointer items-center gap-2 rounded-lg border-none bg-[var(--color-primary)] px-4 py-2.5 font-[var(--font-heading)] text-xs font-bold text-white transition-opacity hover:opacity-90"
        >
          <Plus size={14} />
          Add Item
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-[var(--font-display)] text-sm uppercase tracking-[1px] text-[var(--color-text-primary)]">
              {editingId ? "EDIT ITEM" : "ADD ITEM"}
            </h3>
            <button onClick={resetForm} className="cursor-pointer border-none bg-transparent p-1 text-[var(--color-text-muted)]">
              <X size={16} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 min-[600px]:grid-cols-2">
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
            >
              <option value="hero">Hero</option>
              <option value="trending">Trending</option>
              <option value="banner">Banner</option>
            </select>
            <input
              type="number"
              placeholder="Video ID"
              value={formData.video_id}
              onChange={e => setFormData({ ...formData, video_id: e.target.value })}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
            />
            <input
              type="text"
              placeholder="Title (optional)"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
            />
            <input
              type="number"
              placeholder="Sort Order"
              value={formData.sort_order}
              onChange={e => setFormData({ ...formData, sort_order: e.target.value })}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
            />
            <div className="flex gap-2 min-[600px]:col-span-2">
              <button
                type="submit"
                disabled={createFeatured.isPending || updateFeatured.isPending}
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

      {/* Cards */}
      {isLoading
        ? (
            <div className="flex h-40 items-center justify-center text-sm text-[var(--color-text-muted)]">Loading...</div>
          )
        : items.length === 0
          ? (
              <div className="flex h-40 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm text-[var(--color-text-muted)]">
                No featured content configured
              </div>
            )
          : (
              <div className="grid grid-cols-1 gap-4 min-[500px]:grid-cols-2 min-[900px]:grid-cols-3">
                {items.map(item => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <span className="rounded-full bg-[var(--color-primary)]/10 px-2.5 py-1 font-[var(--font-heading)] text-[10px] font-bold uppercase text-[var(--color-primary)]">
                        {item.type}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(item)}
                          className="cursor-pointer rounded-lg border-none bg-[var(--color-surface-1)] p-2 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => deleteFeatured.mutate(item.id)}
                          className="cursor-pointer rounded-lg border-none bg-[var(--color-surface-1)] p-2 text-[var(--color-text-muted)] transition-colors hover:text-red-500"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    {item.title && (
                      <h3 className="mb-1 font-[var(--font-heading)] text-sm font-bold text-[var(--color-text-primary)]">
                        {item.title}
                      </h3>
                    )}
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                      {item.video_id && (
                        <span>
                          Video #
                          {item.video_id}
                        </span>
                      )}
                      <span>
                        Order:
                        {item.sort_order}
                      </span>
                      <span className={item.is_active ? "text-[var(--color-success)]" : "text-red-400"}>
                        {item.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
    </div>
  );
}
