import { beforeEach, describe, expect, test } from "bun:test";
import { app } from "../../../src/app";
import { drizzle } from "drizzle-orm/node-postgres";

import { userTable } from "../../../src/shared/db/schema";

import "../../setup";
import { generateTestUsers } from "../../utils";

const db = drizzle(process.env.DATABASE_URL!);

app.listen(0)

const baseUrl = app.server!.url;

describe("User API:", () => {

  beforeEach(async () => {
    await db.delete(userTable);
  });

  test("POST /users/register", async () => {
    const response = await fetch(`${baseUrl}users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          username: "test_username",
          password: "test_password",
        },
      }),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("data.username", "test_username");
  });

  test("GET /users/:id", async () => {
    const [{id}] = await generateTestUsers(1)

    const response = await fetch(`${baseUrl}users/${id}`)

    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty("data.id", id)
  })

  test("POST /users", async () => {
    const TOTAL = 10
    const testUsers = await generateTestUsers(TOTAL)

    let response = await fetch(`${baseUrl}users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ids: testUsers.map(u => u.id)
      })
    })

    let data = await response.json()

    expect(data.data).toHaveLength(testUsers.length)
    expect(data.data[0]).toHaveProperty("id", testUsers[0].id)

    response = await fetch(`${baseUrl}users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sorting: [{
          by: "username",
          order: "asc"
        }]
      })
    })

    let ascData = await response.json()

    response = await fetch(`${baseUrl}users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sorting: [{
          by: "username",
          order: "desc"
        }]
      })
    })

    let descData = await response.json()

    expect(ascData.data[0]).toEqual(descData.data[descData.data.length - 1])
    expect(descData.data[0]).toEqual(ascData.data[ascData.data.length - 1])

    const LIMIT = 1
    response = await fetch(`${baseUrl}users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pagination: {
          limit: LIMIT
        }
      })
    })

    data = await response.json()

    expect(data.data).toHaveLength(LIMIT)

    const OFFSET = Math.round(LIMIT / 2)
    response = await fetch(`${baseUrl}users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pagination: {
          offset: OFFSET
        }
      })
    })

    data = await response.json()

    expect(data.data).toHaveLength(TOTAL - OFFSET)
  })

  test("PATCH /users/:id", async () => {
    const [{id}] = await generateTestUsers(1)

    const userUpdateData = {
      username: "updated_username",
      karmaPoints: 200
    }

    const response = await fetch(`${baseUrl}users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: userUpdateData
      })
    })

    const data = await response.json()

    expect(data.data).toHaveProperty("username", userUpdateData.username)
    expect(data.data).toHaveProperty("karmaPoints", userUpdateData.karmaPoints)
  })

  test("DELETE /users/:id", async () => {
    const [{id}] = await generateTestUsers(1)

    let response = await fetch(`${baseUrl}users/${id}`, {
      method: "DELETE",
    })

    console.log(response)

    let data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty("data.id", id)

    response = await fetch(`${baseUrl}users/${id}`)

    data = await response.json()

    expect(data.data).toBeNull()
  })
});
