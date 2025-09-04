import { BaseTaskDTO } from "./BaseTaskDTO";

export type TaskUpdateDTO = Partial<
  Omit<BaseTaskDTO, "id" | "authorId" | "type" | "createdAt">
>;
