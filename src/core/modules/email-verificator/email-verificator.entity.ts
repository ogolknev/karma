import { generateId, hashPassword, verifyPassword } from "@/shared/utils/crypto";
import { BaseEntity } from "../common";
import {
    BaseEmailVerificatorDTO,
    EmailVerificatorCreateDTO,
    EmailVerificatorUpdateDTO,
} from "./dto";
import config from "@/shared/config";

export class EmailVerificator extends BaseEntity<
    EmailVerificatorUpdateDTO,
    BaseEmailVerificatorDTO
> {
    constructor(
        id: string,
        public userId: string,
        private codeHash: string,
        public expiresAt: Date,
    ) {
        super(id);
    }

    update!: never;

    toDTO() {
        return {
            id: this.id,
            userId: this.userId,
            codeHash: this.codeHash,
            expiresAt: this.expiresAt,
        };
    }

    verifyCode(code: string) {
        return verifyPassword(this.codeHash, code);
    }

    static async create(data: EmailVerificatorCreateDTO) {
        const id = generateId();
        const code = data.code;
        const codeHash = await hashPassword(code);

        if (!data.expiresAt) {
            const expiresAt = new Date();

            expiresAt.setTime(
                expiresAt.getTime() + config.env.EMAIL_VERIFICATION_CODE_EXPIRATION_TIME,
            );

            data.expiresAt = expiresAt;
        }

        return new EmailVerificator(id, data.userId, codeHash, data.expiresAt);
    }

    static fromDTO({ data }: { data: BaseEmailVerificatorDTO }) {
        return new EmailVerificator(data.id, data.userId, data.codeHash, data.expiresAt);
    }
}
