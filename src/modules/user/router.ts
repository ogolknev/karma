import Elysia, { t } from "elysia";
import { DrizzleUserService, type UserService } from "./service";
import {
  userSchemas
} from "./model";

const userService: UserService = new DrizzleUserService();

export const userRouter = new Elysia({ prefix: "/users" })
  .post(
    "/register",
    async ({ body }) => {
      const response = await userService.create(body);

      return response;
    },
    {
      body: userSchemas.createParams,
      response: {
        200: userSchemas.createResponse,
      },
    }
  )
  .post(
    "/",
    async ({ body }) => {
      const response = await userService.get(body);

      return response;
    },
    {
      body: userSchemas.getManyParams,
      response: {
        200: userSchemas.getManyResponse,
      },
    }
  )
  .guard({
    response: {
      404: t.String(),
    },
  })
  .get(
    "/:id",
    async ({ params, status }) => {
      const response = await userService.get(params);

      return response ?? status(404, "User not found");
    },
    {
      params: userSchemas.getOneParams,
      response: {
        200: userSchemas.getOneResponse,
      },
    }
  )
  .patch(
    "/:id",
    async ({ params, body, status }) => {
      const response = userService.update({ ...params, ...body });

      return response ?? status(404, "User not found");
    },
    {
      body: t.Omit(userSchemas.updateParams, ["id"]),
      params: t.Pick(userSchemas.updateParams, ["id"]),
      response: {
        200: userSchemas.updateResponse,
      },
    }
  )
  .delete(
    "/:id",
    async ({ params, status }) => {
      const response = await userService.delete(params);

      return response ?? status(404, "User not found");
    },
    {
      params: userSchemas.deleteParams,
      response: {
        200: userSchemas.deleteResponse,
      },
    }
  );
