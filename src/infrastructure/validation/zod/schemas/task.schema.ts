import { taskStatuses, taskTypes } from "@/core/modules/task/const";
import z from "zod";

export const taskSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  authorId: z.string(),
  cost: z.int(),
  type: z.enum(taskTypes),
  status: z.enum(taskStatuses),
  createdAt: z.int(),
  dueAt: z.int().nullable(),
  assigneeId: z.uuid().nullable(),
  projectId: z.uuid().nullable(),
  description: z.string().nullable(),
});
