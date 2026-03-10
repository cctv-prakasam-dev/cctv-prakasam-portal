import { boolean, date, index, pgTable, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial().primaryKey(),
  customer_id: varchar(),
  first_name: varchar(),
  last_name: varchar(),
  email: varchar(),
  phone: varchar(),
  user_type: varchar().notNull().default("CUSTOMER"),
  active: boolean().default(true),
  profile_pic: text(),
  date_of_birth: date("date_of_birth", { mode: "date" }), // varchar()
  gender: varchar(),
  aadhaar: varchar(),
  address: text(),
  state: varchar(),
  occupation: varchar(),
  bio: text(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp(),
  deleted_at: timestamp(),
}, t => [
  uniqueIndex("users_email_idx").on(t.email),
  uniqueIndex("users_phone_idx").on(t.phone),
  uniqueIndex("users_aadhaar_idx").on(t.aadhaar),
  uniqueIndex("users_customer_id_idx").on(t.customer_id),
  index("users_created_at_idx").on(t.created_at),
  index("users_user_type_idx").on(t.user_type),
  index("users_deleted_at_idx").on(t.deleted_at),
  index("users_first_name_idx").on(t.first_name),
  index("users_last_name_idx").on(t.last_name),
]);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UsersTable = typeof users;
