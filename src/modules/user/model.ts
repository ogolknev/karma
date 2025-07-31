import { t } from "elysia";
import { createCRUDShemas } from "../../shared/model/crud-factory";
// import { paginationMetaSchema, paginationParamsSchema, sortingParamsSchema } from "../../shared/model";
// import { serviceResponseSchema } from "../../shared/model/service-response";

const userBaseSchema = t.Object({
  id: t.String({ minLength: 1 }),
  username: t.String({ minLength: 5 }),
  password: t.String({ minLength: 8 }),
  karmaPoints: t.Number({ default: 0 }),
  respectPoints: t.Number({ default: 0 }),
});

export const userSchemas = createCRUDShemas(userBaseSchema, { dtoOmit: ["password"], createParams: ["username", "password"] });

// export const userDTOSchema = t.Omit(userBaseSchema, ["password"]);
export type UserDTO = typeof userSchemas.dto.static;

// export const userCreateSchema = t.Pick(userBaseSchema, ["username", "password"]);

// export const userCreateParamsSchema = t.Object({ data: userCreateSchema });
export type UserCreateParams = typeof userSchemas.createParams.static;

// export const userCreateResponseSchema = serviceResponseSchema(userDTOSchema);
export type UserCreateResponse = typeof userSchemas.createResponse.static;

// export const userGetOneParamsSchema = t.Object({ id: t.String() });
export type UserGetOneParams = typeof userSchemas.getOneParams.static;

// export const userGetOneResponseSchema = serviceResponseSchema(t.Nullable(userDTOSchema));
export type UserGetOneResponse = typeof userSchemas.getOneResponse.static;

// const userGetManyByIDsParamsSchema = t.Object({ ids: t.Array(t.String()) });
// const userGetManyBySearchParamsSchema = t.Object({
//   search: t.Optional(t.String()),
//   pagination: t.Optional(paginationParamsSchema),
// });

// export const userGetManyParamsSchema = t.Union([
//   t.Intersect([userGetManyByIDsParamsSchema, t.Object({ sorting: t.Optional(sortingParamsSchema) })]),
//   t.Intersect([userGetManyBySearchParamsSchema, t.Object({ sorting: t.Optional(sortingParamsSchema) })]),
// ]);

export type UserGetManyParams = typeof userSchemas.getManyParams.static;

// export const userGetManyResponseSchema = serviceResponseSchema(
//   t.Array(userDTOSchema),
//   t.Object({ pagination: paginationMetaSchema })
// );
export type UserGetManyResponse = typeof userSchemas.getManyResponse.static;

// export const userGetParamsSchema = t.Union([userGetOneParamsSchema, userGetManyParamsSchema]);
export type UserGetParams = typeof userSchemas.getParams.static;

// export const userGetResponseSchema = t.Union([userGetOneResponseSchema, userGetManyResponseSchema]);
export type UserGetResponse = typeof userSchemas.getResponse.static;

// export const userUpdateSchema = t.Partial(t.Omit(userDTOSchema, ["id"]));
// export type UserUpdate = typeof userSchemas.updateParams.static;

// export const userUpdateParamsSchema = t.Object({ id: t.String(), data: userUpdateSchema });
export type UserUpdateParams = typeof userSchemas.updateParams.static;

// export const userUpdateResponseSchema = serviceResponseSchema(t.Nullable(userDTOSchema));
export type UserUpdateResponse = typeof userSchemas.updateResponse.static;

// export const userDeleteParamsSchema = t.Object({ id: t.String() });
export type UserDeleteParams = typeof userSchemas.deleteParams.static;

// export const userDeleteResponseSchema = serviceResponseSchema(t.Nullable(userDTOSchema));
export type UserDeleteResponse = typeof userSchemas.deleteResponse.static;
