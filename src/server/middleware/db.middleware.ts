import Koa from "koa";
import { logger, redisConnect, redisDisconnect } from "../../utils";
import { SetsCache } from "../../sets/sets-cache";
import { CardsCache } from "../../cards/cards-cache";

export function setupDbMiddleware(app: Koa) {
  logger.silly("Setting up DB middleware...");
  app.use(async (ctx, next) => {
    ctx.redis = await redisConnect();
    ctx.setsCache = new SetsCache(ctx.redis);
    ctx.cardsCache = new CardsCache(ctx.redis);
    await next().finally(async () => {
      await redisDisconnect(ctx.redis);
    });
  });
  logger.silly("DB middleware setup complete.");
}