import { verify } from "argon2";

export async function verifyPassword(hash: string, password: string) {
  return await verify(hash, password);
}