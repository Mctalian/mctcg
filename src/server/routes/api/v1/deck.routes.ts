import KoaRouter from "koa-router";
import { ExtendableContext } from "koa";

import { DeckGenerateDto, DeckValidateDto } from "../../../shared/deck-dto.interface.js";
import { Deck } from "../../../app/decks/deck.js";
import { CacheContext } from "../../../shared/cache-context.interface.js";
import { SectionedDeck } from "../../../app/decks/sectioned-deck.interface.js";
import { DeckService } from "../../../app/services/deck.service.js";

export const deckRouter = new KoaRouter({
  prefix: "/deck"
});

deckRouter.post("/validate", async (ctx: ExtendableContext, next) => {
  const deckDto = ctx.request.body as DeckValidateDto;
  await new DeckService(ctx).validateDeck(deckDto);
  await next();
});

deckRouter.post("/generate", async (ctx: ExtendableContext, next) => {
  const { playerName, playerId, playerDob, format, sortType, ...deckDto } = ctx.request.body as DeckGenerateDto;
  const deck = new Deck(ctx as CacheContext, deckDto as SectionedDeck);
  await new DeckService(ctx).generatePdf({ playerName, playerId, playerDob, format, sortType, ...deck });
  await next();
});
