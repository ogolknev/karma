# AGENTS.md

## Stack And Shape
- Runtime and package manager are Bun-based: use `bun install`, `bun run dev`, and `bun test` rather than npm/pnpm commands.
- The only HTTP entrypoint is `src/index.ts`; it currently serves a minimal Hono app with `GET /` only.
- Most project logic lives below `src/core` and `src/infrastructure`; these domain entities, use cases, and Drizzle repositories are largely not wired into the Hono app yet.

## Verified Commands
- Install deps: `bun install`
- Start dev server: `bun run dev`
- Generate main DB migrations: `bun run generate:migrations`
- Apply main DB migrations: `bun run migrate`
- Generate test DB migrations: `bun run test:generate:migrations`
- Apply test DB migrations: `bun run test:migrate`
- Push schema directly to test DB: `bun run test:push`
- Type-check when needed: `bunx tsc --noEmit`

## Database And Env
- Drizzle reads the schema from `src/infrastructure/db/drizzle/pg/schema.ts`.
- Main Drizzle config writes migrations to `drizzle/`; test Drizzle config writes to `drizzle/test/`.
- `src/shared/config/env.config.ts` loads env via `dotenv.config()` on import.
- Required env for normal app/codegen paths: `DATABASE_URL`, `EMAIL_VERIFICATION_CODE_EXPIRATION_TIME`.
- `TEST_DATABASE_URL` is optional at process start, but repository tests and `test.drizzle.config.ts` expect it to exist.

## Testing Gotchas
- There is no `test` script in `package.json`; run tests with Bun directly, for example `bun test` or `bun test tests/unit/repositories/user.repo.test.ts`.
- Repository tests are integration-style Postgres tests, not pure unit tests: each suite creates a Drizzle client with `config.env.TEST_DATABASE_URL`.
- Test setup runs `bun drizzle-kit push --config=test.drizzle.config.ts` in `beforeAll`, so the test DB schema is created from the current schema rather than from SQL migrations.
- Test teardown drops and recreates the `public` schema. Point `TEST_DATABASE_URL` at an isolated disposable database.

## Codebase Conventions
- Use the `@/*` path alias from `tsconfig.json` for imports rooted at `src`.
- If you change domain DTOs/entities/repos, check the matching Drizzle schema and repository tests together; the repository layer mirrors the domain model closely.
- When a repo/entity method is intentionally unsupported for a module, mark it as `method!: never;` rather than leaving a stub implementation or using deprecation markers.
- No repo-local lint/format config, CI workflow, or extra agent instruction files were found. Do not assume hidden checks beyond TypeScript, Bun tests, and Drizzle commands.

## Commit Style
- Match the existing commit history format: `type(scope): summary`.
- Prefer `feat`, `refactor`, `fix`, `test`, and `chore`; use `style` only for formatting-only changes.
- Keep subjects short and imperative, with repo-specific scopes like `user`, `auth`, `core`, `infrastructure`, `config`, or `db`.
- Split config, docs, feature, and refactor changes into separate commits when they are logically independent.
