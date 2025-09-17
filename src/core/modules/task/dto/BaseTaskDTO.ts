import { TaskStatus } from "../types/TaskStatus";
import { TaskType } from "../types/TaskType";

export interface BaseTaskDTO {
  id: string;
  title: string;
  authorId: string;
  cost: number;
  type: TaskType;
  status: TaskStatus;
  createdAt: Date;
  dueAt?: Date | null;
  assigneeId?: string | null;
  projectId?: string | null;
  description?: string | null;
}
