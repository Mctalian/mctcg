import { Section } from "../pdf-exporter/section.enum";
import { Card } from "../cards/card.interface";
import { SectionedDeck } from "./sectioned-deck.interface";
import { DeckValidator } from "./deck-validator";
import { DeckExporter } from "../pdf-exporter/deck-exporter";
import { logger } from "../utils/logger";
import { Format } from "../pdf-exporter/format.enum";
import { ValidationErrorsAggregate } from "./validation-errors-aggregate.interface";
import { CacheContext } from "../server/cache-context.interface";

export class Deck implements SectionedDeck {
  [Section.Pokemon]: Card[] = [];
  [Section.Trainer]: Card[] = [];
  [Section.Energy]: Card[] = [];
  format: Format = Format.Standard;
  errors: string[] = [];
  warnings: string[] = [];
  pokemonErrors: string[] = [];
  trainerErrors: string[] = [];
  energyErrors: string[] = [];
  private readonly deckValidator;

  constructor(
    private readonly cacheContext: CacheContext,
    deck?: SectionedDeck
  ) {
    if (deck) {
      this[Section.Pokemon] = deck[Section.Pokemon];
      this[Section.Trainer] = deck[Section.Trainer];
      this[Section.Energy] = deck[Section.Energy];
    }
    this.deckValidator = new DeckValidator(this, this.cacheContext);
  }

  get totalCards(): number {
    return this[Section.Pokemon].reduce((acc, card) => acc + card.quantity, 0) +
      this[Section.Trainer].reduce((acc, card) => acc + card.quantity, 0) +
      this[Section.Energy].reduce((acc, card) => acc + card.quantity, 0);
  }

  static async import(data: string, cacheContext: CacheContext): Promise<Deck> {
    logger.debug(`Importing deck...`);
    const deckList = new Deck(cacheContext);
    const lines = data.split('\n');
    let section = Section.Pokemon;
    let deck: SectionedDeck = {
      [Section.Pokemon]: [],
      [Section.Trainer]: [],
      [Section.Energy]: [],
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Skip empty lines
      if (line.trim() === '') {
        continue;
      }
      // Likely a header line, set the section based on the header
      // and skip to the next line
      if (Number.isNaN(parseInt(line[0]))) {
        if (line.startsWith('Pokémon')) {
          section = Section.Pokemon;
        } else if (line.startsWith('Trainer')) {
          section = Section.Trainer;
        } else if (line.startsWith('Energy')) {
          section = Section.Energy;
        }
        continue;
      }
      // Remove PH from the end of the line
      let santizedLine = line;
      if (line.trim().endsWith('PH')) {
        santizedLine = line.substring(0, (line.lastIndexOf('PH')) - 1);
      }
      const quantity = parseInt(santizedLine.split(' ')[0]);
      const setNumberIndex = santizedLine.lastIndexOf(' ') + 1;
      const setNumber = santizedLine.substring(setNumberIndex).trim();
      // Get the set abbreviation by removing the set number from the end of the line
      const lineWithoutSetNumber = santizedLine.substring(0, setNumberIndex - 1);
      const setAbbrIndex = lineWithoutSetNumber.lastIndexOf(' ') + 1;
      const setAbbr = lineWithoutSetNumber.substring(setAbbrIndex).trim();
      const lineWithoutSetInfo = lineWithoutSetNumber.substring(0, setAbbrIndex - 1);
      const name = lineWithoutSetInfo.substring(lineWithoutSetInfo.indexOf(' ') + 1).trim();
      const card: Card = {
        quantity,
        name,
        setAbbr,
        setNumber
      };
      deck[section].push(card);
    }

    deckList[Section.Pokemon] = deck[Section.Pokemon];
    deckList[Section.Trainer] = deck[Section.Trainer];
    deckList[Section.Energy] = deck[Section.Energy];
    logger.debug(`Deck imported.`);
    return deckList;
  }

