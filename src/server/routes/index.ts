import KoaRouter from 'koa-router';
import { setupCacheRoutes } from './cache.routes';
import { setupDecklistRoutes } from './decklist.routes';
import { logger } from '../../utils';

export function setupAppRoutes(router: KoaRouter) {
  logger.silly("Setting up app routes...");
  setupCacheRoutes(router);
  setupDecklistRoutes(router);
  logger.silly("App routes setup complete.");
}