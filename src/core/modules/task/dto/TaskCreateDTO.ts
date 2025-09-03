import { TaskType } from "../types";
import { BaseTask } from "../types/BaseTask";

export type TaskCreateDTO = Omit<BaseTask, 'id' | 'status' | 'createdAt'>
