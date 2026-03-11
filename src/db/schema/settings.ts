import { pgTable, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const settings = pgTable("settings", {
  id: serial().primaryKey(),
  key: varchar({ length: 100 }).notNull(),
  value: text().notNull(),
  description: varchar({ length: 500 }),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
}, t => [
  uniqueIndex("settings_key_idx").on(t.key),
]);

export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;
export type SettingsTable = typeof settings;
