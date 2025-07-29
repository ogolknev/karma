import { and, eq, inArray, SQL } from "drizzle-orm";
import { db } from "../../shared/db";
import { userTable } from "../../shared/db/schema";
import { ServiceResponse } from "../../shared/model";
import { hashPassword } from "../../shared/utils/encryption";
import { UserCreate, UserDTO, UserUpdate } from "./model";

export interface UserService {
  create(params: { data: UserCreate }): Promise<ServiceResponse<UserDTO>>;
  get(params: { id: string }): Promise<ServiceResponse<UserDTO | null>>;
  get(params: {
    ids?: string[];
    pagination?: any;
    sorting?: any;
    search?: any;
  }): Promise<ServiceResponse<UserDTO[]>>;
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
    pagination?: any;
    sorting?: any;
    search?: any;
  }): Promise<ServiceResponse<UserDTO[]>>;
  async get(
    params:
      | { id: string }
      | {
          ids?: string[];
          pagination?: any;
          sorting?: any;
          search?: any;
        }
  ): Promise<ServiceResponse<UserDTO | null> | ServiceResponse<UserDTO[]>> {
    if ("id" in params) {
      const user = (
        await db.select().from(userTable).where(eq(userTable.id, params.id))
      )[0];

      return {
        data: user ?? null,
      };
    } else {
      let filters: SQL[] = [];
      if (params.ids) filters.push(inArray(userTable.id, params.ids));

      const users = await db
        .select()
        .from(userTable)
        .where(and(...filters));

      return {
        data: users,
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
