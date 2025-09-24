import { Task } from "@/core/modules/task/task.entity";
import { User } from "@/core/modules/user";
import { afterAll, beforeAll, describe, it } from "bun:test";
import { execBeforeAll } from "./utils/exec-before-all";
import { drizzle } from "drizzle-orm/node-postgres";
import config from "@/shared/config";
import { PgTaskRepo } from "@/infrastructure/db/drizzle/pg/repositories/task.repo";
import { PgUserRepo } from "@/infrastructure/db/drizzle/pg/repositories/user.repo";
import { execAfterAll } from "./utils/exec-after-all";
import { shouldCRUD } from "./utils";

describe("Task Repository", async () => {
  const db = drizzle(config.env.TEST_DATABASE_URL);
  const taskRepo = new PgTaskRepo(db);
  const userRepo = new PgUserRepo(db);

  const TASK_NUMBER = 300;
  const author = await User.create({
    name: "Pavel",
    email: `pavel@mail.ru`,
    username: "pasha",
    password: "0123456",
  });
  const tasks: Task[] = [];

  for (let i = 0; i < TASK_NUMBER; i++) {
    const task = await Task.create({
      title: `Complete task#${i}`,
      authorId: author.id,
      cost: 100 + i,
      type: i % 2 ? "personal" : "shared",
    });

    tasks.push(task);
  }

  const taskToAdd = await Task.create({
    title: "Add task to test",
    authorId: author.id,
    cost: 999,
    type: "personal",
  });

  beforeAll(async () => {
    await execBeforeAll();

    await userRepo.add({ data: author });

    for (const task of tasks) {
      await taskRepo.add({ data: task });
    }
  });

  afterAll(async () => {
    await execAfterAll(db);
  });

  it(
    "CRUD",
    shouldCRUD({
      entities: tasks,
      entityToAdd: taskToAdd,
      repo: taskRepo,
      fieldForUpdate: "description",
      valueForUpdate: "Yoooo",
      db,
    })
  );
});
