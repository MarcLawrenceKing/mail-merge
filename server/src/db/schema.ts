import { integer, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const tblUser = pgTable("tbl_user", {
  userId: uuid("user_id").default(sql`gen_random_uuid()`).primaryKey(),
  email: text("email").notNull(),
  otpHash: text("otp_hash"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  attempts: integer("attempts").default(0),
  lastLogin: timestamp("last_login", { withTimezone: true }),
  lastLoginAttempt: timestamp("last_login_attempt", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => {
  return [
    unique("tbl_user_email_key").on(table.email),
  ];
});
