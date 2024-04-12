import KoaRouter from 'koa-router';
import { apiRouter } from './api/index.js';
import { frontendRouter } from './frontend/index.js';

export const router = new KoaRouter();

router.use(apiRouter.routes(), apiRouter.allowedMethods());
router.use(frontendRouter.routes(), frontendRouter.allowedMethods());
