import { Transaction } from "@/core/modules/transaction/transaction.entity";
import { User } from "@/core/modules/user";
import { Wallet } from "@/core/modules/wallet/wallet.entity";
import { PgTransactionRepo } from "@/infrastructure/db/drizzle/pg/repositories/transaction.repo";
import { PgUserRepo } from "@/infrastructure/db/drizzle/pg/repositories/user.repo";
import { PgWalletRepo } from "@/infrastructure/db/drizzle/pg/repositories/wallet.repo";
import config from "@/shared/config";
import { afterAll, beforeAll, describe, it } from "bun:test";
import { drizzle } from "drizzle-orm/node-postgres";
import { execBeforeAll } from "./utils/exec-before-all";
import { execAfterAll } from "./utils/exec-after-all";
import { shouldCRUD } from "./utils";

describe("Transaction Repository", async () => {
  const db = drizzle(config.env.TEST_DATABASE_URL);
  const userRepo = new PgUserRepo(db);
  const walletRepo = new PgWalletRepo(db);
  const transactionRepo = new PgTransactionRepo(db);

  const TRANSACTION_NUMBER = 10;

  const owners: User[] = [];
  const wallets: Wallet[] = [];
  const transactions: Transaction[] = [];
  for (let i = 0; i < TRANSACTION_NUMBER + 1; i++) {
    const user = await User.create({
      name: "Pavel",
      username: `pavel#${i}`,
      password: "1sfaksndnKJSDcas1242fdsFSJAGH",
    });

    owners.push(user);

    const wallet = await Wallet.create({
      userId: owners[i].id,
    });

    wallets.push(wallet);

    const transaction = await Transaction.create({
      fromId: wallet.id,
      toId: wallet.id,
      type: "reserve",
      amount: 1000,
    });

    transactions.push(transaction);
  }

  beforeAll(async () => {
    await execBeforeAll();

    for (let i = 0; i < TRANSACTION_NUMBER; i++) {
      await userRepo.add({ data: owners[i] });
      await walletRepo.add({ data: wallets[i] });
      await transactionRepo.add({ data: transactions[i] });
    }

    await userRepo.add({ data: owners[TRANSACTION_NUMBER] });
    await walletRepo.add({ data: wallets[TRANSACTION_NUMBER] });
  });

  afterAll(async () => {
    await execAfterAll(db);
  });

  it(
    "CRUD",
    shouldCRUD({
      entities: transactions.slice(0, TRANSACTION_NUMBER),
      entityToAdd: transactions[TRANSACTION_NUMBER],
      repo: transactionRepo,
      db,
    })
  );
});
