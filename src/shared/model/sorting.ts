import { t } from "elysia";

const sortingBase = {
  by: t.String(),
  order: t.Optional(t.UnionEnum(["asc", "desc"]))
}

export const sortingParamsSchema = t.Array(t.Object(sortingBase))
export type SortingParams = typeof sortingParamsSchema.static