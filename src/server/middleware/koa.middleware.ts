import Koa from "koa";
import KoaBodyParser from "koa-bodyparser";
import KoaJson from "koa-json";
import KoaLogger from "koa-logger";
import { logger } from "../../utils";

export function setupKoaMiddleware(app: Koa): void {
  logger.silly("Setting up Koa middleware...")
  app.use(KoaJson());
  app.use(KoaLogger());
  app.use(KoaBodyParser());
  logger.silly("Koa middleware setup complete.")
}