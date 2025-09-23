import { generateId } from "@/shared/utils/crypto";
import { TaskCreateDTO, BaseTaskDTO } from "./dto";
import { TaskType } from "./types";
import { TaskStatus } from "./types/TaskStatus";
import { toDatetimeString } from "@/shared/utils/date";
import { TaskUpdateDTO } from "./dto/TaskUpdateDTO";
import { BaseEntity } from "../common";

export class Task extends BaseEntity<TaskUpdateDTO> {
  constructor(
    public id: string,
    public title: string,
    public authorId: string,
    public cost: number,
    public type: TaskType,
    public status: TaskStatus,
    public createdAt: Date,
    public dueAt: Date | null = null,
    public assigneeId: string | null = null,
    public projectId: string | null = null,
    public description: string | null = null
  ) {
    super();
  }

  static async create(data: TaskCreateDTO) {
    const id = generateId();
    const status: TaskStatus = "open";
    const createdAt = new Date();

    return new Task(
      id,
      data.title,
      data.authorId,
      data.cost,
      data.type,
      status,
      createdAt,
      data.dueAt,
      data.assigneeId,
      data.projectId,
      data.description
    );
  }

  static fromDTO({ data }: { data: BaseTaskDTO }) {
    return new Task(
      data.id,
      data.title,
      data.authorId,
      data.cost,
      data.type,
      data.status,
      data.createdAt,
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

  toDTO(): BaseTaskDTO {
    return {
      id: this.id,
      title: this.title,
      authorId: this.authorId,
      cost: this.cost,
      type: this.type,
      status: this.status,
      createdAt: this.createdAt,
      dueAt: this.dueAt,
      assigneeId: this.assigneeId,
      projectId: this.projectId,
      description: this.description,
    };
  }
}
