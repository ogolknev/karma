import { TaskStatus } from "./TaskStatus";
import { TaskType } from "./TaskType";

export interface BaseTask {
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
