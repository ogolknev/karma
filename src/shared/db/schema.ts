import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  username: varchar({length: 20}).unique().notNull(),
  passwordHash: varchar({length: 100}).notNull(),
  karmaPoints: integer().default(0).notNull(),
  respectPoints: integer().default(0).notNull()
})