import { BaseRepo } from "../common";
import { FindOptions, FindResult, RepoResult } from "../common/types";
import { TransactionUpdateDTO } from "./dto";
import { BaseTransactionDTO } from "./dto/BaseTransactionDTO";
import { Transaction } from "./transaction.entity";

export interface TransactionRepo
  extends BaseRepo<Transaction, BaseTransactionDTO, TransactionUpdateDTO> {
  findByUserId({
    userId,
    options,
  }: {
    userId: string;
    options?: FindOptions<BaseTransactionDTO>;
  }): Promise<RepoResult<FindResult<Transaction>>>;
  findByFromId({
    walletId,
    options,
  }: {
    walletId: string;
    options?: FindOptions<BaseTransactionDTO>;
  }): Promise<RepoResult<FindResult<Transaction>>>;
}
