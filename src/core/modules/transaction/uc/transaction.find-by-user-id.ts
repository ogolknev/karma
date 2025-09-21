import { FindOptions } from "../../common/types";
import { BaseUC } from "../../common/uc";
import { BaseTransactionDTO } from "../dto/BaseTransactionDTO";
import { TransactionRepo } from "../transaction.repo";

export class TransactionFindByUserId extends BaseUC<TransactionRepo> {
  async execute({
    id: userId,
    options,
  }: {
    id: string;
    options?: FindOptions<BaseTransactionDTO>;
  }) {
    return await this.repo.findByUserId({ userId, options });
  }
}
