import { ExtendableContext } from "koa";
import KoaRouter from "koa-router";

import { Format } from "../../../app/pdf-exporter/format.enum.js";
import { DecklistDto, DecklistGenerateDto, DecklistValidateDto } from "../../../shared/decklist-dto.interface.js";
import { DeckService } from "../../../app/services/deck.service.js";

export const decklistRouter = new KoaRouter({
  prefix: "/decklist"
});

decklistRouter.post("/generate", async (ctx: ExtendableContext, next) => {
  const { decklist, playerName, playerId, playerDob, format = Format.Standard } = ctx.request.body as DecklistGenerateDto;
  await new DeckService(ctx).generatePdf({ playerName, playerId, playerDob, format, decklist });
  await next();
});

decklistRouter.post("/import", async (ctx: ExtendableContext, next) => {
  const { decklist } = ctx.request.body as DecklistDto;
  await new DeckService(ctx).importDeck(decklist);
  await next();
});

decklistRouter.post("/validate", async (ctx: ExtendableContext, next) => {
  const dto = ctx.request.body as DecklistValidateDto;
  await new DeckService(ctx).validateDeck(dto);
  await next();
});
