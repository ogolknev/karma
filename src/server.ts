import { app } from "./app";

app.listen(process.env.PORT!);

console.log(`\x1b[32m✔\x1b[0m Server listening on: \x1b[32m${app.server?.url}\x1b[0m`);