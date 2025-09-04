import { BaseRepo } from "../common";
import { TaskUpdateDTO } from "./dto/TaskUpdateDTO";
import { Task } from "./task.entity";

export interface TaskRepo extends BaseRepo<Task, TaskUpdateDTO> {}