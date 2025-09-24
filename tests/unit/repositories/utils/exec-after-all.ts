import { sql } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export async function execAfterAll(db: NodePgDatabase<any>) {
  await db.execute(sql`DROP SCHEMA public CASCADE;CREATE SCHEMA public;`);
}