interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  data,
  loading,
  emptyMessage = "No data found",
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <span className="font-[var(--font-body)] text-sm text-[var(--color-text-muted)]">Loading...</span>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-1)]">
              {columns.map(col => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-[1px] text-[var(--color-text-muted)]"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0
              ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-10 text-center font-[var(--font-body)] text-sm text-[var(--color-text-muted)]"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                )
              : (
                  data.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-[var(--color-border)] transition-colors last:border-0 hover:bg-[var(--color-surface-1)]"
                    >
                      {columns.map(col => (
                        <td
                          key={col.key}
                          className="px-4 py-3 font-[var(--font-body)] text-sm text-[var(--color-text-secondary)]"
                        >
                          {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
