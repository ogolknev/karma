import { BaseRepo } from "../common";
import { FindOptions, FindResult, RepoResult } from "../common/types";
import { TransactionUpdateDTO } from "./dto";
import { Transaction } from "./transaction.entity";

export interface TransactionRepo
  extends BaseRepo<Transaction, TransactionUpdateDTO> {
  findByUserId({
    userId,
    options,
  }: {
    userId: string;
    options?: FindOptions;
  }): Promise<RepoResult<FindResult<Transaction>>>;
  findByFromId({
    walletId,
    options,
  }: {
    walletId: string;
    options?: FindOptions;
  }): Promise<RepoResult<FindResult<Transaction>>>;
}
