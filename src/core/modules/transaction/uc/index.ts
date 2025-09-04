import { createUCs } from "../../common/uc";
import { Transaction } from "../transaction.entity";
import { TransactionFindByFromId } from "./transaction.find-by-from-id";
import { TransactionFindByUserId } from "./transaction.find-by-user-id";

export const transactionUCs = createUCs(Transaction, {
  extraUCs: {
    FindByUserId: TransactionFindByUserId,
    FindByFromId: TransactionFindByFromId,
  },
});
