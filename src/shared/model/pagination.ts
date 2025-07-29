import { t } from "elysia";

const paginationBase = {
  offset: t.Number(),
  limit: t.Number(),
  total: t.Number(),
};

export const paginationParamsSchema = t.Partial(
  t.Omit(t.Object(paginationBase), ["total"])
);
export type PaginationParams = typeof paginationParamsSchema.static

export const paginationMetaSchema = t.Object(paginationBase)
export type PaginationMeta = typeof paginationMetaSchema.static
