import { useState } from "react";
import { Plus, Search, X } from "lucide-react";

import { useAdminUsers, useUpdateUserRole } from "@/hooks/useAdminUsers";
import type { AdminUser } from "@/hooks/useAdminUsers";
import { apiPost } from "@/lib/apiClient";
import { useQueryClient } from "@tanstack/react-query";

const ASSIGNABLE_ROLES = ["CUSTOMER", "MANAGER"];

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  MANAGER: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  CUSTOMER: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

export default function ManageUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const { data: resp, isLoading } = useAdminUsers({ page, page_size: 10 });
  const updateRole = useUpdateUserRole();

  const users = resp?.data?.records ?? [];
  const pagination = resp?.data?.pagination_info;

  // Simple client-side filter
  const filtered = search
    ? users.filter(u =>
        `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(search.toLowerCase()),
      )
    : users;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl tracking-[2px] text-[var(--color-text-primary)]">
            MANAGE USERS
          </h1>
          <p className="mt-1 font-[var(--font-body)] text-sm text-[var(--color-text-muted)]">
            {pagination ? `${pagination.total_records} users total` : "Loading..."}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex cursor-pointer items-center gap-2 rounded-lg border-none bg-[var(--color-primary)] px-4 py-2.5 font-[var(--font-heading)] text-xs font-bold text-white transition-opacity hover:opacity-90"
        >
          <Plus size={14} />
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search users by name or email..."
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] py-2.5 pr-4 pl-10 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-primary)]"
        />
      </div>

      {/* User Table */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
          <span className="font-[var(--font-body)] text-sm text-[var(--color-text-muted)]">Loading...</span>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-1)]">
                  <th className="px-4 py-3 text-left font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-[1px] text-[var(--color-text-muted)]">User</th>
                  <th className="px-4 py-3 text-left font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-[1px] text-[var(--color-text-muted)]">Email</th>
                  <th className="px-4 py-3 text-left font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-[1px] text-[var(--color-text-muted)]">Role</th>
                  <th className="px-4 py-3 text-left font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-[1px] text-[var(--color-text-muted)]">Status</th>
                  <th className="px-4 py-3 text-left font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-[1px] text-[var(--color-text-muted)]">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center font-[var(--font-body)] text-sm text-[var(--color-text-muted)]">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filtered.map((user: AdminUser) => (
                    <tr key={user.id} className="border-b border-[var(--color-border)] transition-colors last:border-0 hover:bg-[var(--color-surface-1)]">
                      {/* User info */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] font-[var(--font-heading)] text-xs font-bold text-white">
                            {(user.first_name?.[0] || "").toUpperCase()}
                            {(user.last_name?.[0] || "").toUpperCase()}
                          </div>
                          <div>
                            <div className="font-[var(--font-heading)] text-sm font-semibold text-[var(--color-text-primary)]">
                              {user.first_name}
                              {" "}
                              {user.last_name}
                            </div>
                            <div className="font-[var(--font-mono)] text-[10px] text-[var(--color-text-muted)]">
                              ID:
                              {" "}
                              {user.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3 font-[var(--font-body)] text-sm text-[var(--color-text-secondary)]">
                        {user.email}
                      </td>

                      {/* Role Dropdown */}
                      <td className="px-4 py-3">
                        {user.user_type === "ADMIN"
                          ? (
                              <span className={`inline-block rounded-lg px-2.5 py-1.5 font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-wide ${ROLE_COLORS[user.user_type]}`}>
                                {user.user_type}
                              </span>
                            )
                          : (
                              <select
                                value={user.user_type}
                                onChange={e => updateRole.mutate({ id: user.id, user_type: e.target.value })}
                                className={`cursor-pointer rounded-lg border-none px-2.5 py-1.5 font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-wide outline-none ${ROLE_COLORS[user.user_type] || ROLE_COLORS.CUSTOMER}`}
                              >
                                {ASSIGNABLE_ROLES.map(role => (
                                  <option key={role} value={role}>{role}</option>
                                ))}
                              </select>
                            )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1.5">
                          <span className={`inline-flex w-fit items-center gap-1.5 rounded-md border px-3 py-1.5 font-[var(--font-heading)] text-[11px] font-bold ${
                            user.active
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                          >
                            <span className={`inline-block h-2 w-2 rounded-full ${user.active ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" : "bg-red-500"}`} />
                            {user.active ? "Active" : "Inactive"}
                          </span>
                          {user.is_verified && (
                            <span className="inline-flex w-fit items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 font-[var(--font-heading)] text-[10px] font-bold text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-3 font-[var(--font-body)] text-xs text-[var(--color-text-muted)]">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
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

      {/* Add User Modal */}
      {showAddModal && (
        <AddUserModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}

function AddUserModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    user_type: "CUSTOMER",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiPost("/auth/register", {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      onClose();
    }
    catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Failed to create user");
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-[440px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-[var(--font-display)] text-lg tracking-[2px] text-[var(--color-text-primary)]">
            ADD USER
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg border-none bg-[var(--color-surface-1)] p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-2)]"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-[var(--font-body)] text-[13px] font-medium text-[var(--color-text-secondary)]">First Name</label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
                placeholder="First name"
              />
            </div>
            <div>
              <label className="mb-1 block font-[var(--font-body)] text-[13px] font-medium text-[var(--color-text-secondary)]">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="mb-1 block font-[var(--font-body)] text-[13px] font-medium text-[var(--color-text-secondary)]">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
              placeholder="user@example.com"
            />
          </div>

          <div className="mt-3">
            <label className="mb-1 block font-[var(--font-body)] text-[13px] font-medium text-[var(--color-text-secondary)]">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
              placeholder="Min 8 characters"
            />
          </div>

          <div className="mt-3">
            <label className="mb-1 block font-[var(--font-body)] text-[13px] font-medium text-[var(--color-text-secondary)]">Role</label>
            <select
              name="user_type"
              value={form.user_type}
              onChange={handleChange}
              className="w-full cursor-pointer rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
            >
              {ASSIGNABLE_ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer rounded-lg border border-[var(--color-border)] bg-transparent py-2.5 font-[var(--font-heading)] text-xs font-bold text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-1)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 cursor-pointer rounded-lg border-none bg-[var(--color-primary)] py-2.5 font-[var(--font-heading)] text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
