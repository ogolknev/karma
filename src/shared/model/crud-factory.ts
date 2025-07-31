import { t } from "elysia";
import { serviceResponseSchema } from "./service-response";
import { sortingParamsSchema } from "./sorting";
import { paginationMetaSchema, paginationParamsSchema } from "./pagination";
import type { Static, TOmit, TPick } from "@sinclair/typebox";
import type { Mutable } from "../utils/types";

export function createCRUDShemas<
  TBaseSchema extends ReturnType<typeof t.Object<{ id: ReturnType<typeof t.String> }>>,
  TDTOOmit extends readonly (keyof Static<TBaseSchema>)[] = readonly [],
  TCreateParams extends readonly (keyof Static<TBaseSchema>)[] = readonly (keyof Static<TBaseSchema>)[]
>(
  baseSchema: TBaseSchema,
  options?: {
    dtoOmit?: TDTOOmit;
    createParams?: TCreateParams;
  }
) {
  options = options ?? {};
  options.dtoOmit = options.dtoOmit ?? ([] as unknown as TDTOOmit);
  const dto: TOmit<TBaseSchema, Mutable<TDTOOmit>> = t.Omit<TBaseSchema, Mutable<TDTOOmit>>(
    baseSchema,
    options.dtoOmit
  );

  options.createParams = options.createParams ?? (Object.keys(baseSchema.properties) as unknown as TCreateParams);
  const create: TPick<TBaseSchema, Mutable<TCreateParams>> = t.Pick<TBaseSchema, Mutable<TCreateParams>>(
    baseSchema,
    options.createParams
  );
  const update = t.Partial(t.Omit(dto, ["id"]));

  const createParams = t.Object({ data: create });
  const createResponse = serviceResponseSchema(dto);

  const getOneParams = t.Object({ id: t.String({ format: "uuid" }) });
  const getOneResponse = serviceResponseSchema(t.Nullable(dto));

  const getManyParams = t.Union([
    t.Object({ ids: t.Array(t.String({ format: "uuid" })), sorting: t.Optional(sortingParamsSchema) }),
    t.Object({
      search: t.Optional(t.String()),
      pagination: t.Optional(paginationParamsSchema),
      sorting: t.Optional(sortingParamsSchema),
    }),
  ]);
  const getManyResponse = serviceResponseSchema(t.Array(dto), t.Object({ pagination: paginationMetaSchema }));

  const getParams = t.Union([getOneParams, getManyParams]);
  const getResponse = t.Union([getOneResponse, getManyResponse]);

  const updateParams = t.Object({ id: t.String({ format: "uuid" }), data: update });
  const updateResponse = serviceResponseSchema(t.Nullable(dto));

  const deleteParams = t.Object({ id: t.String({ format: "uuid" }) });
  const deleteResponse = serviceResponseSchema(t.Nullable(dto));

  return {
    dto,
    createParams,
    createResponse,
    getOneParams,
    getOneResponse,
    getManyParams,
    getManyResponse,
    getParams,
    getResponse,
    updateParams,
    updateResponse,
    deleteParams,
    deleteResponse,
  };
}
