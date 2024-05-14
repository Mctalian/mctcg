import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { logger, redis, Prefix } from "../../utils/index.js";
import { isString } from "../../utils/is-string.js";
import { CardSearchDto } from "../../shared/card-search-dto.interface.js";
import { CardFactory } from "./card-factory.js";
import { CURRENT_STANDARD_REGULATIONS } from "../decks/deck-validator.js";

const tcgApiCardsKey = `${Prefix.TcgApi}:cards`;

function sanitizeString(str) {
  return str.replace(/[^a-zA-Z]/g, '*');
}

export class CardsCache {
  constructor(
    private readonly cache = redis
  ) {

  }
  async getCardBySetIdAndNumber(setId: string, number: string): Promise<PokemonTCG.Card | null> {
    const card = await this.cache.get(`${tcgApiCardsKey}:${setId}:${number}`);
    if (card) {
      return JSON.parse(card);
    }
    const cardInfo = await PokemonTCG.findCardsByQueries({
      q: `set.id:${setId} number:${number}`
    });
    if (cardInfo.length !== 1) {
      logger.error(`Invalid card: ${setId} ${number} (Found ${cardInfo.length} cards)`);
      return null;
    }
    await this.cache.set(`${tcgApiCardsKey}:${setId}:${number}`, JSON.stringify(cardInfo[0]));
    return cardInfo[0];
  }

  private defaultSearchQueries: CardSearchDto = {
    nameQuery: "",
    typeQuery: [],
    attackCostQuery: [],
    superTypeQuery: [],
    subTypeQuery: [],
    rarityQuery: [],
    retreatCostQuery: -1,
    formatQuery: "Expanded",
    cachedResultsOnly: true,
  }

  async getCardsByQuery(searchQueries: Partial<CardSearchDto>, cardFactory: CardFactory) {
    const safeQueries: CardSearchDto = {
      ...this.defaultSearchQueries,
      ...searchQueries,
    }
    if (safeQueries.cachedResultsOnly) {
      const allCards = await this.getAllCachedCards();

      const filteredCards = allCards
        .filter(c => !safeQueries.nameQuery || c.name.toLowerCase().includes(safeQueries.nameQuery.toLowerCase()))
        .filter(c => safeQueries.typeQuery.length === 0 || c.types?.some(t => safeQueries.typeQuery.includes(t)))
        .filter(c => safeQueries.formatQuery !== "Standard" || CURRENT_STANDARD_REGULATIONS.includes(c["regulationMark"] || (c.supertype === "Energy" && c.subtypes.findIndex((s) => s === PokemonTCG.Subtype.Basic) >= 0)))

      return await Promise.all(filteredCards.map((c) => cardFactory.createFromApiObject(c)))
    }
    const q = this.buildQuery(safeQueries);
    const apiResults = await PokemonTCG.findCardsByQueries({
      q
    });
    return await Promise.all(apiResults.map((cardResult) => {
      const setId = cardResult.set.id;
      const setNumber = cardResult.number;
      this.cache.set(`${tcgApiCardsKey}:${setId}:${setNumber}`, JSON.stringify(cardResult));
      return cardFactory.createFromApiObject(cardResult);
    }));
  }

  private buildQuery(searchQueries: CardSearchDto) {
    let q: string[] = [];
    if (searchQueries.nameQuery) {
      q.push(`name:*${sanitizeString(searchQueries.nameQuery)}*`);
    }
    if (searchQueries.typeQuery.length) {
      for (const type of searchQueries.typeQuery) {
        q.push(`type:${type}`);
      }
    }
    if (searchQueries.formatQuery === "Standard") {
      let query = "("
      const qParts: string[] = []
      for (const mark of CURRENT_STANDARD_REGULATIONS) {
        qParts.push(`regulationMark:${mark}`)
      }
      qParts.push(`(supertype:Energy AND subtypes:Basic)`)
      query += qParts.join(" OR ");
      query += ")"
      q.push(query);
    } else if (searchQueries.formatQuery === "Expanded") {
      q.push(`legalities.expanded:legal`)
    }
    return q.join(" AND ")
  }

  /*private*/ async getAllCachedCards() {
    const keys = await this.cache.keys(`${tcgApiCardsKey}:*`);
    const cards = (await Promise.all(keys.map((k) => this.cache.get(k))))
      .filter(isString)
      .map(c => JSON.parse(c) as PokemonTCG.Card);
    return cards;
  }
}
