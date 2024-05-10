import KoaRouter from "koa-router";
import { cacheRouter } from "./cache.routes.js";
import { decklistRouter } from "./decklist.routes.js";
import { deckRouter } from "./deck.routes.js";
import { cardsRouter } from "./cards.routes.js";
import { setsRouter } from "./sets.routes.js";

export const v1Router = new KoaRouter({
  prefix: "/v1"
});

v1Router.use(cacheRouter.routes(), cacheRouter.allowedMethods());
v1Router.use(cardsRouter.routes(), cardsRouter.allowedMethods());
v1Router.use(deckRouter.routes(), deckRouter.allowedMethods());
v1Router.use(decklistRouter.routes(), decklistRouter.allowedMethods());
v1Router.use(setsRouter.routes(), setsRouter.allowedMethods());
