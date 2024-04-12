import Koa from "koa";
import { setupKoaMiddleware } from "./koa.middleware";
import { setupDbMiddleware } from "./db.middleware";
import { setupPostBodyMiddleware } from "./post-body.middleware";
import { setupRouterMiddleware } from "./router.middleware";

export function setupAppMiddleware(app: Koa) {
  setupKoaMiddleware(app);
  setupPostBodyMiddleware(app);
  setupDbMiddleware(app);
  setupRouterMiddleware(app);
}