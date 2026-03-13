import { Edit3, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

import {
  useAdminBreakingNews,
  useCreateBreakingNews,
  useDeleteBreakingNews,
  useUpdateBreakingNews,
} from "@/hooks/useAdminBreakingNews";
import type { BreakingNewsItem } from "@/hooks/useAdminBreakingNews";

export default function ManageBreakingNews() {
  const { data: resp, isLoading } = useAdminBreakingNews();
  const createItem = useCreateBreakingNews();
  const updateItem = useUpdateBreakingNews();
  const deleteItem = useDeleteBreakingNews();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ text: "", text_te: "" });

  const items = resp?.data ?? [];

  function resetForm() {
    setFormData({ text: "", text_te: "" });
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(item: BreakingNewsItem) {
    setFormData({ text: item.text, text_te: item.text_te || "" });
    setEditingId(item.id);
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      updateItem.mutate({ id: editingId, ...formData }, { onSuccess: resetForm });
    }
    else {
      createItem.mutate(formData, { onSuccess: resetForm });
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl tracking-[2px] text-[var(--color-text-primary)]">
            BREAKING NEWS
          </h1>
          <p className="mt-1 font-[var(--font-body)] text-sm text-[var(--color-text-muted)]">
            Manage ticker items displayed on the website
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex cursor-pointer items-center gap-2 rounded-lg border-none bg-[var(--color-primary)] px-4 py-2.5 font-[var(--font-heading)] text-xs font-bold text-white transition-opacity hover:opacity-90"
        >
          <Plus size={14} />
          Add News
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-[var(--font-display)] text-sm uppercase tracking-[1px] text-[var(--color-text-primary)]">
              {editingId ? "EDIT BREAKING NEWS" : "ADD BREAKING NEWS"}
            </h3>
            <button onClick={resetForm} className="cursor-pointer border-none bg-transparent p-1 text-[var(--color-text-muted)]">
              <X size={16} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Breaking news text (English)"
              value={formData.text}
              onChange={e => setFormData({ ...formData, text: e.target.value })}
              required
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
            />
            <input
              type="text"
              placeholder="బ్రేకింగ్ న్యూస్ (Telugu)"
              value={formData.text_te}
              onChange={e => setFormData({ ...formData, text_te: e.target.value })}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 font-[var(--font-telugu)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={createItem.isPending || updateItem.isPending}
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

      {/* List */}
      {isLoading
        ? (
            <div className="flex h-40 items-center justify-center text-sm text-[var(--color-text-muted)]">Loading...</div>
          )
        : items.length === 0
          ? (
              <div className="flex h-40 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm text-[var(--color-text-muted)]">
                No breaking news items
              </div>
            )
          : (
              <div className="space-y-3">
                {items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm"
                  >
                    <div className="flex-1">
                      <p className="font-[var(--font-body)] text-sm text-[var(--color-text-primary)]">{item.text}</p>
                      {item.text_te && (
                        <p className="mt-0.5 font-[var(--font-telugu)] text-xs text-[var(--color-text-muted)]">{item.text_te}</p>
                      )}
                    </div>
                    <div className="ml-4 flex items-center gap-1">
                      <span className={`mr-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.is_active
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
                      }`}
                      >
                        {item.is_active ? "Active" : "Inactive"}
                      </span>
                      <button
                        onClick={() => handleEdit(item)}
                        className="cursor-pointer rounded-lg border-none bg-[var(--color-surface-1)] p-2 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => deleteItem.mutate(item.id)}
                        className="cursor-pointer rounded-lg border-none bg-[var(--color-surface-1)] p-2 text-[var(--color-text-muted)] transition-colors hover:text-red-500"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
    </div>
  );
}
