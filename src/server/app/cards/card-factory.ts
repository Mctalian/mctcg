import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Card } from "./card.interface.js";
import { SetsCache } from "../sets/sets-cache.js";
import { CardsCache } from "./cards-cache.js";
import { Singularity } from "./singularity.enum.js";
import { logger } from "../../utils/logger.js";

export class CardFactory {
  

  constructor(
    private readonly setsCache: SetsCache,
    private readonly cardsCache: CardsCache
  ) {

  }

  createFromLiveExportLine(line: string) {
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
    return card;
  }

  async createFromApiObject(c: PokemonTCG.Card) {
    const card: Card = {
      id: c.id,
      name: c.name,
      setNumber: c.number,
      setAbbr: await this.setsCache.getSetById(c.set.id) || "",
      images: this.processImageField(c),
      supertype: c.supertype,
      subtypes: c.subtypes,
      regCode: c["regulationMark"] || "",
    }
    card.singularityType = Singularity.None;
    if (c.rules?.length) {
      if (c.rules.some(rule => rule.includes("You can't have more than 1") && rule.includes("in your deck"))) {
        const matchingSubtype = c.subtypes?.find(subtype => Singularity[subtype]);
        if (matchingSubtype) {
          card.singularityType = Singularity[matchingSubtype];
        } else {
          logger.error(`Card has singularity rule but no matching subtype: ${JSON.stringify(c, null, 2)}`);
        }
      }
    }
    return card;
  }

  private processImageField(cardInfo: PokemonTCG.Card) {
    if (!cardInfo.images) {
      return;
    }
    const images = {}
    if (cardInfo.images.small) {
      images["small"] = cardInfo.images.small;
    }
    if (cardInfo.images.large) {
      images["large"] = cardInfo.images.large;
    }
    return images;
  }
}