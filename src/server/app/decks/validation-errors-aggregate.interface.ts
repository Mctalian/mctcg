import { Section } from "./section.enum";

export interface ValidationErrorsAggregate {
  [Section.Pokemon]: string[];
  [Section.Trainer]: string[];
  [Section.Energy]: string[];
  deck: string[];
  deckWarnings: string[];
}