import {
  RepoResult,
  FindOptions,
  FindResult,
  PaginationMeta,
} from "@/core/modules/common/types";
import { db } from "..";
import { and, count, eq, SQL } from "drizzle-orm";
import { NotCreatedError } from "@/core/modules/common";
import { TaskRepo } from "@/core/modules/task/task.repo";
import { Task } from "@/core/modules/task/task.entity";
import { tasksTable } from "../schema";
import { BaseTaskDTO } from "@/core/modules/task/dto";
import { TaskUpdateDTO } from "@/core/modules/task/dto/TaskUpdateDTO";

export class PgTaskRepo implements TaskRepo {
  async add({ data }: { data: Task }): Promise<RepoResult<Task>> {
    const queryResult = await db
      .insert(tasksTable)
      .values(data.toDTO())
      .returning();

    if (queryResult.length < 1) {
      throw new NotCreatedError("User not created. Unexpected database error");
    }

    return {
      data: Task.fromDTO({ dto: queryResult[0] }),
    };
  }

  async getById({ id }: { id: string }): Promise<RepoResult<Task | null>> {
    const queryResult = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.id, id));

    return {
      data:
        queryResult.length > 0 ? Task.fromDTO({ dto: queryResult[0] }) : null,
    };
  }

  async find({
    query,
    options,
  }: {
    query?: string;
    options?: FindOptions<BaseTaskDTO> | undefined;
  }): Promise<FindResult<Task>> {
    const filters: SQL[] = [];
    if (options?.filters) {
      for (const filter of options.filters) {
        filters.push(eq(tasksTable[filter.key], filter.value));
      }
    }

    const [{ count: total }] = await db
      .select({ count: count() })
      .from(tasksTable);

    const pagination: Required<PaginationMeta["pagination"]> = {
      limit: options?.pagination?.limit ?? 20,
      offset: options?.pagination?.offset ?? 0,
      total,
    };

    const queryResult = await db
      .select()
      .from(tasksTable)
      .where(and(...filters))
      .offset(pagination.offset)
      .limit(pagination.limit);

    return {
      data: queryResult.map((dto) => Task.fromDTO({ dto })),
      meta: {
        pagination,
      },
    };
  }
  async update({
    id,
    data,
  }: {
    id: string;
    data: TaskUpdateDTO;
  }): Promise<RepoResult<Task | null, undefined>> {
    const queryResult = await db
      .update(tasksTable)
      .set(data)
      .where(eq(tasksTable.id, id))
      .returning();

    return {
      data:
        queryResult.length > 0 ? Task.fromDTO({ dto: queryResult[0] }) : null,
    };
  }
  async delete({
    id,
  }: {
    id: string;
  }): Promise<RepoResult<Task | null, undefined>> {
    const queryResult = await db
      .delete(tasksTable)
      .where(eq(tasksTable.id, id))
      .returning();

    return {
      data:
        queryResult.length > 0 ? Task.fromDTO({ dto: queryResult[0] }) : null,
    };
  }
}
