import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { redis, logger, Prefix } from "../../utils/index.js";

const tcgApiSetsKey = `${Prefix.TcgApi}:sets`;
const pdeckfSetsKey = `${Prefix.PDeckF}:sets`;

export class SetsCache {
  constructor(
    private readonly cache = redis
  ) {

  }
  public async populateSets(sets: PokemonTCG.Set[]): Promise<void> {
    await this.cache.set(tcgApiSetsKey, JSON.stringify(sets));
  }

  public async addAbbr(abbr: string, setId: string): Promise<void> {
    await Promise.all([
      this.cache.set(`${pdeckfSetsKey}:${abbr}`, setId),
      this.cache.set(`${pdeckfSetsKey}:${setId}`, abbr),
    ]);
  }

  public async getSetByAbbr(abbr: string): Promise<string | null> {
    const setId = await this.cache.get(`${pdeckfSetsKey}:${abbr}`);
    if (setId) {
      return setId;
    }
    const set = await PokemonTCG.findSetsByQueries({
      q: `ptcgoCode:${abbr} AND -name:*Gallery`
    });

    if (set.length !== 1) {
      logger.error(`Invalid set abbreviation: ${abbr} (Found ${set.length} sets)`);
      return null;
    }
    await this.addAbbr(abbr, set[0].id);
    return set[0].id;
  }

  public async getSetById(setId: string): Promise<string | null> {
    const abbr = await this.cache.get(`${pdeckfSetsKey}:${setId}`);
    if (abbr) {
      return abbr;
    }

    const set = await PokemonTCG.findSetsByQueries({
      q: `id:${setId} AND -name:*Gallery`
    });

    if (set.length !== 1) {
      logger.error(`Invalid set id: ${setId} (Found ${set.length} sets)`);
      return null;
    }
    if (set[0].ptcgoCode) {
      await this.addAbbr(set[0].ptcgoCode, setId);
    }
    return set[0].ptcgoCode;
  }

  public async getSets(): Promise<PokemonTCG.Set[]> {
    const sets = JSON.parse((await this.cache.get(tcgApiSetsKey)) || "[]");
    if (sets.length > 0) {
      return sets;
    }
    const apiSets = await PokemonTCG.getAllSets();
    await this.populateSets(apiSets);
    return apiSets;
  }
}
