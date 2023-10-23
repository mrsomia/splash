import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.production.local" });

async function runMigrations() {
  if (!process.env.MIGRATION_DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in env");
  }

  const migrationClient = postgres(process.env.MIGRATION_DATABASE_URL);
  console.log("⏳ Running migrations...");
  migrate(drizzle(migrationClient), {
    migrationsFolder: `${__dirname}/migrations`,
  });
  console.log("✅ Migrations complete");
  process.exit(0);
}

runMigrations().catch((e) => {
  console.error("❌ Migrations failed");
  console.error(e);
  process.exit(1);
});
