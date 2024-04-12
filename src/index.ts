
import Koa from "koa";
import { logger, env } from "./server/utils/index.js";
import { setupMiddleware } from "./server/middleware/index.js";
import { app } from "./server/next/app.js";

env.load();

app.prepare().then(() => {
  logger.info("Next.js app prepared. Setting up Koa...");

  const api = new Koa();

  setupMiddleware(api);
  
  api.listen(3000, () => {
    logger.info("Server listening on port 3000");
  });
});

