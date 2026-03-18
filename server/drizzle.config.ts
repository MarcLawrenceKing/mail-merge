import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const migrationDbUrl = process.env.MIGRATION_DATABASE_URL ?? process.env.DATABASE_URL;

if (!migrationDbUrl) {
  throw new Error("Set MIGRATION_DATABASE_URL (preferred) or DATABASE_URL to run Drizzle migrations.");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: migrationDbUrl,
  },
});
