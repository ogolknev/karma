import { drizzle } from "drizzle-orm/node-postgres";
import { beforeEach, describe, test, afterAll, expect } from "bun:test";
import { userTable } from "../../../src/shared/db/schema";
import { DrizzleQueryError, sql } from "drizzle-orm";
import { DrizzleUserService, UserService } from "../../../src/modules/user/service";

import "../../setup";

const db = drizzle(process.env.DATABASE_URL!);
const userService: UserService = new DrizzleUserService();

const generateTestUserDataPool = (count: number) => {
  const userDataPool: {
    username: string;
    password: string;
  }[] = Array.from({ length: count });

  return userDataPool.map((_, index) => ({
    username: `test_username_${index}`,
    password: `test_password_${index}`,
  }));
};

beforeEach(async () => {
  await db.delete(userTable);
});

afterAll(async () => {
  await db.execute(sql`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
});

describe("UserService:", () => {
  test("create user", async () => {
    const [userData] = generateTestUserDataPool(1);

    const user = (await userService.create({ data: userData })).data;

    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("username", userData.username);
    expect(user).not.toHaveProperty("password");
    expect(user).toBeDefined();
    expect(user).not.toBeNull();
  });

  test("create two users with same username", async () => {
    const [userData] = generateTestUserDataPool(1);

    try {
      (await userService.create({ data: userData })).data;
      (await userService.create({ data: userData })).data;
    } catch (error) {
      if (error instanceof DrizzleQueryError && error.cause && "code" in error.cause) {
        expect(error.cause.code).toBe("23505");
      }
    }
  });

  test("get one user by ID", async () => {
    const [userData] = generateTestUserDataPool(1);

    const id = (await userService.create({ data: userData })).data.id;
    const user = (await userService.get({ id })).data;

    expect(user).toHaveProperty("id", id);
    expect(user).toHaveProperty("username", userData.username);
    expect(user).not.toHaveProperty("password");

    expect(user).toBeDefined();
    expect(user).not.toBeNull();
  });

  test("get multiple users by IDs", async () => {
    const userData = generateTestUserDataPool(2);

    const ids: string[] = [];
    ids.push((await userService.create({ data: userData[0] })).data.id);
    ids.push((await userService.create({ data: userData[1] })).data.id);
    const users = (await userService.get({ ids })).data;

    for (const [index, user] of users.entries()) {
      expect(user).toHaveProperty("id", ids[index]);
      expect(user).not.toHaveProperty("password");

      expect(user).toBeDefined();
      expect(user).not.toBeNull();
    }
  });

  test("get multiple users with pagination", async () => {
    const TOTAL = 20;
    const userDataPool = generateTestUserDataPool(TOTAL);
    await Promise.all(userDataPool.map((userData) => userService.create({ data: userData })));

    const LIMIT = 5;
    const responseWithLimit = await userService.get({ pagination: { limit: LIMIT } });

    expect(responseWithLimit.data).toHaveLength(LIMIT);
    expect(responseWithLimit.meta.pagination).toHaveProperty("limit", LIMIT);
    expect(responseWithLimit.meta.pagination).toHaveProperty("total", TOTAL);

    const OFFSET = 10;
    const responseWithOffset = await userService.get({ pagination: { offset: OFFSET, limit: TOTAL } });

    expect(responseWithOffset.data).toHaveLength(TOTAL - OFFSET);
    expect(responseWithOffset.meta.pagination).toHaveProperty("offset", OFFSET);
    expect(responseWithOffset.meta.pagination).toHaveProperty("total", TOTAL);
  });

  test("get multiple users with sorting", async () => {
    const userData = generateTestUserDataPool(3);
    await Promise.all(userData.map((data) => userService.create({ data })));

    const ascResponse = await userService.get({ sorting: [{ by: "username", order: "asc" }] });
    const descResponse = await userService.get({ sorting: [{ by: "username", order: "desc" }] });

    expect(ascResponse.data[0]).toEqual(descResponse.data[2])
    expect(ascResponse.data[2]).toEqual(descResponse.data[0])
  });

  test("update user", async () => {
    const [userData] = generateTestUserDataPool(1);
    const updateData = {
      username: "test_changed",
      karmaPoints: 999,
    };

    const id = (await userService.create({ data: userData })).data.id;
    const user = (await userService.update({ id, data: updateData })).data;

    expect(user).toHaveProperty("id", id);
    expect(user).toHaveProperty("username", updateData.username);
    expect(user).toHaveProperty("karmaPoints", updateData.karmaPoints);
    expect(user).not.toHaveProperty("password");

    expect(user).toBeDefined();
    expect(user).not.toBeNull();
  });

  test("delete user", async () => {
    const [userData] = generateTestUserDataPool(1);

    const id = (await userService.create({ data: userData })).data.id;
    await userService.delete({ id });

    const user = (await userService.get({ id })).data;

    expect(user).toBeNull();
  });
});
