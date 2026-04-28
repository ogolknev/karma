import { generateId, hashPassword, verifyPassword } from "@/shared/utils/crypto";
import { BaseUserDTO, UserCreateDTO, UserUpdateDTO } from "./dto";
import { BaseEntity } from "../common";

export class User extends BaseEntity<UserUpdateDTO> {
    private static normalizeEmail(email: string) {
        return email.trim().toLowerCase();
    }

    constructor(
        id: string,
        public name: string,
        public email: string,
        public isEmailVerified: boolean,
        public username: string,
        private passwordHash: string,
    ) {
        super(id);
    }

    static async create(data: UserCreateDTO) {
        const id = generateId();
        const passwordHash = await hashPassword(data.password);
        const email = this.normalizeEmail(data.email);

        return new User(id, data.name, email, false, data.username, passwordHash);
    }

    static fromDTO({ data }: { data: BaseUserDTO }) {
        return new User(
            data.id,
            data.name,
            data.email,
            data.isEmailVerified,
            data.username,
            data.passwordHash,
        );
    }

    update(data: UserUpdateDTO) {
        this.name = data.name ?? this.name;
        this.email = data.email ? User.normalizeEmail(data.email) : this.email;
        this.isEmailVerified = data.isEmailVerified ?? this.isEmailVerified;
    }

    toDTO(): BaseUserDTO {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            isEmailVerified: this.isEmailVerified,
            username: this.username,
            passwordHash: this.passwordHash,
        };
    }

    async verify(password: string) {
        return verifyPassword(this.passwordHash, password);
    }
}
