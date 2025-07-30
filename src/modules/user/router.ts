import Elysia, { t } from "elysia";
import { DrizzleUserService, type UserService } from "./service";
import {
  userCreateParamsSchema,
  userCreateResponseSchema,
  userGetOneParamsSchema,
  userGetOneResponseSchema,
  userGetManyParamsSchema,
  userGetManyResponseSchema,
  userUpdateParamsSchema,
  userUpdateResponseSchema,
  userDeleteParamsSchema,
  userDeleteResponseSchema,
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
      body: userCreateParamsSchema,
      response: {
        200: userCreateResponseSchema,
      },
    }
  )
  .get(
    "/",
    async ({ body }) => {
      const response = await userService.get(body);

      return response;
    },
    {
      body: userGetManyParamsSchema,
      response: {
        200: userGetManyResponseSchema,
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
      params: userGetOneParamsSchema,
      response: {
        200: userGetOneResponseSchema,
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
      body: t.Omit(userUpdateParamsSchema, ["id"]),
      params: t.Pick(userUpdateParamsSchema, ["id"]),
      response: {
        200: userUpdateResponseSchema,
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
      params: userDeleteParamsSchema,
      response: {
        200: userDeleteResponseSchema,
      },
    }
  );
