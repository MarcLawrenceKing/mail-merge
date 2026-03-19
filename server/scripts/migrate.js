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

function getJournalMigrationFilenames(migrationsFolder) {
  const journalPath = path.resolve(migrationsFolder, "meta/_journal.json");
  if (!fs.existsSync(journalPath)) return [];

  try {
    const raw = fs.readFileSync(journalPath, "utf8");
    const parsed = JSON.parse(raw);
    const entries = Array.isArray(parsed?.entries) ? parsed.entries : [];

    return entries
      .map((entry) => `${entry?.tag}.sql`)
      .filter((name) => typeof name === "string" && /^\d+.*\.sql$/i.test(name))
      .filter((name) => fs.existsSync(path.join(migrationsFolder, name)));
  } catch {
    return [];
  }
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
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename TEXT UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const journalMigrations = getJournalMigrationFilenames(migrationsFolder);
    for (const file of journalMigrations) {
      await pool.query(
        "INSERT INTO schema_migrations (filename) VALUES ($1) ON CONFLICT (filename) DO NOTHING",
        [file]
      );
    }

    const appliedResult = await pool.query(
      "SELECT filename FROM schema_migrations"
    );
    const applied = new Set(appliedResult.rows.map((row) => row.filename));

    let appliedCount = 0;
    for (const file of migrationFiles) {
      if (applied.has(file)) {
        console.log(`Skipping already applied migration: ${file}`);
        continue;
      }

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
        await client.query(
          "INSERT INTO schema_migrations (filename) VALUES ($1)",
          [file]
        );
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
