import { BaseRepo } from "../common";
import { BaseTaskDTO } from "./dto/BaseTaskDTO";
import { TaskUpdateDTO } from "./dto/TaskUpdateDTO";
import { Task } from "./task.entity";

export interface TaskRepo extends BaseRepo<Task, BaseTaskDTO, TaskUpdateDTO> {}
