import { TaskType } from "../types";

export interface TaskCreateDTO {
  title: string;
  authorId: string;
  cost: number;
  type: TaskType;
  dueAt?: string;
  assigneeId?: string;
  projectId?: string;
  description?: string;
}
