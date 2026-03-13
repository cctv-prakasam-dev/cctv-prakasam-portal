import { useState } from "react";

import DataTable from "@/components/admin/DataTable";
import { useAdminUsers, useUpdateUserRole } from "@/hooks/useAdminUsers";
import type { AdminUser } from "@/hooks/useAdminUsers";

const ROLES = ["CUSTOMER", "ADMIN", "SUPER_ADMIN"];

export default function ManageUsers() {
  const [page, setPage] = useState(1);
  const { data: resp, isLoading } = useAdminUsers({ page, page_size: 10 });
  const updateRole = useUpdateUserRole();

  const users = resp?.data?.records ?? [];
  const pagination = resp?.data?.pagination_info;

  const columns = [
    { key: "id", label: "ID" },
    {
      key: "name",
      label: "Name",
      render: (row: AdminUser) => (
        <span className="font-medium text-[var(--color-text-primary)]">
          {row.first_name}
          {" "}
          {row.last_name}
        </span>
      ),
    },
    { key: "email", label: "Email" },
    {
      key: "user_type",
      label: "Role",
      render: (row: AdminUser) => (
        <select
          value={row.user_type}
          onChange={e => updateRole.mutate({ id: row.id, role: e.target.value })}
          className="cursor-pointer rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-1.5 font-[var(--font-body)] text-xs text-[var(--color-text-secondary)] outline-none"
        >
          {ROLES.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      ),
    },
    {
      key: "active",
      label: "Status",
      render: (row: AdminUser) => (
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
          row.active
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        }`}
        >
          {row.active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "is_verified",
      label: "Verified",
      render: (row: AdminUser) => (
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
          row.is_verified
            ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400"
            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
        }`}
        >
          {row.is_verified ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Joined",
      render: (row: AdminUser) => (
        <span>{row.created_at ? new Date(row.created_at).toLocaleDateString() : "—"}</span>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-[var(--font-display)] text-2xl tracking-[2px] text-[var(--color-text-primary)]">
          MANAGE USERS
        </h1>
        <p className="mt-1 font-[var(--font-body)] text-sm text-[var(--color-text-muted)]">
          {pagination ? `${pagination.total_records} users total` : "Loading..."}
        </p>
      </div>

      <DataTable columns={columns} data={users} loading={isLoading} emptyMessage="No users found" />

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
