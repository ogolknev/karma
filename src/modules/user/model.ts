import { t } from "elysia";
import { createCRUDShemas } from "../../shared/model/crud-factory";

const userBaseSchema = t.Object({
  id: t.String({ minLength: 1 }),
  username: t.String({ minLength: 5 }),
  password: t.String({ minLength: 8 }),
  karmaPoints: t.Number({ default: 0 }),
  respectPoints: t.Number({ default: 0 }),
});

export const userSchemas = createCRUDShemas(userBaseSchema, {
  dtoOmit: ["password"],
  createParams: ["username", "password"],
});

export type UserDTO = typeof userSchemas.dto.static;

export type UserCreateParams = typeof userSchemas.createParams.static;
export type UserCreateResponse = typeof userSchemas.createResponse.static;

export type UserGetOneParams = typeof userSchemas.getOneParams.static;
export type UserGetOneResponse = typeof userSchemas.getOneResponse.static;

export type UserGetManyParams = typeof userSchemas.getManyParams.static;
export type UserGetManyResponse = typeof userSchemas.getManyResponse.static;

export type UserGetParams = typeof userSchemas.getParams.static;
export type UserGetResponse = typeof userSchemas.getResponse.static;

export type UserUpdateParams = typeof userSchemas.updateParams.static;
export type UserUpdateResponse = typeof userSchemas.updateResponse.static;

export type UserDeleteParams = typeof userSchemas.deleteParams.static;
export type UserDeleteResponse = typeof userSchemas.deleteResponse.static;
