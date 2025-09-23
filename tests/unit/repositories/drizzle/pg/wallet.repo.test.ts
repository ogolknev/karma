import { afterAll, beforeAll, describe } from "bun:test";
import { execBeforeAll } from "./utils/exec-before-all";
import { execAfterAll } from "./utils/exec-after-all";
import { drizzle } from "drizzle-orm/node-postgres";
import config from "@/shared/config";
import { PgWalletRepo } from "@/infrastructure/db/drizzle/pg/repositories/wallet.repo";
import { User } from "@/core/modules/user";
import { PgUserRepo } from "@/infrastructure/db/drizzle/pg/repositories/user.repo";
import { Wallet } from "@/core/modules/wallet/wallet.entity";
import { shouldCRUD } from "./utils";

describe("Wallet Repository", async () => {
  const db = drizzle(config.env.TEST_DATABASE_URL);
  const walletRepo = new PgWalletRepo(db);
  const userRepo = new PgUserRepo(db);

  const WALLETS_NUMBER = 5;

  const owners: User[] = [];
  const wallets: Wallet[] = [];
  for (let i = 0; i < WALLETS_NUMBER; i++) {
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
  }

  owners.push(
    await User.create({
      name: "Pavel",
      username: `pavel#*`,
      password: "1sfaksndnKJSDcas1242fdsFSJAGH",
    })
  );

  const walletToAdd = await Wallet.create({
    userId: owners[WALLETS_NUMBER].id,
  });

  beforeAll(async () => {
    await execBeforeAll();

    for (const [i, wallet] of wallets.entries()) {
      await userRepo.add({ data: owners[i] });
      await walletRepo.add({ data: wallet });
    }

    await userRepo.add({ data: owners[WALLETS_NUMBER] });
  });

  afterAll(async () => {
    execAfterAll(db);
  });

  shouldCRUD({
    entityName: ["wallet", "wallets"],
    entities: wallets,
    entityToAdd: walletToAdd,
    repo: walletRepo,
    fieldForUpdate: "karma",
    valueForUpdate: 1000,
    db,
  });
});
