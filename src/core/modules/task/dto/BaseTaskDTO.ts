import { TaskStatus } from "../types/TaskStatus";
import { TaskType } from "../types/TaskType";

export interface BaseTaskDTO {
  id: string;
  title: string;
  authorId: string;
  cost: number;
  type: TaskType;
  status: TaskStatus;
  createdAt: string;
  dueAt?: string;
  assigneeId?: string;
  projectId?: string;
  description?: string;
}
