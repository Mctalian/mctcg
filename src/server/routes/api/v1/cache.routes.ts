import KoaRouter from 'koa-router';
import { ExtendableContext } from 'koa';
import { CacheContext } from '../../../shared/cache-context.interface.js';

export const cacheRouter = new KoaRouter({
  prefix: "/cache"
});

cacheRouter.post("/flush", async (ctx: ExtendableContext, next) => {
  await (ctx as CacheContext).redis.flushDb();
  ctx.status = 200;
  ctx.body = "Cache flushed";
  await next();
});
