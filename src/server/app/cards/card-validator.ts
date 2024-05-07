import { Card, isBasicEnergy } from "./card.interface.js";
import { logger } from "../../utils/index.js";
import { Singularity } from "./singularity.enum.js";
import { CacheContext } from "../../shared/cache-context.interface.js";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { CardFactory } from "./card-factory.js";
import { CardsCache } from "./cards-cache.js";
import { SetsCache } from "../sets/sets-cache.js";

export enum CardValidationError {
  UnknownCard = "Unknown card based on set abbreviation and number",
  InvalidSetAbbreviation = "Invalid set abbreviation",
  TooManyCopies = "Too many copies of a card"
}

export class CardValidator {
  private readonly setsCache: SetsCache;
  private readonly cardsCache: CardsCache;

  constructor(
    private readonly card: Card,
    cacheContext: CacheContext,
  ) {
    this.setsCache = cacheContext.setsCache;
    this.cardsCache = cacheContext.cardsCache;
  }

  async validate() {
    await this.validateCardSetAbbreviations();
    await this.validateCardWithApi();
    this.validateCardQuantity();
    return;
  }

  private async validateCardSetAbbreviations() {
    const sets = await this.setsCache.getSets();
    const set = sets.find(s => s.ptcgoCode === this.card.setAbbr);
    logger.debug(`Validating set abbreviation: ${this.card.setAbbr}`);
    if (!set) {
      if (this.card.setAbbr === "Energy") {
        logger.warning("PTG Live non-set Energy card detected");
        return;
      }
      logger.error("Invalid set abbreviation: " + this.card.setAbbr);
      if (!this.card.errors) {
        this.card.errors = [];
      }
      this.card.errors.push(`${CardValidationError.InvalidSetAbbreviation}: ${this.card.setAbbr} on ${this.card.name} ${this.card.setNumber}`);
    }
  }
  
  private async validateCardWithApi() {
    logger.debug(`Validating card: ${this.card.name} ${this.card.setAbbr} ${this.card.setNumber}`);
    let setId = await this.setsCache.getSetByAbbr(this.card.setAbbr);
    if (!setId) {
      logger.error(`Could not find set ID for set abbreviation: ${this.card.setAbbr}`)
      return;
    }
    if (this.card.setNumber.startsWith("TG")) {
      setId += "tg";
    }
    if (this.card.setNumber.startsWith("GG")) {
      setId += "gg";
    }
  
    const cardInfo = await this.cardsCache.getCardBySetIdAndNumber(setId, this.card.setNumber);
    if (!cardInfo) {
      if (!this.card.errors) {
        this.card.errors = [];
      }
      this.card.errors.push(`${CardValidationError.UnknownCard}: ${this.card.setAbbr}-${this.card.setNumber} (${this.card.name})`);
    } else {
      const cardFactory = new CardFactory(this.setsCache, this.cardsCache);
      Object.assign(this.card, await cardFactory.createFromApiObject(cardInfo))
    }
  }
  
  private validateCardQuantity() {
    if (!this.card.quantity) {
      logger.error("Card does not have a quantity");
      return;
    }
    if (!isBasicEnergy(this.card) && this.card.quantity > 4) {
      logger.error(`Card has more than 4 copies: ${this.card.quantity}`);
      if (!this.card.errors) {
        this.card.errors = [];
      }
      this.card.errors.push(`${CardValidationError.TooManyCopies}: ${this.card.name} (${this.card.setAbbr}-${this.card.setNumber}) ${this.card.quantity} copies`);
    }
  }
}
