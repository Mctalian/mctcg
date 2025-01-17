
import Koa from "koa";
import { logger, env } from "./server/utils/index.js";
import { setupMiddleware } from "./server/middleware/index.js";
import { app } from "./server/next/app.js";

env.load();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  logger.info("Next.js app prepared. Setting up Koa...");

  const api = new Koa();

  setupMiddleware(api);
  
  api.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
  });
});

