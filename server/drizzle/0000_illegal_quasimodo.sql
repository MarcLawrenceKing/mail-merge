CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS "tbl_user" (
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

ALTER TABLE "tbl_user" ADD COLUMN IF NOT EXISTS "user_id" uuid;
ALTER TABLE "tbl_user" ADD COLUMN IF NOT EXISTS "email" text;
ALTER TABLE "tbl_user" ADD COLUMN IF NOT EXISTS "otp_hash" text;
ALTER TABLE "tbl_user" ADD COLUMN IF NOT EXISTS "expires_at" timestamp with time zone;
ALTER TABLE "tbl_user" ADD COLUMN IF NOT EXISTS "attempts" integer;
ALTER TABLE "tbl_user" ADD COLUMN IF NOT EXISTS "last_login" timestamp with time zone;
ALTER TABLE "tbl_user" ADD COLUMN IF NOT EXISTS "last_login_attempt" timestamp with time zone;
ALTER TABLE "tbl_user" ADD COLUMN IF NOT EXISTS "created_at" timestamp with time zone;

ALTER TABLE "tbl_user" ALTER COLUMN "user_id" SET DEFAULT gen_random_uuid();
ALTER TABLE "tbl_user" ALTER COLUMN "attempts" SET DEFAULT 0;
ALTER TABLE "tbl_user" ALTER COLUMN "created_at" SET DEFAULT now();

DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM "tbl_user" WHERE "user_id" IS NULL) THEN
		ALTER TABLE "tbl_user" ALTER COLUMN "user_id" SET NOT NULL;
	END IF;
	IF NOT EXISTS (SELECT 1 FROM "tbl_user" WHERE "email" IS NULL) THEN
		ALTER TABLE "tbl_user" ALTER COLUMN "email" SET NOT NULL;
	END IF;
END $$;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'tbl_user_pkey'
			AND conrelid = 'tbl_user'::regclass
	) THEN
		ALTER TABLE "tbl_user" ADD CONSTRAINT "tbl_user_pkey" PRIMARY KEY ("user_id");
	END IF;
END $$;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'tbl_user_email_key'
			AND conrelid = 'tbl_user'::regclass
	) THEN
		ALTER TABLE "tbl_user" ADD CONSTRAINT "tbl_user_email_key" UNIQUE ("email");
	END IF;
END $$;
