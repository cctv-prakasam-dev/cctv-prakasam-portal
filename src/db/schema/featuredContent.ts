import { boolean, index, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

import { videos } from "./videos.js";

export const featuredContent = pgTable("featured_content", {
  id: serial().primaryKey(),
  type: varchar({ length: 50 }).notNull(),
  video_id: integer().references(() => videos.id),
  title: varchar({ length: 200 }),
  is_active: boolean().default(true),
  sort_order: integer().default(0),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp(),
}, t => [
  index("featured_content_type_idx").on(t.type),
  index("featured_content_is_active_idx").on(t.is_active),
  index("featured_content_sort_order_idx").on(t.sort_order),
]);

export type FeaturedContentItem = typeof featuredContent.$inferSelect;
export type NewFeaturedContentItem = typeof featuredContent.$inferInsert;
export type FeaturedContentTable = typeof featuredContent;
