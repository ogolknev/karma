import { EmailVerificator, type EmailVerificatorRepo } from "@/core/modules/email-verificator";
import { type EmailProvider } from "@/core/providers/email";
import { EmailExistsError, UsernameExistsError } from "@/core/modules/user/errors";
import { User, type UserRepo } from "@/core/modules/user";
import config from "@/shared/config";

type UserRegisterParams = {
    username: string;
    password: string;
    email: string;
    name?: string;
};

type UserRegisterResult = {
    user: User;
    emailVerificator: EmailVerificator;
    code: string;
};

export class UserRegister {
    private static normalizeEmail(email: string) {
        return email.trim().toLowerCase();
    }

    constructor(
        protected userRepo: UserRepo,
        protected emailVerificatorRepo: EmailVerificatorRepo,
        protected emailProvider: EmailProvider,
    ) {}

    async execute({
        username,
        password,
        email,
        name = username,
    }: UserRegisterParams): Promise<UserRegisterResult> {
        const code = String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
        const normalizedEmail = UserRegister.normalizeEmail(email);
        const { data: existingUser } = await this.userRepo.getByUsername({ username });

        if (existingUser) {
            throw new UsernameExistsError(username);
        }

        const { data: existingEmailUser } = await this.userRepo.getByEmail({
            email: normalizedEmail,
        });

        if (existingEmailUser) {
            throw new EmailExistsError(normalizedEmail);
        }

        const user = await User.create({
            username,
            password,
            email: normalizedEmail,
            name,
        });
        const { data: createdUser } = await this.userRepo.add({ data: user });

        const emailVerificator = await EmailVerificator.create({
            userId: createdUser.id,
            code,
        });
        const { data: createdEmailVerificator } = await this.emailVerificatorRepo.add({
            data: emailVerificator,
        });

        await this.emailProvider.send({
            from: config.env.EMAIL_FROM,
            to: createdUser.email,
            subject: "Verify your email",
            text: `Your verification code: ${code}`,
            html: `<p>Your verification code: <b>${code}</b></p>`,
        });

        return {
            code,
            user: createdUser,
            emailVerificator: createdEmailVerificator,
        };
    }
}
