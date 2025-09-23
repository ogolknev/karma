import {
  RepoResult,
  FindOptions,
  FindResult,
  PaginationMeta,
} from "@/core/modules/common/types";
import { User, UserRepo } from "@/core/modules/user";
import { BaseUserDTO, UserUpdateDTO } from "@/core/modules/user/dto";
import { usersTable } from "../schema";
import { and, count, eq, SQL } from "drizzle-orm";
import { NotCreatedError } from "@/core/modules/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export class PgUserRepo implements UserRepo {
  constructor(protected db: NodePgDatabase<any>) {}

  async getByUsername(username: string): Promise<RepoResult<User | null>> {
    const queryResult = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username));

    return {
      data:
        queryResult.length > 0 ? User.fromDTO({ data: queryResult[0] }) : null,
    };
  }

  async add({ data }: { data: User }): Promise<RepoResult<User>> {
    const queryResult = await this.db
      .insert(usersTable)
      .values(data.toDTO())
      .returning();

    if (queryResult.length < 1) {
      throw new NotCreatedError("User not created. Unexpected database error");
    }

    return {
      data: User.fromDTO({ data: queryResult[0] }),
    };
  }

  async getById({ id }: { id: string }): Promise<RepoResult<User | null>> {
    const queryResult = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));

    return {
      data:
        queryResult.length > 0 ? User.fromDTO({ data: queryResult[0] }) : null,
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

    const [{ count: total }] = await this.db
      .select({ count: count() })
      .from(usersTable);

    const pagination: Required<PaginationMeta["pagination"]> = {
      limit: options?.pagination?.limit ?? 20,
      offset: options?.pagination?.offset ?? 0,
      total,
    };

    const queryResult = await this.db
      .select()
      .from(usersTable)
      .where(and(...filters))
      .offset(pagination.offset)
      .limit(pagination.limit);

    return {
      data: queryResult.map((dto) => User.fromDTO({ data: dto })),
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
    const queryResult = await this.db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id))
      .returning();

    return {
      data:
        queryResult.length > 0 ? User.fromDTO({ data: queryResult[0] }) : null,
    };
  }
  async delete({
    id,
  }: {
    id: string;
  }): Promise<RepoResult<User | null, undefined>> {
    const queryResult = await this.db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();

    return {
      data:
        queryResult.length > 0 ? User.fromDTO({ data: queryResult[0] }) : null,
    };
  }
}
