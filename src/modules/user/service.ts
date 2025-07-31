import { and, asc, count, desc, eq, inArray, SQL } from "drizzle-orm";
import { db } from "../../shared/db";
import { userTable } from "../../shared/db/schema";
import { type PaginationParams } from "../../shared/model";
import { hashPassword } from "../../shared/utils/encryption";
import type {
  UserCreateParams,
  UserGetManyParams,
  UserGetOneParams,
  UserGetParams,
  UserCreateResponse,
  UserDeleteParams,
  UserDeleteResponse,
  UserGetManyResponse,
  UserGetOneResponse,
  UserGetResponse,
  UserUpdateParams,
  UserUpdateResponse,
  UserDTO,
} from "./model";

export interface UserService {
  create(params: UserCreateParams): Promise<UserCreateResponse>;
  get(params: UserGetOneParams): Promise<UserGetOneResponse>;
  get(params: UserGetManyParams): Promise<UserGetManyResponse>;
  update(params: UserUpdateParams): Promise<UserUpdateResponse>;
  delete(params: UserDeleteParams): Promise<UserDeleteResponse>;
}

export class DrizzleUserService implements UserService {
  async create(params: UserCreateParams): Promise<UserCreateResponse> {
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

  get(params: UserGetOneParams): Promise<UserGetOneResponse>;
  get(params: UserGetManyParams): Promise<UserGetManyResponse>;
  async get(params: UserGetParams): Promise<UserGetResponse> {
    if ("id" in params) {
      const user = (await db.select().from(userTable).where(eq(userTable.id, params.id)))[0];

      return {
        data: user ?? null,
      };
    } else {
      const filters: SQL[] = [];
      const sorting: SQL[] = [];
      const pagination: Required<PaginationParams> = {
        offset: 0,
        limit: 20,
      };

      if ("ids" in params) filters.push(inArray(userTable.id, params.ids));
      else {
        pagination.offset = params.pagination?.offset ?? pagination.offset;
        pagination.limit = params.pagination?.limit ?? pagination.limit;
      }

      params.sorting?.forEach((sortingParams) => {
        if (sortingParams.order === "desc") {
          sorting.push(desc(userTable[sortingParams.by as keyof UserDTO]));
        } else {
          sorting.push(asc(userTable[sortingParams.by as keyof UserDTO]));
        }
      });

      const users = await db
        .select()
        .from(userTable)
        .where(and(...filters))
        .orderBy(...sorting)
        .offset(pagination.offset)
        .limit(pagination.limit);

      const total = (await db.select({ count: count() }).from(userTable))[0].count;

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

  async update(params: UserUpdateParams): Promise<UserUpdateResponse> {
    const updatedUser = (await db.update(userTable).set(params.data).where(eq(userTable.id, params.id)).returning())[0];

    return {
      data: updatedUser ?? null,
    };
  }
  async delete(params: UserDeleteParams): Promise<UserDeleteResponse> {
    const deletedUser = (await db.delete(userTable).where(eq(userTable.id, params.id)).returning())[0];

    return {
      data: deletedUser ?? null,
    };
  }
}
