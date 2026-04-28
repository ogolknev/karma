import { describe, expect, it } from "bun:test";
import { UserRegister } from "@/application/auth/user.register.uc";
import {
  EmailVerificator,
  type EmailVerificatorRepo,
} from "@/core/modules/email-verificator";
import type { BaseEmailVerificatorDTO } from "@/core/modules/email-verificator/dto";
import type { EmailProvider } from "@/core/providers/email";
import { EmailExistsError, UsernameExistsError } from "@/core/modules/user/errors";
import { User, type UserRepo } from "@/core/modules/user";
import type { BaseUserDTO, UserUpdateDTO } from "@/core/modules/user/dto";
import type { FindOptions, FindResult, RepoResult } from "@/core/modules/common/types";

class InMemoryUserRepo implements UserRepo {
  private users = new Map<string, User>();

  async add({ data }: { data: User }): Promise<RepoResult<User>> {
    this.users.set(data.id, data);

    return { data };
  }

  async getById({ id }: { id: string }): Promise<RepoResult<User | null>> {
    return { data: this.users.get(id) ?? null };
  }

  async getByUsername({ username }: { username: string }): Promise<RepoResult<User | null>> {
    const user = [...this.users.values()].find((item) => item.username === username) ?? null;

    return { data: user };
  }

  async getByEmail({ email }: { email: string }): Promise<RepoResult<User | null>> {
    const user = [...this.users.values()].find((item) => item.email === email) ?? null;

    return { data: user };
  }

  async find({
    query: _query,
    options: _options,
  }: {
    query?: string;
    options?: FindOptions<BaseUserDTO>;
  }): Promise<FindResult<User>> {
    return {
      data: [...this.users.values()],
      meta: {
        pagination: {
          limit: this.users.size,
          offset: 0,
          total: this.users.size,
        },
      },
    };
  }

  async update({
    id,
    data,
  }: {
    id: string;
    data: UserUpdateDTO;
  }): Promise<RepoResult<User | null>> {
    const user = this.users.get(id);

    if (!user) {
      return { data: null };
    }

    user.update(data);
    this.users.set(id, user);

    return { data: user };
  }

  async delete({ id }: { id: string }): Promise<RepoResult<User | null>> {
    const user = this.users.get(id) ?? null;

    if (user) {
      this.users.delete(id);
    }

    return { data: user };
  }
}

class InMemoryEmailVerificatorRepo implements EmailVerificatorRepo {
  private emailVerificators = new Map<string, EmailVerificator>();

  find!: never;
  update!: never;

  async add({ data }: { data: EmailVerificator }): Promise<RepoResult<EmailVerificator>> {
    this.emailVerificators.set(data.id, data);

    return { data };
  }

  async getById({ id }: { id: string }): Promise<RepoResult<EmailVerificator | null>> {
    return { data: this.emailVerificators.get(id) ?? null };
  }

  async getByUserId({ userId }: { userId: string }): Promise<RepoResult<EmailVerificator | null>> {
    const emailVerificator =
      [...this.emailVerificators.values()].find((item) => item.userId === userId) ?? null;

    return { data: emailVerificator };
  }

  async delete({ id }: { id: string }): Promise<RepoResult<EmailVerificator | null>> {
    const emailVerificator = this.emailVerificators.get(id) ?? null;

    if (emailVerificator) {
      this.emailVerificators.delete(id);
    }

    return { data: emailVerificator };
  }
}

class MockEmailProvider implements EmailProvider {
  sentEmails: {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
  }[] = [];

  async send(options: {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<void> {
    this.sentEmails.push(options);
  }
}

describe("UserRegister", () => {
  it("normalizes email and sends verification email", async () => {
    const userRepo = new InMemoryUserRepo();
    const emailVerificatorRepo = new InMemoryEmailVerificatorRepo();
    const emailProvider = new MockEmailProvider();
    const uc = new UserRegister(userRepo, emailVerificatorRepo, emailProvider);

    const result = await uc.execute({
      name: "Pavel",
      username: "pavel",
      email: "  PaVel@Example.COM  ",
      password: "secret",
    });

    expect(result.user.email).toBe("pavel@example.com");
    expect(result.emailVerificator.userId).toBe(result.user.id);
    expect(result.code).toHaveLength(6);
    expect(emailProvider.sentEmails).toHaveLength(1);
    expect(emailProvider.sentEmails[0]).toMatchObject({
      from: process.env.EMAIL_FROM,
      to: "pavel@example.com",
      subject: "Verify your email",
    });
    expect(emailProvider.sentEmails[0].text).toContain(result.code);
  });

  it("throws when username already exists", async () => {
    const userRepo = new InMemoryUserRepo();
    const emailVerificatorRepo = new InMemoryEmailVerificatorRepo();
    const emailProvider = new MockEmailProvider();
    const uc = new UserRegister(userRepo, emailVerificatorRepo, emailProvider);

    await userRepo.add({
      data: await User.create({
        name: "Pavel",
        username: "pavel",
        email: "pavel@example.com",
        password: "secret",
      }),
    });

    await expect(
      uc.execute({
        name: "Other",
        username: "pavel",
        email: "other@example.com",
        password: "secret",
      }),
    ).rejects.toBeInstanceOf(UsernameExistsError);
  });

  it("throws when normalized email already exists", async () => {
    const userRepo = new InMemoryUserRepo();
    const emailVerificatorRepo = new InMemoryEmailVerificatorRepo();
    const emailProvider = new MockEmailProvider();
    const uc = new UserRegister(userRepo, emailVerificatorRepo, emailProvider);

    await userRepo.add({
      data: await User.create({
        name: "Pavel",
        username: "pavel",
        email: "pavel@example.com",
        password: "secret",
      }),
    });

    await expect(
      uc.execute({
        name: "Other",
        username: "other",
        email: "PAVEL@EXAMPLE.COM",
        password: "secret",
      }),
    ).rejects.toBeInstanceOf(EmailExistsError);
  });
});
