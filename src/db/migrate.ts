import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.production.local" });

async function runMigrations() {
  if (!process.env.MIGRATION_DATABASE_URL) {
    throw new Error("MIGRATION_DATABASE_URL is not set in env");
  }

  const migrationClient = postgres(process.env.MIGRATION_DATABASE_URL, {
    max: 1,
  });
  const db = drizzle(migrationClient, { logger: true });
  console.log("⏳ Running migrations...");
  const start = Date.now();
  await migrate(db, {
    migrationsFolder: `${__dirname}/migrations`,
  });
  const end = Date.now();
  console.log(`✅ Migrations complete, took ${end - start}ms`);
  process.exit(0);
}

runMigrations().catch((e) => {
  console.error("❌ Migrations failed");
  console.error(e);
  process.exit(1);
});
