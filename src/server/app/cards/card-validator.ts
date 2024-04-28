import { Card, isBasicEnergy } from "./card.interface.js";
import { logger } from "../../utils/index.js";
import { Singularity } from "./singularity.enum.js";
import { CacheContext } from "../../shared/cache-context.interface.js";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

export enum CardValidationError {
  UnknownCard = "Unknown card based on set abbreviation and number",
  InvalidSetAbbreviation = "Invalid set abbreviation",
  TooManyCopies = "Too many copies of a card"
}

export class CardValidator {
  private readonly setsCache;
  private readonly cardsCache;

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
      this.card.id = cardInfo.id;
      this.card.name = cardInfo.name;
      this.card.supertype = cardInfo.supertype;
      this.card.subtypes = cardInfo.subtypes;
      this.card.regCode = cardInfo["regulationMark"] || "";
      this.processImageField(cardInfo);
      this.card.singularityType = Singularity.None;
      if (cardInfo.rules?.length) {
        if (cardInfo.rules.some(rule => rule.includes("You can't have more than 1") && rule.includes("in your deck"))) {
          const matchingSubtype = cardInfo.subtypes?.find(subtype => Singularity[subtype]);
          if (matchingSubtype) {
            this.card.singularityType = Singularity[matchingSubtype];
          } else {
            logger.error(`Card has singularity rule but no matching subtype: ${JSON.stringify(cardInfo, null, 2)}`);
          }
        }
      }
    }
  }

  private processImageField(cardInfo: PokemonTCG.Card) {
    if (!cardInfo.images) {
      return;
    }
    this.card.images = this.card.images || {};
    if (cardInfo.images.small) {
      this.card.images.small = cardInfo.images.small;
    }
    if (cardInfo.images.large) {
      this.card.images.large = cardInfo.images.large;
    }
  }
  
  private validateCardQuantity() {
    if (!isBasicEnergy(this.card) && this.card.quantity > 4) {
      logger.error(`Card has more than 4 copies: ${this.card.quantity}`);
      if (!this.card.errors) {
        this.card.errors = [];
      }
      this.card.errors.push(`${CardValidationError.TooManyCopies}: ${this.card.name} (${this.card.setAbbr}-${this.card.setNumber}) ${this.card.quantity} copies`);
    }
  }
}
