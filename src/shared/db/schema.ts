import { boolean, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  username: varchar({ length: 20 }).unique().notNull(),
  passwordHash: varchar({ length: 100 }).notNull(),
  karmaPoints: integer().default(0).notNull(),
  respectPoints: integer().default(0).notNull(),
});

export const taskTable = pgTable("tasks", {
  id: uuid().primaryKey().defaultRandom(),
  authorId: uuid()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  title: varchar({length: 100}).notNull(),
  description: text().notNull(),
  karmaRewardPoints: integer().notNull(),
  respectRewardPoints: integer().notNull(),
  completed: boolean().default(false),
  createdAt: timestamp().notNull().defaultNow(),
  completedAt: timestamp()
});
