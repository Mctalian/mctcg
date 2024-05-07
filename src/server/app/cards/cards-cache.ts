import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { logger, redis, Prefix } from "../../utils/index.js";
import { isString } from "../../utils/is-string.js";
import { CardSearchDto } from "../../shared/card-search-dto.interface.js";
import { Card } from "./card.interface.js";
import { CardFactory } from "./card-factory.js";

const tcgApiCardsKey = `${Prefix.TcgApi}:cards`;

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
    formatQuery: "Standard",
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

      return await Promise.all(filteredCards.map((c) => cardFactory.createFromApiObject(c)))
    }
    return [];
  }

  /*private*/ async getAllCachedCards() {
    const keys = await this.cache.keys(`${tcgApiCardsKey}:*`);
    const cards = (await Promise.all(keys.map((k) => this.cache.get(k))))
      .filter(isString)
      .map(c => JSON.parse(c) as PokemonTCG.Card);
    return cards;
  }
}
