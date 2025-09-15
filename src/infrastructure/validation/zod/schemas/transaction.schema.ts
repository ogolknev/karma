import { transactionTypes } from "@/core/modules/transaction/const/transaction-types";
import z from "zod";

export const transactionSchema = z.object({
  id: z.uuid(),
  fromId: z.uuid(),
  toId: z.uuid(),
  taskId: z.uuid().nullable(),
  type: z.enum(transactionTypes),
  amount: z.int().nonnegative(),
  createdAt: z.int()
})