  async isValid(): Promise<boolean> {
    await this.mergeDuplicateLines();
    await this.deckValidator.validate();
    logger.debug(`Checking for validation errors...`);
    this.pokemonErrors = this[Section.Pokemon].filter(card => card.errors && card.errors.length > 0).reduce((acc, card) => acc.concat(card.errors!), [] as string[]);
    this.trainerErrors = this[Section.Trainer].filter(card => card.errors && card.errors.length > 0).reduce((acc, card) => acc.concat(card.errors!), [] as string[]);
    this.energyErrors = this[Section.Energy].filter(card => card.errors && card.errors.length > 0).reduce((acc, card) => acc.concat(card.errors!), [] as string[]);
    const totalErrors = this.pokemonErrors.length + this.trainerErrors.length + this.energyErrors.length + this.errors.length;
    if (this.warnings.length) {
      logger.warn(`Deck has ${this.warnings.length} warnings:\n\n${this.warnings.join(', ')}`);
    }
    this.logValidationErrors(totalErrors);
    return totalErrors === 0;
  }

  getValidationErrors(): ValidationErrorsAggregate {
    return {
      [Section.Pokemon]: this.pokemonErrors,
      [Section.Trainer]: this.trainerErrors,
      [Section.Energy]: this.energyErrors,
      deck: this.errors,
      deckWarnings: this.warnings,
    };
  }


  async export(playerName: string, playerId: string, dob: Date, format: Format, filename: string) {
    logger.debug(`Exporting deck...`);
    const exporter = new DeckExporter(playerName, playerId, dob, format, this, filename);
    return exporter.saveToFile();
  }

  private async logValidationErrors(totalErrors: number) {
    if (totalErrors > 0) {
      logger.error(`Deck has ${totalErrors} errors`);
    }
    if (this.pokemonErrors.length > 0) {
      logger.error(`Pokemon errors (${this.pokemonErrors.length}): ${JSON.stringify(this.pokemonErrors, null, 2)}`);
    }
    if (this.trainerErrors.length > 0) {
      logger.error(`Trainer errors (${this.trainerErrors.length}): ${JSON.stringify(this.trainerErrors, null, 2)}`);
    }
    if (this.energyErrors.length > 0) {
      logger.error(`Energy errors (${this.energyErrors.length}): ${JSON.stringify(this.energyErrors, null, 2)}`);
    }
    if (this.errors.length > 0) {
      logger.error(`Deck errors (${this.errors.length}): ${JSON.stringify(this.errors, null, 2)}`);
    }
  }

  private async mergeDuplicateLines() {
    const mergedPokemon: Card[] = [];
    const mergedTrainer: Card[] = [];
    const mergedEnergy: Card[] = [];
    const pokemonMap = new Map<string, Card>();
    const trainerMap = new Map<string, Card>();
    const energyMap = new Map<string, Card>();
    logger.debug(`Merging duplicate lines... ${this[Section.Pokemon].length} Pokemon lines, ${this[Section.Trainer].length} Trainer lines, ${this[Section.Energy].length} Energy lines`);

    this[Section.Pokemon].forEach(card => {
      const key = `${card.name}-${card.setAbbr}-${card.setNumber}`;
      if (pokemonMap.has(key)) {
        pokemonMap.get(key)!.quantity += card.quantity;
      } else {
        pokemonMap.set(key, { ...card });
      }
    });

    this[Section.Trainer].forEach(card => {
      const key = `${card.name}-${card.setAbbr}-${card.setNumber}`;
      if (trainerMap.has(key)) {
        trainerMap.get(key)!.quantity += card.quantity;
      } else {
        trainerMap.set(key, { ...card });
      }
    });

    this[Section.Energy].forEach(card => {
      const key = `${card.name}-${card.setAbbr}-${card.setNumber}`;
      if (energyMap.has(key)) {
        energyMap.get(key)!.quantity += card.quantity;
      } else {
        energyMap.set(key, { ...card });
      }
    });

    pokemonMap.forEach(card => mergedPokemon.push(card));
    trainerMap.forEach(card => mergedTrainer.push(card));
    energyMap.forEach(card => mergedEnergy.push(card));

    this[Section.Pokemon] = mergedPokemon;
    this[Section.Trainer] = mergedTrainer;
    this[Section.Energy] = mergedEnergy;
    logger.debug(`Merged duplicate lines. ${this[Section.Pokemon].length} Pokemon lines, ${this[Section.Trainer].length} Trainer lines, ${this[Section.Energy].length} Energy lines`);
  }

}
