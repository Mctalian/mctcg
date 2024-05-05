import { Card } from "./card.interface";
import { Deck } from "./deck.interface";

export function countSection(cards: Card[]) {
  return cards.reduce((acc, c) => acc += c.quantity, 0);
}

export function countSectionSubtype(cards: Card[], subtype: string) {
  return cards.filter(p => p.subtypes.includes(subtype)).reduce((acc, c) => acc += c.quantity, 0)
}

export function countCards(deck: Deck) {
  const numberOfPokemonCards = countSection(deck.deck.Pokemon);
  const numberOfTrainerCards = countSection(deck.deck.Trainer);
  const numberOfEnergyCards = countSection(deck.deck.Energy);
  return numberOfEnergyCards + numberOfTrainerCards + numberOfPokemonCards;
}