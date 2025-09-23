import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from "bun:test";
import { drizzle } from "drizzle-orm/node-postgres";
import { PgUserRepo } from "@/infrastructure/db/drizzle/pg/repositories/user.repo";
import { User } from "@/core/modules/user";
import config from "@/shared/config";
import { execBeforeAll } from "./utils/exec-before-all";
import { execAfterAll } from "./utils/exec-after-all";
import { shouldCRUD } from "./utils";

describe("User Repository", async () => {
  const db = drizzle(config.env.TEST_DATABASE_URL);
  const userRepo = new PgUserRepo(db);

  const TEST_PASSWORD = "pashkakakashka";
  const TEST_USER_NUMBER = 20;

  const testUsers: User[] = [];

  for (let i = 0; i < TEST_USER_NUMBER; i++) {
    const user = await User.create({
      name: `Pavel${i}`,
      username: `pavel#${i}`,
      password: TEST_PASSWORD,
    });

    testUsers.push(user);
  }

  const testUserToAdd = await User.create({
    name: "Pasha",
    username: "pavel",
    password: TEST_PASSWORD,
  });

  beforeAll(async () => {
    await execBeforeAll();

    console.log("Fill database...");
    for (const user of testUsers) {
      await userRepo.add({ data: user });
    }
  });

  afterAll(async () => {
    await execAfterAll(db);
  });

  shouldCRUD({
    entityName: ["user", "users"],
    entities: testUsers,
    entityToAdd: testUserToAdd,
    repo: userRepo,
    db,
    fieldForUpdate: "name",
    valueForUpdate: 'Petr'
  });

  it("Gets user by username", async () => {
    const { data: received } = await userRepo.getByUsername(
      testUsers[0].username
    );

    expect(received?.toDTO()).toEqual(testUsers[0].toDTO());
  });
});
