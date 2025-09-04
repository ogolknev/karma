import { TaskType } from "../types";
import { BaseTaskDTO } from "./BaseTaskDTO";

export type TaskCreateDTO = Omit<BaseTaskDTO, 'id' | 'status' | 'createdAt'>
