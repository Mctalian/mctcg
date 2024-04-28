import { Card } from "./card.interface";
import { Format } from "./format.enum";
import { SortType } from "./sort-type.enum";

export interface Deck {
  name: string;
  deck: {
    Pokemon: Card[];
    Trainer: Card[];
    Energy: Card[];
    errors?: string[];
    warnings?: string[];
    format?: Format
  },
  sortType: SortType;
}