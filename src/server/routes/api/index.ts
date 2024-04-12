import KoaRouter from 'koa-router';
import { v1Router } from './v1/index.js';
import { cacheMiddleware } from '../../middleware/cache.middleware.js';

export const apiRouter = new KoaRouter({
  prefix: "/api"
});

apiRouter.use(cacheMiddleware);
apiRouter.use(v1Router.routes(), v1Router.allowedMethods());
