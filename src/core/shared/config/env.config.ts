import "dotenv/config";
import { EnvError } from "../errors";

function loadEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new EnvError(key);
  }

  return value;
}

export const env = {
  DATABASE_URL: loadEnv("DATABASE_URL"),
};
