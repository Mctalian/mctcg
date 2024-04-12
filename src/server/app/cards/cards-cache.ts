import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { logger, redis, Prefix } from "../../utils/index.js";

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
}
