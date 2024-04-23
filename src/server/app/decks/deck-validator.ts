import { CardValidator } from "../cards/card-validator.js";
import { SingularityCard, isBasicEnergy, isSingularityCard } from "../cards/card.interface.js";
import { Singularity } from "../cards/singularity.enum.js";
import { Format } from "../pdf-exporter/format.enum.js";
import { CacheContext } from "../../shared/cache-context.interface.js";
import { logger } from "../../utils/index.js";
import { Deck } from "./deck.js";
import { Section } from "./section.enum.js";

export enum DeckValidationError {
  InvalidNumberOfCards = "Deck must have exactly 60 cards",
  TooManyOfOneCard = "Deck must have no more than 4 of any card by name",
  InvalidRegulation = "Deck contains cards that are not legal in the current standard format",
  SingularityViolation = "Deck contains more than 1 singularity card (i.e. Radiant, ACE SPEC, etc.)",
  NeedsBasicPokemon = "Deck must contain at least 1 Basic Pokemon",
}

export enum DeckValidationWarning {
  MissingRegulation = "Deck contains cards that are missing regulation codes",
}

// As of 2024-04-05, the current standard regulations are F, G, and H
const CURRENT_STANDARD_REGULATIONS = [
  "F",
  "G",
  "H",
];

export class DeckValidator {
  constructor(
    private readonly deck: Deck,
    private readonly cacheContext: CacheContext,
  ) {
  }

  async validate(format?: Format) {
    this.validateNumberOfCards();
    const cards = this.deck.Pokemon.concat(this.deck.Trainer).concat(this.deck.Energy);
    await Promise.all([
      ...cards.map(card => new CardValidator(card, this.cacheContext).validate()),
    ]);
    this.validateNumberOfCardsByName();
    this.validateRegulations();
    this.validateSingularityRules();
    this.validateBasicPokemon();
    return;
  }

  private validateNumberOfCards() {
    logger.debug(`Validating number of cards...`);
    const totalPokemon = this.deck[Section.Pokemon].reduce((acc, card) => acc + card.quantity, 0);
    const totalTrainer = this.deck[Section.Trainer].reduce((acc, card) => acc + card.quantity, 0);
    const totalEnergy = this.deck[Section.Energy].reduce((acc, card) => acc + card.quantity, 0);
    if (totalPokemon + totalTrainer + totalEnergy !== 60) {
      logger.error("Deck must have exactly 60 cards (You have " + (totalPokemon + totalTrainer + totalEnergy) + " cards)");
      if (!this.deck.errors) {
        this.deck.errors = [];
      }
      this.deck.errors.push(`${DeckValidationError.InvalidNumberOfCards}: You have ${totalPokemon + totalTrainer + totalEnergy} cards`);
    }
  }

  private validateNumberOfCardsByName() {
    logger.debug(`Validating no more than 4 of any card by name...`);
    const cardQuantities = new Map<string, number>();
    const cards = this.deck.Pokemon.concat(this.deck.Trainer).concat(this.deck.Energy.filter(card => !isBasicEnergy(card)));
    cards.forEach(card => {
      cardQuantities.set(card.name, (cardQuantities.get(card.name) || 0) + card.quantity);
    });
    const invalidCards = Array.from(cardQuantities.entries()).filter(([_, quantity]) => quantity > 4);
    if (invalidCards.length > 0) {
      logger.error("Deck must have no more than 4 of any card by name");
      logger.error("Invalid cards: " + invalidCards.map(([name, quantity]) => `${name} (${quantity})`).join(", "));
      if (!this.deck.errors) {
        this.deck.errors = [];
      }
      this.deck.errors.push(`${DeckValidationError.TooManyOfOneCard}: ${invalidCards.map(([name, quantity]) => `${name} (${quantity})`).join(", ")}`);
    }
  }

  private validateRegulations() {
    const cards = this.deck.Pokemon.concat(this.deck.Trainer).concat(this.deck.Energy);
    const missingRegCodes = cards.filter(card => !isBasicEnergy(card)).filter(card => !card.regCode);
    if (missingRegCodes.length > 0) {
      logger.warn(`Missing regulation codes for ${missingRegCodes.length} cards`);
      logger.warn(`Missing cards: ${missingRegCodes.map(card => `${card.name} (${card.setAbbr}-${card.setNumber})`).join(", ")}`);
      if (!this.deck.warnings) {
        this.deck.warnings = [];
      }
      this.deck.warnings.push(`${DeckValidationWarning.MissingRegulation}: ${missingRegCodes.map(card => `${card.name} (${card.setAbbr}-${card.setNumber})`).join(", ")}`);
    }
    const invalidCards = cards.filter(card => card.regCode).filter(card => !CURRENT_STANDARD_REGULATIONS.includes(card.regCode!));
    if (invalidCards.length > 0) {
      this.deck.format = Format.Expanded
      // logger.error("Deck contains cards that are not legal in the current standard format");
      // logger.error("Invalid cards: " + invalidCards.map(card => `${card.name} (${card.setAbbr}-${card.setNumber}) REG: ${card.regCode}`).join(", "));
      // if (!this.deck.errors) {
      //   this.deck.errors = [];
      // }
      // this.deck.errors.push(`${DeckValidationError.InvalidRegulation}: ${invalidCards.map(card => `${card.name} (${card.setAbbr}-${card.setNumber}) REG: ${card.regCode}`).join(", ")}`);
    } else {
      this.deck.format = Format.Standard
    }
  }

  private validateSingularityRules() {
    const cards = this.deck.Pokemon.concat(this.deck.Trainer).concat(this.deck.Energy);
    const singularityCards = cards.filter(isSingularityCard);
    // Separate singularity cards by type
    const singularityMap = new Map<Singularity, SingularityCard[]>();
    singularityCards.forEach(card => {
      if (!singularityMap.has(card.singularityType)) {
        singularityMap.set(card.singularityType, []);
      }
      singularityMap.get(card.singularityType)!.push(card);
    });
    // Validate singularity rules
    singularityMap.forEach((cards, singularityType) => {
      const totalQuantity = cards.reduce((acc, card) => acc + card.quantity, 0);
      if (totalQuantity > 1) {
        logger.error(`Deck contains more than 1 ${Singularity[singularityType]} card: ${totalQuantity}`);
        logger.error(`Invalid cards: ${cards.map(card => `${card.name} (${card.setAbbr}-${card.setNumber})`).join(", ")}`);
        if (!this.deck.errors) {
          this.deck.errors = [];
        }
        this.deck.errors.push(`${DeckValidationError.SingularityViolation}: ${Singularity[singularityType]} has ${totalQuantity} cards`);
      }
    });
  }

  private validateBasicPokemon() {
    const basicPokemon = this.deck.Pokemon.filter(card => card.subtypes?.includes("Basic"));
    if (basicPokemon.length === 0) {
      logger.error("Deck must contain at least 1 Basic Pokemon");
      if (!this.deck.errors) {
        this.deck.errors = [];
      }
      this.deck.errors.push(DeckValidationError.NeedsBasicPokemon);
    }
  }
}
