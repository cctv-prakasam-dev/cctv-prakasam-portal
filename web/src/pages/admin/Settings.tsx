import { ChevronDown, ChevronRight, Globe, Mail, Palette, Save, Settings2, Share2, Youtube } from "lucide-react";
import { useEffect, useState } from "react";

import { useAdminSettings, useUpdateSetting } from "@/hooks/useAdminSettings";
import type { Setting } from "@/hooks/useAdminSettings";

interface SettingGroup {
  id: string;
  title: string;
  icon: typeof Youtube;
  color: string;
  prefixes: string[];
}

const SETTING_GROUPS: SettingGroup[] = [
  { id: "youtube", title: "YouTube & API", icon: Youtube, color: "#DC2626", prefixes: ["youtube", "live_stream", "channel"] },
  { id: "seo", title: "SEO & Meta", icon: Globe, color: "#0891B2", prefixes: ["seo", "google", "meta", "analytics"] },
  { id: "contact", title: "Contact Info", icon: Mail, color: "#059669", prefixes: ["contact", "phone", "email", "address"] },
  { id: "social", title: "Social Media", icon: Share2, color: "#6D28D9", prefixes: ["social", "facebook", "twitter", "instagram"] },
  { id: "theme", title: "Appearance", icon: Palette, color: "#D97706", prefixes: ["theme", "primary", "site_name", "site_tagline", "branding", "logo"] },
];

function matchesGroup(key: string, group: SettingGroup): boolean {
  const lower = key.toLowerCase();
  return group.prefixes.some(p => lower.includes(p));
}

function groupSettings(settings: Setting[]): { group: SettingGroup; items: Setting[] }[] {
  const grouped: Map<string, Setting[]> = new Map();
  const ungrouped: Setting[] = [];

  for (const s of settings) {
    let matched = false;
    for (const g of SETTING_GROUPS) {
      if (matchesGroup(s.key, g)) {
        const list = grouped.get(g.id) ?? [];
        list.push(s);
        grouped.set(g.id, list);
        matched = true;
        break;
      }
    }
    if (!matched) {
      ungrouped.push(s);
    }
  }

  const result = SETTING_GROUPS
    .filter(g => grouped.has(g.id))
    .map(g => ({ group: g, items: grouped.get(g.id)! }));

  if (ungrouped.length > 0) {
    result.push({
      group: { id: "general", title: "General", icon: Settings2, color: "#64748B", prefixes: [] },
      items: ungrouped,
    });
  }

  return result;
}

export default function AdminSettings() {
  const { data: resp, isLoading } = useAdminSettings();
  const updateSetting = useUpdateSetting();
  const [editValues, setEditValues] = useState<Record<number, string>>({});
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const settings = resp?.data ?? [];
  const groups = groupSettings(settings);

  useEffect(() => {
    if (settings.length > 0) {
      const values: Record<number, string> = {};
      settings.forEach((s: Setting) => {
        values[s.id] = s.value;
      });
      setEditValues(values);
      // Open all sections by default
      setOpenSections(new Set(groups.map(g => g.group.id)));
    }
  }, [settings]);

  function toggleSection(id: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      }
      else {
        next.add(id);
      }
      return next;
    });
  }

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
          Configure portal settings by category
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
              <div className="space-y-4">
                {groups.map(({ group, items }) => {
                  const Icon = group.icon;
                  const isOpen = openSections.has(group.id);

                  return (
                    <div
                      key={group.id}
                      className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm"
                      style={{ borderTopWidth: 3, borderTopColor: group.color }}
                    >
                      {/* Group Header */}
                      <button
                        onClick={() => toggleSection(group.id)}
                        className="flex w-full cursor-pointer items-center gap-3 border-none bg-transparent px-5 py-4 text-left"
                      >
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${group.color}15`, color: group.color }}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-[var(--font-display)] text-[15px] tracking-[1px] text-[var(--color-text-primary)]">
                            {group.title}
                          </h3>
                          <span className="font-[var(--font-body)] text-[11px] text-[var(--color-text-muted)]">
                            {items.length}
                            {" "}
                            setting
                            {items.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        {isOpen
                          ? <ChevronDown size={16} className="text-[var(--color-text-muted)]" />
                          : <ChevronRight size={16} className="text-[var(--color-text-muted)]" />}
                      </button>

                      {/* Group Settings */}
                      {isOpen && (
                        <div className="border-t border-[var(--color-border)] px-5 pb-4">
                          {items.map(setting => (
                            <div key={setting.id} className="mt-4">
                              <div className="mb-1 flex items-center gap-2">
                                <span className="rounded bg-[var(--color-surface-1)] px-2 py-0.5 font-[var(--font-mono)] text-[11px] text-[var(--color-primary)]">
                                  {setting.key}
                                </span>
                              </div>
                              {setting.description && (
                                <p className="mb-2 font-[var(--font-body)] text-xs text-[var(--color-text-muted)]">
                                  {setting.description}
                                </p>
                              )}
                              <div className="flex gap-2">
                                <textarea
                                  value={editValues[setting.id] ?? setting.value}
                                  onChange={e => setEditValues({ ...editValues, [setting.id]: e.target.value })}
                                  rows={1}
                                  className="flex-1 resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 font-[var(--font-mono)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
                                />
                                <button
                                  onClick={() => handleSave(setting.id)}
                                  disabled={updateSetting.isPending}
                                  className="flex cursor-pointer items-center gap-1.5 self-start rounded-lg border-none px-3 py-2 font-[var(--font-heading)] text-[11px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                                  style={{ backgroundColor: group.color }}
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
                })}
              </div>
            )}
    </div>
  );
}
