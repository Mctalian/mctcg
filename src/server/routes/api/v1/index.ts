import KoaRouter from "koa-router";
import { cacheRouter } from "./cache.routes.js";
import { decklistRouter } from "./decklist.routes.js";
import { deckRouter } from "./deck.routes.js";

export const v1Router = new KoaRouter({
  prefix: "/v1"
});

v1Router.use(cacheRouter.routes(), cacheRouter.allowedMethods());
v1Router.use(deckRouter.routes(), deckRouter.allowedMethods());
v1Router.use(decklistRouter.routes(), decklistRouter.allowedMethods());
