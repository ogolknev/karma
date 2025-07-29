import { drizzle } from "drizzle-orm/node-postgres";
import { beforeEach, describe, test, afterAll, expect } from "bun:test";
import { userTable } from "../../../src/shared/db/schema";
import { DrizzleQueryError, sql } from "drizzle-orm";
import {
  DrizzleUserService,
  UserService,
} from "../../../src/modules/user/service";

import "../../setup";

const db = drizzle(process.env.DATABASE_URL!);
const userService: UserService = new DrizzleUserService();

const userData = {
  username: "test_user",
  password: "test_password",
};

const userData_2 = {
  username: "test_user_2",
  password: "test_password",
};

beforeEach(async () => {
  await db.delete(userTable);
});

afterAll(async () => {
  await db.execute(sql`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
});

describe("UserService: ", () => {
  test("create user", async () => {
    const user = (await userService.create({ data: userData })).data;

    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("username", userData.username);
    expect(user).not.toHaveProperty("password");
    expect(user).toBeDefined();
    expect(user).not.toBeNull();
  });

  test("create two users with same username", async () => {
    try {
      (await userService.create({ data: userData })).data;
      (await userService.create({ data: userData })).data;
    } catch (error) {
      if (
        error instanceof DrizzleQueryError &&
        error.cause &&
        "code" in error.cause
      ) {
        expect(error.cause.code).toBe("23505");
      }
    }
  });

  test("get one user by ID", async () => {
    const id = (await userService.create({ data: userData })).data.id;
    const user = (await userService.get({ id })).data;

    expect(user).toHaveProperty("id", id);
    expect(user).toHaveProperty("username", userData.username);
    expect(user).not.toHaveProperty("password");

    expect(user).toBeDefined();
    expect(user).not.toBeNull();
  });

  test("get multiple users by IDs", async () => {
    const ids: string[] = [];
    ids.push((await userService.create({ data: userData })).data.id);
    ids.push((await userService.create({ data: userData_2 })).data.id);
    const users = (await userService.get({ ids })).data;

    for (const [index, user] of users.entries()) {
      expect(user).toHaveProperty("id", ids[index]);
      expect(user).not.toHaveProperty("password");

      expect(user).toBeDefined();
      expect(user).not.toBeNull();
    }
  });

  test("update user", async () => {
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
    const id = (await userService.create({ data: userData })).data.id;
    await userService.delete({ id });

    const user = (await userService.get({id})).data

    expect(user).toBeNull()
  });
});
