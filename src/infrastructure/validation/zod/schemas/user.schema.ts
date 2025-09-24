import z from "zod";

export const userSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  username: z.string(),
  passwordHash: z.string()
})