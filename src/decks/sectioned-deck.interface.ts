import { Card } from "../cards/card.interface";
import { Format } from "../pdf-exporter/format.enum";
import { Section } from "../pdf-exporter/section.enum";

export interface SectionedDeck {
  [Section.Pokemon]: Card[];
  [Section.Trainer]: Card[];
  [Section.Energy]: Card[];
}
