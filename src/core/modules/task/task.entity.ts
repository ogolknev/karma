import { generateId } from "@/shared/utils/crypto";
import { TaskCreateDTO, BaseTaskDTO } from "./dto";
import { TaskType } from "./types";
import { TaskStatus } from "./types/TaskStatus";
import { toDatetimeString } from "@/shared/utils/date";
import { TaskUpdateDTO } from "./dto/TaskUpdateDTO";
import { BaseEntity } from "../common";

export class Task extends BaseEntity<TaskUpdateDTO> {
  constructor(
    private id: string,
    private title: string,
    private authorId: string,
    private cost: number,
    private type: TaskType,
    private status: TaskStatus,
    private createdAt: Date,
    private dueAt?: Date | null,
    private assigneeId?: string | null,
    private projectId?: string | null,
    private description?: string | null
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

  static fromDTO({ dto }: { dto: BaseTaskDTO }) {
    return new Task(
      dto.id,
      dto.title,
      dto.authorId,
      dto.cost,
      dto.type,
      dto.status,
      dto.createdAt,
      dto.dueAt,
      dto.assigneeId,
      dto.projectId,
      dto.description
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
