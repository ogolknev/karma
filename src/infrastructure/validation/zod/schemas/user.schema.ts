import z from "zod";

export const userSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  username: z.string(),
  passwordHash: z.string()
})