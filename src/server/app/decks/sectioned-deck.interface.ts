import { Card } from "../cards/card.interface.js";
import { Section } from "./section.enum.js";

export interface SectionedDeck {
  [Section.Pokemon]: Card[];
  [Section.Trainer]: Card[];
  [Section.Energy]: Card[];
}

export function isSectionedDeck(obj: any): obj is SectionedDeck {
  const deckTest = obj as SectionedDeck;
  if (!deckTest || !deckTest[Section.Pokemon] || !deckTest[Section.Trainer] || !deckTest[Section.Energy]) {
    return false;
  }
  return deckTest[Section.Pokemon].length >= 0 && deckTest[Section.Trainer].length >= 0 && deckTest[Section.Energy].length >= 0;
}
