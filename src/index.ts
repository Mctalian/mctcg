
import Koa from "koa";
import { logger, env } from "./utils";
import { setupAppMiddleware } from "./server/middleware";

env.load();

const app = new Koa();

setupAppMiddleware(app);

app.listen(3000, () => {
  logger.info("Server listening on port 3000");
});
