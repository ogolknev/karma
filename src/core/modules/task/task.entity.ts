import { generateId } from "@/shared/utils/crypto";
import { TaskCreateDTO } from "./dto";
import { TaskType } from "./types";
import { TaskStatus } from "./types/TaskStatus";
import { toDatetimeString } from "@/shared/utils/date";

export class Task {
  constructor(
    public id: string,
    public title: string,
    public authorId: string,
    public cost: number,
    public type: TaskType,
    public status: TaskStatus,
    public createdAt: string,
    public dueAt?: string,
    public assigneeId?: string,
    public projectId?: string,
    public description?: string
  ) {}

  static create(data: TaskCreateDTO) {
    const id = generateId();
    const status: TaskStatus = "open";
    const created = toDatetimeString(new Date());

    return new Task(
      id,
      data.title,
      data.authorId,
      data.cost,
      data.type,
      status,
      created,
      data.dueAt,
      data.assigneeId,
      data.projectId,
      data.description
    );
  }
}
