import { config } from "dotenv";
import { EnvError } from "../errors";

config()

function loadEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new EnvError(key);
  }

  return value;
}

export const env = {
  DATABASE_URL: loadEnv("DATABASE_URL"),
  TEST_DATABASE_URL: loadEnv("TEST_DATABASE_URL"),
};
