import { Save } from "lucide-react";
import { useEffect, useState } from "react";

import { useAdminSettings, useUpdateSetting } from "@/hooks/useAdminSettings";
import type { Setting } from "@/hooks/useAdminSettings";

export default function AdminSettings() {
  const { data: resp, isLoading } = useAdminSettings();
  const updateSetting = useUpdateSetting();
  const [editValues, setEditValues] = useState<Record<number, string>>({});

  const settings = resp?.data ?? [];

  useEffect(() => {
    if (settings.length > 0) {
      const values: Record<number, string> = {};
      settings.forEach((s: Setting) => {
        values[s.id] = s.value;
      });
      setEditValues(values);
    }
  }, [settings]);

  function handleSave(id: number) {
    const value = editValues[id];
    if (value !== undefined) {
      updateSetting.mutate({ id, value });
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-[var(--font-display)] text-2xl tracking-[2px] text-[var(--color-text-primary)]">
          SETTINGS
        </h1>
        <p className="mt-1 font-[var(--font-body)] text-sm text-[var(--color-text-muted)]">
          Configure portal settings
        </p>
      </div>

      {isLoading
        ? (
            <div className="flex h-40 items-center justify-center text-sm text-[var(--color-text-muted)]">Loading...</div>
          )
        : settings.length === 0
          ? (
              <div className="flex h-40 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm text-[var(--color-text-muted)]">
                No settings found
              </div>
            )
          : (
              <div className="space-y-3">
                {settings.map((setting: Setting) => (
                  <div
                    key={setting.id}
                    className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="rounded bg-[var(--color-surface-1)] px-2 py-0.5 font-[var(--font-mono)] text-[11px] text-[var(--color-primary)]">
                            {setting.key}
                          </span>
                        </div>
                        {setting.description && (
                          <p className="mb-3 font-[var(--font-body)] text-xs text-[var(--color-text-muted)]">
                            {setting.description}
                          </p>
                        )}
                        <textarea
                          value={editValues[setting.id] ?? setting.value}
                          onChange={e => setEditValues({ ...editValues, [setting.id]: e.target.value })}
                          rows={2}
                          className="w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 font-[var(--font-mono)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
                        />
                      </div>
                      <button
                        onClick={() => handleSave(setting.id)}
                        disabled={updateSetting.isPending}
                        className="mt-6 flex cursor-pointer items-center gap-1.5 rounded-lg border-none bg-[var(--color-primary)] px-3 py-2 font-[var(--font-heading)] text-[11px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                      >
                        <Save size={12} />
                        Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
    </div>
  );
}
