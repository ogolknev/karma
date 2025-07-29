import { TObject } from "@sinclair/typebox";
import { t, TSchema } from "elysia";

export function serviceResponseSchema<T extends TSchema>(
  T: T
): TObject<{ data: T }>;

export function serviceResponseSchema<T extends TSchema, M extends TSchema>(
  T: T,
  M: M
): TObject<{ data: T; meta: M }>;

export function serviceResponseSchema<
  T extends TSchema,
  M extends TSchema | undefined = undefined
>(T: T, M?: M) {
  if (M) return t.Object({ data: T, meta: M });
  return t.Object({ data: T });
}

export type ServiceResponse<
  T,
  M = undefined
> = M extends undefined
  ? { data: T }
  : { data: T; meta: NonNullable<M> };
