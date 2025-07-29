import { t } from "elysia";

const userBaseSchema = t.Object({
  id: t.String({ minLength: 1 }),
  username: t.String({ minLength: 5 }),
  password: t.String({ minLength: 8 }),
  karmaPoints: t.Number({ default: 0 }),
  respectPoints: t.Number({ default: 0 }),
});

export const userDTOSchema = t.Omit(userBaseSchema, ["password"])
export type UserDTO = typeof userDTOSchema.static

export const userCreateSchema = t.Pick(userBaseSchema, ["username", "password"])
export type UserCreate = typeof userCreateSchema.static

export const userUpdateSchema = t.Partial(userCreateSchema)
export type UserUpdate = typeof userUpdateSchema.static