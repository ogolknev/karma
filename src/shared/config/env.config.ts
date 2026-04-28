import { config } from "dotenv";
import { EnvError } from "../errors";

config();

type LoadEnvOptions = {
    required?: boolean;
};
function loadEnv(key: string, options?: { required: true }): string;
function loadEnv(key: string, options?: { required: false }): string | undefined;
function loadEnv(
    key: string,
    { required = true }: LoadEnvOptions = { required: true },
): string | undefined {
    const value = process.env[key];

    if (!value && required) {
        throw new EnvError(key);
    }

    return value;
}

export const env = {
    DATABASE_URL: loadEnv("DATABASE_URL"),
    TEST_DATABASE_URL: loadEnv("TEST_DATABASE_URL"),
    EMAIL_FROM: loadEnv("EMAIL_FROM"),
    EMAIL_VERIFICATION_CODE_EXPIRATION_TIME: parseInt(
        loadEnv("EMAIL_VERIFICATION_CODE_EXPIRATION_TIME"),
    ),
};
