import {
  RepoResult,
  FindOptions,
  FindResult,
  PaginationMeta,
} from "@/core/modules/common/types";
import { User, UserRepo } from "@/core/modules/user";
import { BaseUserDTO, UserUpdateDTO } from "@/core/modules/user/dto";
import { db } from "..";
import { usersTable } from "../schema";
import { and, count, eq, SQL } from "drizzle-orm";
import { NotCreatedError } from "@/core/modules/common";

export class PgUserRepo implements UserRepo {
  async getByUsername(username: string): Promise<RepoResult<User | null>> {
    const queryResult = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username));

    return {
      data:
        queryResult.length > 0 ? User.fromDTO({ dto: queryResult[0] }) : null,
    };
  }

  async add({ data }: { data: User }): Promise<RepoResult<User>> {
    const queryResult = await db
      .insert(usersTable)
      .values(data.toDTO())
      .returning();

    if (queryResult.length < 1) {
      throw new NotCreatedError("User not created. Unexpected database error");
    }

    return {
      data: User.fromDTO({ dto: queryResult[0] }),
    };
  }

  async getById({ id }: { id: string }): Promise<RepoResult<User | null>> {
    const queryResult = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));

    return {
      data:
        queryResult.length > 0 ? User.fromDTO({ dto: queryResult[0] }) : null,
    };
  }

  async find({
    query,
    options,
  }: {
    query?: string;
    options?: FindOptions<BaseUserDTO> | undefined;
  }): Promise<FindResult<User>> {
    const filters: SQL[] = [];
    if (options?.filters) {
      for (const filter of options.filters) {
        filters.push(eq(usersTable[filter.key], filter.value));
      }
    }

    const [{ count: total }] = await db
      .select({ count: count() })
      .from(usersTable);

    const pagination: Required<PaginationMeta["pagination"]> = {
      limit: options?.pagination?.limit ?? 20,
      offset: options?.pagination?.offset ?? 0,
      total,
    };

    const queryResult = await db
      .select()
      .from(usersTable)
      .where(and(...filters))
      .offset(pagination.offset)
      .limit(pagination.limit);

    return {
      data: queryResult.map((dto) => User.fromDTO({ dto })),
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
    data: UserUpdateDTO;
  }): Promise<RepoResult<User | null, undefined>> {
    const queryResult = await db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id))
      .returning();

    return {
      data:
        queryResult.length > 0 ? User.fromDTO({ dto: queryResult[0] }) : null,
    };
  }
  async delete({
    id,
  }: {
    id: string;
  }): Promise<RepoResult<User | null, undefined>> {
    const queryResult = await db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();

    return {
      data:
        queryResult.length > 0 ? User.fromDTO({ dto: queryResult[0] }) : null,
    };
  }
}
