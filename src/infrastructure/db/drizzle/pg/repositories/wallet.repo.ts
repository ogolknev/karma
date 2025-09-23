import {
  RepoResult,
  FindOptions,
  FindResult,
  PaginationMeta,
} from "@/core/modules/common/types";
import { WalletRepo } from "@/core/modules/wallet";
import { BaseWalletDTO } from "@/core/modules/wallet/dto/BaseWalletDTO";
import { Wallet } from "@/core/modules/wallet/wallet.entity";
import { walletsTable } from "../schema";
import { NotCreatedError } from "@/core/modules/common";
import { and, count, eq, SQL } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export class PgWalletRepo implements WalletRepo {
  constructor(protected db: NodePgDatabase<any>) {}

  async add({
    data,
  }: {
    data: Wallet;
  }): Promise<RepoResult<Wallet, undefined>> {
    const queryResult = await this.db
      .insert(walletsTable)
      .values(data.toDTO())
      .returning();

    if (queryResult.length < 1) {
      throw new NotCreatedError("User not created. Unexpected database error");
    }

    return {
      data: Wallet.fromDTO({ data: queryResult[0] }),
    };
  }
  async getById({
    id,
  }: {
    id: string;
  }): Promise<RepoResult<Wallet | null, undefined>> {
    const queryResult = await this.db
      .select()
      .from(walletsTable)
      .where(eq(walletsTable.id, id));

    return {
      data:
        queryResult.length > 0 ? Wallet.fromDTO({ data: queryResult[0] }) : null,
    };
  }

  async find({
    query,
    options,
  }: {
    query?: string;
    options?: FindOptions<BaseWalletDTO> | undefined;
  }): Promise<FindResult<Wallet>> {
    const filters: SQL[] = [];
    if (options?.filters) {
      for (const filter of options.filters) {
        filters.push(eq(walletsTable[filter.key], filter.value));
      }
    }

    const [{ count: total }] = await this.db
      .select({ count: count() })
      .from(walletsTable);

    const pagination: Required<PaginationMeta["pagination"]> = {
      limit: options?.pagination?.limit ?? 20,
      offset: options?.pagination?.offset ?? 0,
      total,
    };

    const queryResult = await this.db
      .select()
      .from(walletsTable)
      .where(and(...filters))
      .offset(pagination.offset)
      .limit(pagination.limit);

    return {
      data: queryResult.map((dto) => Wallet.fromDTO({ data: dto })),
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
    data: Partial<Omit<BaseWalletDTO, "id" | "userId">>;
  }): Promise<RepoResult<Wallet | null, undefined>> {
    const queryResult = await this.db
      .update(walletsTable)
      .set(data)
      .returning();

    return {
      data:
        queryResult.length > 0 ? Wallet.fromDTO({ data: queryResult[0] }) : null,
    };
  }

  async delete({
    id,
  }: {
    id: string;
  }): Promise<RepoResult<Wallet | null, undefined>> {
    const queryResult = await this.db
      .delete(walletsTable)
      .where(eq(walletsTable.id, id))
      .returning();

    return {
      data:
        queryResult.length > 0 ? Wallet.fromDTO({ data: queryResult[0] }) : null,
    };
  }
}
