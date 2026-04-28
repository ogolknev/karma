import { BaseRepo } from "@/core/modules/common";
import { EmailVerificator } from "./email-verificator.entity";
import { BaseEmailVerificatorDTO, EmailVerificatorUpdateDTO } from "./dto";

export interface EmailVerificatorRepo
  extends BaseRepo<
    EmailVerificator,
    BaseEmailVerificatorDTO,
    EmailVerificatorUpdateDTO
  > {
  getByUserId({
    userId,
  }: {
    userId: string;
  }): Promise<{ data: EmailVerificator | null }>;
  update: never;
  find: never;
}
