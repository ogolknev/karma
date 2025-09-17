import { TransactionType } from "../types/TransactionType";

export interface BaseTransactionDTO {
  id: string,
  fromId: string,
  toId: string,
  taskId?: string | null,
  type: TransactionType,
  amount: number,
  createdAt: Date
}