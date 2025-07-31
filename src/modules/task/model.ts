import { t } from "elysia";
import { createCRUDShemas } from "../../shared/model/crud-factory";

const taskBaseSchema = t.Object({
  id: t.String({ format: "uuid" }),
  authorId: t.String({ format: "uuid" }),
  title: t.String(),
  description: t.Optional(t.String()),
  karmaRewardPoints: t.Number(),
  respectRewardPoints: t.Number(),
  completed: t.Boolean(),
  createdAt: t.String({ format: "date-time" }),
  completedAt: t.Optional(t.String({ format: "date-time" })),
});

const taskSchemas = createCRUDShemas(taskBaseSchema, {
  createParams: ["title", "description", "authorId", "karmaRewardPoints", "respectRewardPoints"],
});

export type TaskDTO = typeof taskSchemas.dto.static;

export type TaskCreateParams = typeof taskSchemas.createParams.static;
export type TaskCreateResponse = typeof taskSchemas.createResponse.static;

export type TaskGetOneParams = typeof taskSchemas.getOneParams.static;
export type TaskGetOneResponse = typeof taskSchemas.getOneResponse.static;

export type TaskGetManyParams = typeof taskSchemas.getManyParams.static;
export type TaskGetManyResponse = typeof taskSchemas.getManyResponse.static;

export type TaskGetParams = typeof taskSchemas.getParams.static;
export type TaskGetResponse = typeof taskSchemas.getResponse.static;

export type TaskUpdateParams = typeof taskSchemas.updateParams.static;
export type TaskUpdateResponse = typeof taskSchemas.updateResponse.static;

export type TaskDeleteParams = typeof taskSchemas.deleteParams.static;
export type TaskDeleteResponse = typeof taskSchemas.deleteResponse.static;
