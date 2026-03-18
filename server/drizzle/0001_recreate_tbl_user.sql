CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS "public"."tbl_user" (
  "user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" text NOT NULL,
  "otp_hash" text,
  "expires_at" timestamp with time zone,
  "attempts" integer DEFAULT 0,
  "last_login" timestamp with time zone,
  "last_login_attempt" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "tbl_user_email_key" UNIQUE("email")
);

NOTIFY pgrst, 'reload schema';
