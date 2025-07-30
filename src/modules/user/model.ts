import { t } from "elysia";
import { paginationMetaSchema, paginationParamsSchema, sortingParamsSchema } from "../../shared/model";
import { serviceResponseSchema } from "../../shared/model/service-response";

const userBaseSchema = t.Object({
  id: t.String({ minLength: 1 }),
  username: t.String({ minLength: 5 }),
  password: t.String({ minLength: 8 }),
  karmaPoints: t.Number({ default: 0 }),
  respectPoints: t.Number({ default: 0 }),
});

export const userDTOSchema = t.Omit(userBaseSchema, ["password"]);
export type UserDTO = typeof userDTOSchema.static;

export const userCreateSchema = t.Pick(userBaseSchema, ["username", "password"]);

export const userCreateParamsSchema = t.Object({ data: userCreateSchema });
export type UserCreateParams = typeof userCreateParamsSchema.static;

export const userCreateResponseSchema = serviceResponseSchema(userDTOSchema);
export type UserCreateResponse = typeof userCreateResponseSchema.static;

export const userGetOneParamsSchema = t.Object({ id: t.String() });
export type UserGetOneParams = typeof userGetOneParamsSchema.static;

export const userGetOneResponseSchema = serviceResponseSchema(t.Nullable(userDTOSchema));
export type UserGetOneResponse = typeof userGetOneResponseSchema.static;

const userGetManyByIDsParamsSchema = t.Object({ ids: t.Array(t.String()) });
const userGetManyBySearchParamsSchema = t.Object({
  search: t.Optional(t.String()),
  pagination: t.Optional(paginationParamsSchema),
});
export const userGetManyParamsSchema = t.Intersect([
  t.Union([userGetManyByIDsParamsSchema, userGetManyBySearchParamsSchema]),
  t.Object({ sorting: t.Optional(sortingParamsSchema) }),
]);
export type UserGetManyParams = typeof userGetManyParamsSchema.static;

export const userGetManyResponseSchema = serviceResponseSchema(
  t.Array(userDTOSchema),
  t.Object({ pagination: paginationMetaSchema })
);
export type UserGetManyResponse = typeof userGetManyResponseSchema.static;

export const userGetParamsSchema = t.Union([userGetOneParamsSchema, userGetManyParamsSchema]);
export type UserGetParams = typeof userGetParamsSchema.static;

export const userGetResponseSchema = t.Union([userGetOneResponseSchema, userGetManyResponseSchema]);
export type UserGetResponse = typeof userGetResponseSchema.static;

export const userUpdateSchema = t.Partial(t.Omit(userDTOSchema, ["id"]));
export type UserUpdate = typeof userUpdateSchema.static;

export const userUpdateParamsSchema = t.Object({ id: t.String(), data: userUpdateSchema });
export type UserUpdateParams = typeof userUpdateParamsSchema.static;

export const userUpdateResponseSchema = serviceResponseSchema(t.Nullable(userDTOSchema));
export type UserUpdateResponse = typeof userUpdateResponseSchema.static;

export const userDeleteParamsSchema = t.Object({ id: t.String() });
export type UserDeleteParams = typeof userDeleteParamsSchema.static

export const userDeleteResponseSchema = serviceResponseSchema(t.Nullable(userDTOSchema));
export type UserDeleteResponse = typeof userDeleteResponseSchema.static;