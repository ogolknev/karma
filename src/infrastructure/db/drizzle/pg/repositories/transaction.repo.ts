import {
  FindOptions,
  RepoResult,
  FindResult,
  PaginationMeta,
} from "@/core/modules/common/types";
import { TransactionUpdateDTO } from "@/core/modules/transaction/dto";
import { BaseTransactionDTO } from "@/core/modules/transaction/dto/BaseTransactionDTO";
import { Transaction } from "@/core/modules/transaction/transaction.entity";
import { TransactionRepo } from "@/core/modules/transaction/transaction.repo";
import { transactionsTable } from "../schema";
import { NotCreatedError } from "@/core/modules/common";
import { and, count, eq, SQL } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export class PgTransactionRepo implements TransactionRepo {
  constructor(protected db: NodePgDatabase<any>) {}

  findByUserId({
    userId,
    options,
  }: {
    userId: string;
    options?: FindOptions<BaseTransactionDTO>;
  }): Promise<RepoResult<FindResult<Transaction>>> {
    throw new Error("Method not implemented.");
  }
  findByFromId({
    walletId,
    options,
  }: {
    walletId: string;
    options?: FindOptions<BaseTransactionDTO>;
  }): Promise<RepoResult<FindResult<Transaction>>> {
    throw new Error("Method not implemented.");
  }
  async add({ data }: { data: Transaction }): Promise<RepoResult<Transaction>> {
    const queryResult = await this.db
      .insert(transactionsTable)
      .values(data.toDTO())
      .returning();

    if (queryResult.length < 1) {
      throw new NotCreatedError("User not created. Unexpected database error");
    }

    return {
      data: Transaction.fromDTO({ data: queryResult[0] }),
    };
  }
  async getById({
    id,
  }: {
    id: string;
  }): Promise<RepoResult<Transaction | null, undefined>> {
    const queryResult = await this.db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.id, id));

    return {
      data:
        queryResult.length > 0
          ? Transaction.fromDTO({ data: queryResult[0] })
          : null,
    };
  }
  async find({
    query,
    options,
  }: {
    query?: string;
    options?: FindOptions<BaseTransactionDTO> | undefined;
  }): Promise<FindResult<Transaction>> {
    const filters: SQL[] = [];
    if (options?.filters) {
      for (const filter of options.filters) {
        filters.push(eq(transactionsTable[filter.key], filter.value));
      }
    }

    const [{ count: total }] = await this.db
      .select({ count: count() })
      .from(transactionsTable);

    const pagination: Required<PaginationMeta["pagination"]> = {
      limit: options?.pagination?.limit ?? 20,
      offset: options?.pagination?.offset ?? 0,
      total,
    };

    const queryResult = await this.db
      .select()
      .from(transactionsTable)
      .where(and(...filters))
      .offset(pagination.offset)
      .limit(pagination.limit);

    return {
      data: queryResult.map((dto) => Transaction.fromDTO({ data: dto })),
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
    data: TransactionUpdateDTO;
  }): Promise<RepoResult<Transaction | null>> {
    const queryResult = await this.db
      .update(transactionsTable)
      .set(data)
      .where(eq(transactionsTable.id, id))
      .returning();

    return {
      data:
        queryResult.length > 0
          ? Transaction.fromDTO({ data: queryResult[0] })
          : null,
    };
  }

  async delete({
    id,
  }: {
    id: string;
  }): Promise<RepoResult<Transaction | null>> {
    const queryResult = await this.db
      .delete(transactionsTable)
      .where(eq(transactionsTable.id, id))
      .returning();

    return {
      data:
        queryResult.length > 0
          ? Transaction.fromDTO({ data: queryResult[0] })
          : null,
    };
  }
}
