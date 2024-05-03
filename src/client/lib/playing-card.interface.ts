export interface PlayingCard {
  name: string;
  setAbbrev: string;
  setNumber: string;
  isBasicPokemon: boolean;
  type: "Pokemon" | "Trainer" | "Energy";
  subtypes?: string[];
}