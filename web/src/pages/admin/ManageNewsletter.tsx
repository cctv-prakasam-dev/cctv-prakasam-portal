import { Trash2 } from "lucide-react";
import { useState } from "react";

import DataTable from "@/components/admin/DataTable";
import { useAdminNewsletter, useDeleteSubscriber } from "@/hooks/useAdminNewsletter";
import type { NewsletterSubscriber } from "@/hooks/useAdminNewsletter";

export default function ManageNewsletter() {
  const [page, setPage] = useState(1);
  const { data: resp, isLoading } = useAdminNewsletter({ page, limit: 10 });
  const deleteSubscriber = useDeleteSubscriber();

  const subscribers = resp?.data?.records ?? [];
  const pagination = resp?.data?.pagination_info;

  const columns = [
    { key: "id", label: "ID" },
    {
      key: "email",
      label: "Email",
      render: (row: NewsletterSubscriber) => (
        <span className="font-medium text-[var(--color-text-primary)]">{row.email}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: NewsletterSubscriber) => (
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
          row.status === "active"
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
        }`}
        >
          {row.status || "active"}
        </span>
      ),
    },
    {
      key: "subscribed_at",
      label: "Subscribed",
      render: (row: NewsletterSubscriber) => (
        <span>{row.subscribed_at ? new Date(row.subscribed_at).toLocaleDateString() : "—"}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: NewsletterSubscriber) => (
        <button
          onClick={() => deleteSubscriber.mutate(row.id)}
          className="cursor-pointer rounded-lg border-none bg-red-50 p-2 text-red-500 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
        >
          <Trash2 size={14} />
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-[var(--font-display)] text-2xl tracking-[2px] text-[var(--color-text-primary)]">
          MANAGE NEWSLETTER
        </h1>
        <p className="mt-1 font-[var(--font-body)] text-sm text-[var(--color-text-muted)]">
          {pagination ? `${pagination.total_records} subscribers total` : "Loading..."}
        </p>
      </div>

      <DataTable columns={columns} data={subscribers} loading={isLoading} emptyMessage="No subscribers yet" />

      {pagination && pagination.total_pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={!pagination.prev_page}
            className="cursor-pointer rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 font-[var(--font-body)] text-xs text-[var(--color-text-secondary)] disabled:opacity-40"
          >
            Previous
          </button>
          <span className="font-[var(--font-body)] text-xs text-[var(--color-text-muted)]">
            Page
            {" "}
            {pagination.current_page}
            {" "}
            of
            {" "}
            {pagination.total_pages}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!pagination.next_page}
            className="cursor-pointer rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 font-[var(--font-body)] text-xs text-[var(--color-text-secondary)] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
