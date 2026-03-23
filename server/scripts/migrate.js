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
    let appliedCount = 0;
    for (const file of migrationFiles) {
      const fullPath = path.join(migrationsFolder, file);
      const sql = fs.readFileSync(fullPath, "utf8");
      if (!sql.trim()) {
        console.log(`Skipping empty migration: ${file}`);
        continue;
      }

      console.log(`Applying migration: ${file}`);
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query(sql);
        await client.query("COMMIT");
        appliedCount += 1;
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      } finally {
        client.release();
      }
    }

    if (appliedCount === 0) {
      console.log("No pending SQL migrations.");
    } else {
      console.log(`Applied ${appliedCount} SQL migration(s).`);
    }
  } finally {
    await pool.end();
  }
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
