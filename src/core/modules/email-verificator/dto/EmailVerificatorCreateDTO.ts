import { BaseEmailVerificatorDTO } from "./BaseEmailVerificatorDTO";

export type EmailVerificatorCreateDTO = Omit<
    BaseEmailVerificatorDTO,
    "codeHash" | "id" | "expiresAt"
> & { expiresAt?: Date; code: string };
