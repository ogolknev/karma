import { RepoResult } from "@/core/modules/common/types";
import { EmailVerificator, EmailVerificatorRepo } from "@/core/modules/email-verificator";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { emailVerificatorsTable } from "../schema";
import { NotCreatedError } from "@/core/modules/common";
import { eq } from "drizzle-orm";

export class PgEmailVerificatorRepo implements EmailVerificatorRepo {
    constructor(protected db: NodePgDatabase<any>) {}

    async add({
        data,
    }: {
        data: EmailVerificator;
    }): Promise<RepoResult<EmailVerificator, undefined>> {
        const queryResult = await this.db
            .insert(emailVerificatorsTable)
            .values(data.toDTO())
            .returning();

        if (queryResult.length < 1) {
            throw new NotCreatedError("Email verificator not created. Unexpected database error");
        }

        return {
            data: EmailVerificator.fromDTO({ data: queryResult[0] }),
        };
    }

    async getById({ id }: { id: string }): Promise<RepoResult<EmailVerificator | null, undefined>> {
        const queryResult = await this.db
            .select()
            .from(emailVerificatorsTable)
            .where(eq(emailVerificatorsTable.id, id));

        return {
            data:
                queryResult.length > 0 ? EmailVerificator.fromDTO({ data: queryResult[0] }) : null,
        };
    }

    async getByUserId({
        userId,
    }: {
        userId: string;
    }): Promise<RepoResult<EmailVerificator | null>> {
        const queryResult = await this.db
            .select()
            .from(emailVerificatorsTable)
            .where(eq(emailVerificatorsTable.userId, userId));

        return {
            data:
                queryResult.length > 0 ? EmailVerificator.fromDTO({ data: queryResult[0] }) : null,
        };
    }

    find!: never;

    update!: never;

    async delete({ id }: { id: string }): Promise<RepoResult<EmailVerificator | null, undefined>> {
        const queryResult = await this.db
            .delete(emailVerificatorsTable)
            .where(eq(emailVerificatorsTable.id, id))
            .returning();

        return {
            data:
                queryResult.length > 0 ? EmailVerificator.fromDTO({ data: queryResult[0] }) : null,
        };
    }
}
