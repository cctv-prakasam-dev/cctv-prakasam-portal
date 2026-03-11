import { boolean, index, integer, pgTable, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

import { categories } from "./categories.js";

export const videos = pgTable("videos", {
  id: serial().primaryKey(),
  youtube_id: varchar({ length: 20 }).notNull(),
  title: varchar({ length: 500 }).notNull(),
  title_te: varchar({ length: 500 }),
  description: text(),
  category_id: integer().references(() => categories.id),
  thumbnail_url: varchar({ length: 500 }),
  duration: varchar({ length: 10 }),
  view_count: varchar({ length: 20 }),
  published_at: timestamp(),
  is_featured: boolean().default(false),
  is_trending: boolean().default(false),
  is_active: boolean().default(true),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp(),
}, t => [
  uniqueIndex("videos_youtube_id_idx").on(t.youtube_id),
  index("videos_category_id_idx").on(t.category_id),
  index("videos_is_featured_idx").on(t.is_featured),
  index("videos_is_trending_idx").on(t.is_trending),
  index("videos_is_active_idx").on(t.is_active),
  index("videos_published_at_idx").on(t.published_at),
]);

export type Video = typeof videos.$inferSelect;
export type NewVideo = typeof videos.$inferInsert;
export type VideosTable = typeof videos;
