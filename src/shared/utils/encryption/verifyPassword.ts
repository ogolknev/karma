import argon2 from "argon2";

export async function verifyPassword(hash: string, password: string) {
  try {
    return await argon2.verify(hash, password)
  } catch (error) {
    console.error(error)
    throw new Error("Failed to verify password")
  }
}