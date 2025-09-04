import { transactionTypes } from "../const/transaction-types";

export type TransactionType = (typeof transactionTypes)[number];
