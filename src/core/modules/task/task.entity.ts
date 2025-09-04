import { generateId } from "@/shared/utils/crypto";
import { TaskCreateDTO } from "./dto";
import { TaskType } from "./types";
import { TaskStatus } from "./types/TaskStatus";
import { toDatetimeString } from "@/shared/utils/date";
import { TaskUpdateDTO } from "./dto/TaskUpdateDTO";

export class Task {
  constructor(
    private id: string,
    private title: string,
    private authorId: string,
    private cost: number,
    private type: TaskType,
    private status: TaskStatus,
    private createdAt: string,
    private dueAt?: string,
    private assigneeId?: string,
    private projectId?: string,
    private description?: string
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

  update(data: TaskUpdateDTO) {
    this.title = data.title ?? this.title;
    this.cost = data.cost ?? this.cost;
    this.status = data.status ?? this.status;
    this.dueAt = data.dueAt ?? this.dueAt;
    this.assigneeId = data.assigneeId ?? this.assigneeId;
    this.projectId = data.projectId ?? this.projectId;
    this.description = data.description ?? this.description;
  }
}
