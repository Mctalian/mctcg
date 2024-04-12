import { Section } from "../pdf-exporter/section.enum";

export interface ValidationErrorsAggregate {
  [Section.Pokemon]: string[];
  [Section.Trainer]: string[];
  [Section.Energy]: string[];
  deck: string[];
  deckWarnings: string[];
}