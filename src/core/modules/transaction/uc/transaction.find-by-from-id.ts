import { FindOptions } from "../../common/types";
import { BaseUC } from "../../common/uc";
import { BaseTransactionDTO } from "../dto/BaseTransactionDTO";
import { TransactionRepo } from "../transaction.repo";

export class TransactionFindByFromId extends BaseUC<TransactionRepo> {
  async execute({
    walletId,
    options,
  }: {
    walletId: string;
    options?: FindOptions<BaseTransactionDTO>;
  }) {
    return await this.repo.findByFromId({ walletId, options });
  }
}
