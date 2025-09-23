import { spawnSync } from "bun";

export async function execBeforeAll() {
  spawnSync(["bun", "drizzle-kit", "push", "--config=test.drizzle.config.ts"], {
    stdout: "inherit",
  });
}
