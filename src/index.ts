import Elysia from "elysia";

const app = new Elysia().listen(process.env.PORT!)

console.log(`\x1b[32m✔\x1b[0m Server listening: \x1b[32m${app.server?.url}\x1b[0m`)
