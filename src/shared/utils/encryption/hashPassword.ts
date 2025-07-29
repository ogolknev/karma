import argon2 from "argon2";

export async function hashPassword(password: string) {
  try {
    return await argon2.hash(password);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to hash password");
  }
}
