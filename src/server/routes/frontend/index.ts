import KoaRouter from 'koa-router';
import { handle } from '../../next/app.js';

export const frontendRouter = new KoaRouter();

frontendRouter.all(/^\/(?!api).*/, async (ctx) => {
  ctx.respond = false;
  ctx.response.status = 200;
  return handle(ctx.req, ctx.res);
});