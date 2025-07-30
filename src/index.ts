import Elysia from "elysia";
import { userRouter } from "./modules/user";
import { swagger } from "@elysiajs/swagger";

const app = new Elysia()
  .use(swagger({ provider: "swagger-ui" }))
  .use(userRouter)
  .listen(process.env.PORT!);

console.log(`\x1b[32m✔\x1b[0m Server listening: \x1b[32m${app.server?.url}\x1b[0m`);
