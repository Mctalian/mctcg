import { Card } from "../cards/card.interface";
import { SectionedDeck } from "../decks/sectioned-deck.interface";
import { Format } from "../pdf-exporter/format.enum";
import { Section } from "../pdf-exporter/section.enum";

export interface DeckDto extends SectionedDeck {
  [Section.Pokemon]: Card[];
  [Section.Trainer]: Card[];
  [Section.Energy]: Card[];
  format: Format;
}