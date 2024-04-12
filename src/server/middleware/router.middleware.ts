import Koa from "koa";
import KoaRouter from "koa-router";
import { setupAppRoutes } from "../routes";
import { logger } from "../../utils";

export function setupRouterMiddleware(app: Koa) {
  logger.silly("Setting up router middleware...");
  const router = new KoaRouter();
  setupAppRoutes(router);
  app.use(router.routes()).use(router.allowedMethods());
  logger.silly(`Router middleware setup complete (${router.stack.length} routes initialized).`);
}