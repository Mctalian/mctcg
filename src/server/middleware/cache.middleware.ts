import Koa from "koa";
import { redisConnect, redisDisconnect } from "../utils/index.js";
import { SetsCache } from "../app/sets/sets-cache.js";
import { CardsCache } from "../app/cards/cards-cache.js";

export async function cacheMiddleware(ctx: Koa.Context, next: () => Promise<any>) {
  ctx.redis = await redisConnect();
  ctx.setsCache = new SetsCache(ctx.redis);
  ctx.cardsCache = new CardsCache(ctx.redis);
  await next().finally(async () => {
    await redisDisconnect(ctx.redis);
  });
}
