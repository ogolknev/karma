import { BaseTransactionDTO } from "./BaseTransactionDTO";

export type TransactionCreateDTO = Omit<BaseTransactionDTO, "id" | "createdAt">;
