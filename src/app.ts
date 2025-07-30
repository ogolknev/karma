import Elysia from "elysia";
import { userRouter } from "./modules/user";
import { swagger } from "@elysiajs/swagger";

export const app = new Elysia()
  .use(swagger({ provider: "swagger-ui" }))
  .use(userRouter)
  

