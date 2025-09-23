import config from "@/shared/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle/test",
  schema: "./src/infrastructure/db/drizzle/pg/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: config.env.TEST_DATABASE_URL,
  },
});
