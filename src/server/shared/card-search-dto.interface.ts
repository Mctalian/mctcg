import { Section } from "../app/decks/section.enum";
import { Card } from "../app/cards/card.interface";

export interface CardSearchDto {
  nameQuery: string;
  typeQuery: string[];
  attackCostQuery: string[];
  superTypeQuery: Section[];
  subTypeQuery: string[];
  rarityQuery: string[];
  retreatCostQuery: number;
  formatQuery: "Standard" | "Expanded" | "Unlimited";
  cachedResultsOnly: boolean;
}

export interface CardSearchResponseDto {
  cards: Card[];
  numberOfCards: number;
  cachedResults: boolean;
}