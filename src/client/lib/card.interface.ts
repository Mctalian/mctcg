export interface Card {
  quantity: number;
  name: string;
  setAbbr: string;
  setNumber: string;
  regCode?: string;
  errors?: string[];
  subtypes?: string[];
}
