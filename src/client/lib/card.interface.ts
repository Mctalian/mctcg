export interface Card {
  id: string;
  quantity: number;
  name: string;
  setAbbr: string;
  setNumber: string;
  regCode?: string;
  errors?: string[];
  subtypes?: string[];
  supertype: "Pokémon" | "Trainer" | "Energy";
  images: {
    small: string;
    large: string;
  }
}
