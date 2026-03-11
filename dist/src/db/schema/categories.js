import { boolean, index, integer, pgTable, serial, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
export const categories = pgTable("categories", {
    id: serial().primaryKey(),
    name: varchar({ length: 100 }).notNull(),
    name_te: varchar({ length: 200 }),
    slug: varchar({ length: 100 }).notNull(),
    icon: varchar({ length: 10 }),
    color: varchar({ length: 7 }),
    video_count: integer().default(0),
    sort_order: integer().default(0),
    is_active: boolean().default(true),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp(),
}, t => [
    uniqueIndex("categories_slug_idx").on(t.slug),
    index("categories_sort_order_idx").on(t.sort_order),
    index("categories_is_active_idx").on(t.is_active),
]);
