import Koa from "koa";
import KoaBodyParser from "koa-bodyparser";
import KoaJson from "koa-json";
import KoaLogger from "koa-logger";
import { requirePostBody } from "./post-body.middleware.js";
import { router } from "../routes/index.js";

export function setupMiddleware(api: Koa) {
  api.use(KoaJson());
  api.use(KoaLogger());
  api.use(KoaBodyParser());
  api.use(requirePostBody);
  api.use(router.routes()).use(router.allowedMethods());
}