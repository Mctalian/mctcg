import { readFile, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { ExtendableContext } from "koa";
import { Deck } from "../decks/deck.js";
import { CacheContext } from "../../shared/cache-context.interface.js";
import { logger } from "../../utils/index.js";
import { Section } from "../decks/section.enum.js";
import { DeckDto, DeckGenerateDto, DeckValidateDto } from "../../shared/deck-dto.interface.js";
import { Format } from "../pdf-exporter/format.enum.js";
import { DecklistDto, DecklistGenerateDto, DecklistValidateDto } from "../../shared/decklist-dto.interface.js";
import { isSectionedDeck } from "../decks/sectioned-deck.interface.js";

export class DeckService {
  constructor(
    private readonly ctx: ExtendableContext
  ) {}

  generatePdf(decklist: DecklistGenerateDto): Promise<void>;
  generatePdf(deck: DeckGenerateDto): Promise<void>;
  async generatePdf(dto: DeckGenerateDto | DecklistGenerateDto) {
    const deck = await this.coalesceDeck(dto);
    if (!deck) {
      return;
    }
    if (!this.isValidGenerateRequest({ ...dto, ...deck })) {
      return;
    }
    const { playerName, playerId, playerDob, format = Format.Standard } = dto;
    if (await this.isDeckValid(deck, format)) {
      const uniqueFilename = `out/${randomUUID()}.pdf`;
      const pdfFile = await deck.export(playerName, playerId, new Date(playerDob), format, uniqueFilename).catch((error) => {
        logger.error(JSON.stringify(error));
        this.ctx.status = 500;
        this.ctx.body = "Error generating PDF";
        return null;
      });
      if (!pdfFile) {
        return;
      }
      this.ctx.type = "application/pdf";
      this.ctx.body = await readFile(pdfFile);
      await unlink(pdfFile);
    }
  }

  private isValidGenerateRequest(params: DeckGenerateDto) {
    const { playerName, playerId, playerDob, format = Format.Standard, ...deck } = params;
    if (!isSectionedDeck(deck) || !playerName || !playerId || !playerDob || !format) {
      this.ctx.status = 400;
      this.ctx.body = "Missing required fields";
      return false;
    }

    return true;
  }

  async importDeck({ decklist, sortType }: DecklistDto) {
    if (!await this.isValidImportRequest(decklist)) {
      return;
    }
    try {
      const deck = await Deck.import(decklist, this.ctx as CacheContext, sortType)
      this.ctx.status = 200;
      const deckDto = { 
        [Section.Pokemon]: deck[Section.Pokemon],
        [Section.Trainer]: deck[Section.Trainer],
        [Section.Energy]: deck[Section.Energy],
      }
      this.ctx.body = deckDto;
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = "Error importing decklist";
      logger.error(err);
    };
  }

  private async isValidImportRequest(decklist: any) {
    if (!decklist) {
      this.ctx.status = 400;
      this.ctx.body = "Missing required fields";
      return false;
    }

    return true;
  }

  validateDeck(deck: DeckValidateDto): Promise<void>;
  validateDeck(decklist: DecklistValidateDto): Promise<void>;
  async validateDeck(dto: DeckValidateDto | DecklistValidateDto) {
    const deck = await this.coalesceDeck(dto);
    if (!deck) {
      return;
    }
    await this.isDeckValid(deck, dto.format);
    return;
  }

  async isValidValidateRequest(decklist: any, format: Format) {
    if (!decklist || !format) {
      this.ctx.status = 400;
      this.ctx.body = "Missing required fields";
      return false;
    }

    return true;
  }

  private async isDeckValid(deck: Deck, format: Format): Promise<boolean> {
    if (await deck.isValid(format)) {
      this.ctx.status = 200;
      this.ctx.body = `Deck is a valid ${format} deck`;
      return true
    } else {
      this.ctx.status = 400;
      this.ctx.body = `Invalid decklist:\n\n${JSON.stringify(deck.getValidationErrors(), null, 2)}`;
      return false;
    }
  }

  private async coalesceDeck(dto: DeckDto | DecklistDto): Promise<Deck | false>{
    if (isSectionedDeck(dto)) {
      return new Deck(this.ctx as CacheContext, dto);
    } else if (dto.decklist) {
      return await Deck.import(dto.decklist, this.ctx as CacheContext, dto.sortType);
    } else {
      this.ctx.status = 400;
      this.ctx.body = "Invalid request";
      return false;
    }
  }
}