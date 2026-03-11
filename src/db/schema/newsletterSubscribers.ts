import { pgTable, serial, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial().primaryKey(),
  email: varchar({ length: 255 }).notNull(),
  status: varchar({ length: 20 }).default("active"),
  created_at: timestamp().defaultNow(),
  subscribed_at: timestamp().defaultNow(),
  unsubscribed_at: timestamp(),
}, t => [
  uniqueIndex("newsletter_subscribers_email_idx").on(t.email),
]);

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;
export type NewsletterSubscribersTable = typeof newsletterSubscribers;
