import Koa from "koa";
import { logger } from "../../utils";

export function setupPostBodyMiddleware(app: Koa) {
  logger.silly("Setting up POST body middleware...")
  app.use(async (ctx, next) => {
    if (ctx.method === "POST" && !ctx.request.body) {
      ctx.status = 400;
      ctx.body = "Missing request body";
      return;
    }
    await next();
  });
  logger.silly("POST body middleware setup complete.")
}