import { readFile, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";

import { ExtendableContext } from "koa";
import KoaRouter from "koa-router";

import { Format } from "../../pdf-exporter/format.enum";
import { DecklistDto, DecklistGenerateDto, DecklistValidateDto } from "../decklist-dto.interface";
import { Deck } from "../../decks/deck";
import { logger } from "../../utils";
import { CacheContext } from "../cache-context.interface";

export function setupDecklistRoutes(router: KoaRouter) {
  logger.silly("Setting up decklist routes...");
  router.post("/decklist/generate", async (ctx: ExtendableContext, next) => {
    const { decklist, playerName, playerId, playerDob, format = Format.Standard } = ctx.request.body as DecklistGenerateDto;
    if (!decklist || !playerName || !playerId || !playerDob || !format) {
      ctx.status = 400;
      ctx.body = "Missing required fields";
      return;
    }
    const deck = await Deck.import(decklist, ctx as CacheContext);
    deck.format = format;
    if (await deck.isValid()) {
      const uniqueFilename = `out/${randomUUID()}.pdf`;
      const pdfFile = await deck.export(playerName, playerId, new Date(playerDob), format, uniqueFilename);
      ctx.type = "application/pdf";
      ctx.body = await readFile(pdfFile);
      await unlink(pdfFile);
    } else {
      ctx.status = 400;
      ctx.body = `Invalid decklist:\n\n${JSON.stringify(deck.getValidationErrors(), null, 2)}`;
    }
    await next();
  });
  
  router.post("/decklist/import", async (ctx: ExtendableContext, next) => {
    const { decklist } = ctx.request.body as DecklistDto;
    if (!decklist) {
      ctx.status = 400;
      ctx.body = "Missing required fields";
      return;
    }
    await Deck.import(decklist, ctx as CacheContext)
      .then((deck) => {
        ctx.status = 200;
        ctx.body = deck;
      })
      .catch((err) => {
        ctx.status = 500;
        ctx.body = "Error importing decklist";
        logger.error(err);
      });
    await next();
  });
  
  router.post("/decklist/validate", async (ctx: ExtendableContext, next) => {
    const { decklist, format } = ctx.request.body as DecklistValidateDto;
    if (!decklist || !format) {
      ctx.status = 400;
      ctx.body = "Missing required fields";
      return;
    }
    const deck = await Deck.import(decklist, ctx as CacheContext);
    deck.format = format;
    if (await deck.isValid()) {
      ctx.status = 200;
      ctx.body = `Deck is a valid ${format} deck`;
    } else {
      ctx.status = 400;
      ctx.body = `Invalid decklist:\n\n${JSON.stringify(deck.getValidationErrors(), null, 2)}`;
    }
    await next();
  });
  logger.silly("Decklist routes setup complete.");
}