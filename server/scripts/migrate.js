require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

function getSqlMigrations(migrationsFolder) {
  return fs
    .readdirSync(migrationsFolder)
    .filter((file) => /^\d+.*\.sql$/i.test(file))
    .sort((a, b) => a.localeCompare(b));
}

async function run() {
  const url = process.env.MIGRATION_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) {
    throw new Error("Set MIGRATION_DATABASE_URL or DATABASE_URL before running migrations.");
  }

  const migrationsFolder = path.resolve(__dirname, "../drizzle");
  const migrationFiles = getSqlMigrations(migrationsFolder);
  if (migrationFiles.length === 0) {
    console.log("No SQL migrations found.");
    return;
  }

  const pool = new Pool({ connectionString: url });
  try {
    for (const file of migrationFiles) {
      const fullPath = path.join(migrationsFolder, file);
      const sql = fs.readFileSync(fullPath, "utf8");
      if (!sql.trim()) {
        console.log(`Skipping empty migration: ${file}`);
        continue;
      }

      console.log(`Applying migration: ${file}`);
      await pool.query(sql);
    }

    console.log("All SQL migrations reapplied successfully.");
  } finally {
    await pool.end();
  }
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
