import z from "zod";

export const walletSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  karma: z.int().nonnegative(),
  respect: z.int().nonnegative()
})