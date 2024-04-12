import Koa from "koa";
import { logger } from "../utils";

export async function requirePostBody(ctx: Koa.Context, next: Koa.Next) {
  if (ctx.method === "POST" && !ctx.request.body) {
    ctx.status = 400;
    ctx.body = "Missing request body";
    return;
  }
  await next();
}
