import KoaRouter from 'koa-router';
import { logger } from '../../utils';
import { CacheContext } from '../cache-context.interface';
import { ExtendableContext } from 'koa';

export function setupCacheRoutes(router: KoaRouter) {
  logger.silly("Setting up cache routes...");
  router.post("/cache/flush", async (ctx: ExtendableContext, next) => {
    await (ctx as CacheContext).redis.flushDb();
    ctx.status = 200;
    ctx.body = "Cache flushed";
    await next();
  });
  logger.silly("Cache routes setup complete.");
}