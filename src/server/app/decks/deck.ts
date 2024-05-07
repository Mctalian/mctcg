import { Section } from "./section.enum.js";
import { Card } from "../cards/card.interface.js";
import { SectionedDeck } from "./sectioned-deck.interface.js";
import { DeckValidator } from "./deck-validator.js";
import { DeckExporter } from "../pdf-exporter/deck-exporter.js";
import { logger } from "../../utils/index.js";
import { Format } from "../pdf-exporter/format.enum.js";
import { ValidationErrorsAggregate } from "./validation-errors-aggregate.interface.js";
import { CacheContext } from "../../shared/cache-context.interface.js";
import { SortType } from "./sort-type.enum.js";
import { compareAsc } from "date-fns";
import { CardFactory } from "../cards/card-factory.js";

export class Deck implements SectionedDeck {
  [Section.Pokemon]: Card[] = [];
  [Section.Trainer]: Card[] = [];
  [Section.Energy]: Card[] = [];
  errors: string[] = [];
  warnings: string[] = [];
  pokemonErrors: string[] = [];
  trainerErrors: string[] = [];
  energyErrors: string[] = [];
  format?: Format;
  private readonly deckValidator: DeckValidator;

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
    return this[Section.Pokemon].reduce((acc, card) => acc + (card.quantity ?? 0), 0) +
      this[Section.Trainer].reduce((acc, card) => acc + (card.quantity ?? 0), 0) +
      this[Section.Energy].reduce((acc, card) => acc + (card.quantity ?? 0), 0);
  }

  static async import(data: string, cacheContext: CacheContext, sortType: SortType = SortType.Alphabetical): Promise<Deck> {
    if (!data || data.trim() === '') {
      throw new Error('No decklist provided');
    }
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
      const cardFactory = new CardFactory(cacheContext.setsCache, cacheContext.cardsCache);
      const card = cardFactory.createFromLiveExportLine(line);
      deck[section].push(card);
    }

    deckList[Section.Pokemon] = deck[Section.Pokemon];
    deckList[Section.Trainer] = deck[Section.Trainer];
    deckList[Section.Energy] = deck[Section.Energy];
    deckList.mergeDuplicateLines();
    await deckList.sortSections(sortType);
    logger.debug(`Deck imported.`);
    await deckList.isValid();
    return deckList;
  }

  async isValid(format?: Format): Promise<boolean> {
    await this.deckValidator.validate(format);
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

  private logValidationErrors(totalErrors: number) {
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

  mergeDuplicateLines() {
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
        pokemonMap.get(key)!.quantity = (pokemonMap.get(key)!.quantity ??0) + (card.quantity ?? 0);
      } else {
        pokemonMap.set(key, { ...card });
      }
    });

    this[Section.Trainer].forEach(card => {
      const key = `${card.name}-${card.setAbbr}-${card.setNumber}`;
      if (trainerMap.has(key)) {
        trainerMap.get(key)!.quantity = (trainerMap.get(key)!.quantity ?? 0) + (card.quantity ?? 0);
      } else {
        trainerMap.set(key, { ...card });
      }
    });

    this[Section.Energy].forEach(card => {
      const key = `${card.name}-${card.setAbbr}-${card.setNumber}`;
      if (energyMap.has(key)) {
        energyMap.get(key)!.quantity = (energyMap.get(key)!.quantity ?? 0) + (card.quantity ?? 0);
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

  async sortSections(type: SortType) {
    logger.debug(`Sorting deck: ${SortType[type]}`)
    switch (type) {
      case SortType.Alphabetical:
        this.sortSectionsByName();
        break;
      case SortType.SetAlphabetical:
        this.sortSectionBySetName();
        break;
      case SortType.SetChronological:
        await this.sortSectionBySetReleaseDate();
        break;
      case SortType.Quantity:
        this.sortSectionsByQuantity();
        break;
      default:
        this.sortSectionsByName();
        break;
    }
  }

  private sortSectionsByName() {
    this[Section.Pokemon].sort((a, b) => a.name.localeCompare(b.name));
    this[Section.Trainer].sort((a, b) => a.name.localeCompare(b.name));
    this[Section.Energy].sort((a, b) => a.name.localeCompare(b.name));
  }

  private sortSectionBySetName() {
    function sortBySetNameAndNumber(a, b) {
      if (a.setAbbr === b.setAbbr) {
        return a.setNumber - b.setNumber;
      }
      return a.setAbbr.localeCompare(b.setAbbr);
    }
    this[Section.Pokemon].sort(sortBySetNameAndNumber);
    this[Section.Trainer].sort(sortBySetNameAndNumber);
    this[Section.Energy].sort(sortBySetNameAndNumber);
  }

  private async sortSectionBySetReleaseDate() {
    const sets = new Set<string>();
    this[Section.Pokemon].forEach(card => sets.add(card.setAbbr));
    this[Section.Trainer].forEach(card => sets.add(card.setAbbr));
    this[Section.Energy].forEach(card => sets.add(card.setAbbr));
    const setList = Array.from(sets);
    const cachedSets = await this.cacheContext.setsCache.getSets();
    const setListByReleaseDate = setList.sort((a, b) => {
      const setA = cachedSets.find(set => set.ptcgoCode === a);
      const setB = cachedSets.find(set => set.ptcgoCode === b);
      if (!setA || !setB) {
        return 0;
      }
      return compareAsc(setA.releaseDate, setB.releaseDate);
    });
    function sortBySetReleaseDateAndNumber(a, b) {
      const releaseDateIndexA = setListByReleaseDate.indexOf(a.setAbbr);
      const releaseDateIndexB = setListByReleaseDate.indexOf(b.setAbbr);
      if (releaseDateIndexA === releaseDateIndexB) {
        return a.setNumber - b.setNumber;
      }
      return releaseDateIndexA - releaseDateIndexB;
    }
    this[Section.Pokemon].sort(sortBySetReleaseDateAndNumber);
    this[Section.Trainer].sort(sortBySetReleaseDateAndNumber);
    this[Section.Energy].sort(sortBySetReleaseDateAndNumber);
  }

  private sortSectionsByQuantity() {
    this[Section.Pokemon].sort((a, b) => (b.quantity ?? 0) - (a.quantity ?? 0));
    this[Section.Trainer].sort((a, b) => (b.quantity ?? 0) - (a.quantity ?? 0));
    this[Section.Energy].sort((a, b) => (b.quantity ?? 0) - (a.quantity ?? 0));
  }
}
