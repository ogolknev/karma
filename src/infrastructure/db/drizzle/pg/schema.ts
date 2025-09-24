import { taskStatuses, taskTypes } from "@/core/modules/task/const";
import { transactionTypes } from "@/core/modules/transaction/const";
import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 40 }).notNull(),
  email: varchar("email").notNull(),
  username: varchar("username", { length: 20 }).notNull().unique(),
  passwordHash: varchar("password_hash").notNull(),
});

export const taskTypeEnum = pgEnum("task_type", taskTypes);
export const taskStatusEnum = pgEnum("task_status", taskStatuses);
export const tasksTable = pgTable("tasks", {
  id: uuid("id").primaryKey(),
  title: varchar("title").notNull(),
  description: varchar("description"),
  cost: integer("cost").default(0).notNull(),
  type: taskTypeEnum("type").default("personal").notNull(),
  status: taskStatusEnum("status").default("open").notNull(),
  dueAt: timestamp("due_at"),
  projectId: uuid("project_id"),
  assigneeId: uuid("assignee_id").references(() => usersTable.id),
  authorId: uuid("author_id")
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp("created_at").notNull(),
});

export const walletsTable = pgTable("wallets", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  karma: integer("karma").default(0).notNull(),
  respect: integer("respect").default(0).notNull(),
});

export const transactionTypeEnum = pgEnum("transaction_type", transactionTypes);
export const transactionsTable = pgTable("transactions", {
  id: uuid("id").primaryKey(),
  fromId: uuid("from_id")
    .notNull()
    .references(() => walletsTable.id),
  toId: uuid("to_id")
    .references(() => walletsTable.id)
    .notNull(),
  type: transactionTypeEnum("type").notNull(),
  amount: integer("amount").notNull(),
  taskId: uuid("task_id").references(() => tasksTable.id),
  createdAt: timestamp("created_at").notNull(),
});
