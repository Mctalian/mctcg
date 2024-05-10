import KoaRouter from 'koa-router';
import { ExtendableContext } from 'koa';
import { CacheContext } from '../../../shared/cache-context.interface.js';

export const setsRouter = new KoaRouter({
  prefix: "/sets"
});

setsRouter.get("/", async (ctx: ExtendableContext, next) => {
  const setsCache = (ctx as CacheContext).setsCache;
  const cacheOnly = (ctx.request.query["cachedResultsOnly"] ?? "true") === "true"
  const sets = await setsCache.getSets(cacheOnly);
  ctx.status = 200;
  ctx.body = {
    sets,
    numberOfSets: sets.length,
    cachedResults: cacheOnly,
  };
  await next();
});
