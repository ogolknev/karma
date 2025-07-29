import { and, count, eq, inArray, SQL } from "drizzle-orm";
import { db } from "../../shared/db";
import { userTable } from "../../shared/db/schema";
import {
  PaginationMeta,
  PaginationParams,
  ServiceResponse,
} from "../../shared/model";
import { hashPassword } from "../../shared/utils/encryption";
import { UserCreate, UserDTO, UserUpdate } from "./model";

export interface UserService {
  create(params: { data: UserCreate }): Promise<ServiceResponse<UserDTO>>;
  get(params: { id: string }): Promise<ServiceResponse<UserDTO | null>>;
  get(params: {
    ids?: string[];
    pagination?: PaginationParams;
    sorting?: any;
    search?: any;
  }): Promise<ServiceResponse<UserDTO[], { pagination: PaginationMeta }>>;
  update(params: {
    id: string;
    data: UserUpdate;
  }): Promise<ServiceResponse<UserDTO | null>>;
  delete(params: { id: string }): Promise<ServiceResponse<UserDTO | null>>;
}

export class DrizzleUserService implements UserService {
  async create(params: {
    data: UserCreate;
  }): Promise<ServiceResponse<UserDTO>> {
    const createdUser = (
      await db
        .insert(userTable)
        .values({
          ...params.data,
          passwordHash: await hashPassword(params.data.password),
        })
        .returning()
    )[0];

    return { data: createdUser };
  }

  get(params: { id: string }): Promise<ServiceResponse<UserDTO | null>>;
  get(params: {
    ids?: string[];
    pagination?: PaginationParams;
    sorting?: any;
    search?: any;
  }): Promise<ServiceResponse<UserDTO[], { pagination: PaginationMeta }>>;
  async get(
    params:
      | { id: string }
      | {
          ids?: string[];
          pagination?: PaginationParams;
          sorting?: any;
          search?: any;
        }
  ): Promise<
    | ServiceResponse<UserDTO | null>
    | ServiceResponse<UserDTO[], { pagination: PaginationMeta }>
  > {
    if ("id" in params) {
      const user = (
        await db.select().from(userTable).where(eq(userTable.id, params.id))
      )[0];

      return {
        data: user ?? null,
      };
    } else {
      if ((params.ids && params.pagination) || (params.ids && params.search)) {
        throw new Error("Bad request");
      }

      let filters: SQL[] = [];
      if (params.ids) filters.push(inArray(userTable.id, params.ids));

      const pagination: Required<PaginationParams> = {
        offset: params.pagination?.offset || 0,
        limit: params.pagination?.limit || 20,
      };

      const users = await db
        .select()
        .from(userTable)
        .where(and(...filters))
        .offset(pagination.offset)
        .limit(pagination.limit);

      const total = (await db.select({ count: count() }).from(userTable))[0]
        .count;

      return {
        data: users,
        meta: {
          pagination: {
            ...pagination,
            total,
          },
        },
      };
    }
  }

  async update(params: {
    id: string;
    data: UserUpdate;
  }): Promise<ServiceResponse<UserDTO | null>> {
    const updatedUser = (
      await db
        .update(userTable)
        .set(params.data)
        .where(eq(userTable.id, params.id))
        .returning()
    )[0];

    return {
      data: updatedUser ?? null,
    };
  }
  async delete(params: {
    id: string;
  }): Promise<ServiceResponse<UserDTO | null>> {
    const deletedUser = (
      await db.delete(userTable).where(eq(userTable.id, params.id)).returning()
    )[0];

    return {
      data: deletedUser ?? null,
    };
  }
}
