import config from "@/shared/config";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(config.env.DATABASE_URL);
