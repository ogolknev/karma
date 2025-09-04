import { TransactionType } from "../types/TransactionType";

export interface BaseTransactionDTO {
  id: string,
  fromId: string,
  toId: string,
  taskId?: string,
  type: TransactionType,
  amount: number,
  createdAt: string
}