import { boolean, index, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const breakingNews = pgTable("breaking_news", {
  id: serial().primaryKey(),
  text: varchar({ length: 500 }).notNull(),
  text_te: varchar({ length: 500 }),
  is_active: boolean().default(true),
  sort_order: integer().default(0),
  created_at: timestamp().defaultNow(),
}, t => [
  index("breaking_news_is_active_idx").on(t.is_active),
  index("breaking_news_sort_order_idx").on(t.sort_order),
]);

export type BreakingNewsItem = typeof breakingNews.$inferSelect;
export type NewBreakingNewsItem = typeof breakingNews.$inferInsert;
export type BreakingNewsTable = typeof breakingNews;
