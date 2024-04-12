import { Singularity } from "./singularity.enum.js";

export interface Card {
  quantity: number;
  name: string;
  setAbbr: string;
  setNumber: string;
  regCode?: string;
  singularityType?: Singularity;
  supertype?: string;
  subtypes?: string[];
  errors?: string[];
}

export interface SingularityCard extends Card {
  singularityType: Singularity;
}

export interface BasicEnergyCard extends Card {
  supertype: "Energy";
  subtypes: ["Basic"];
}

export function isSingularityCard(card: Card): card is SingularityCard {
  return !!card.singularityType && card.singularityType !== Singularity.None;
}

export function isBasicEnergy(card: Card): card is BasicEnergyCard {
  return !!card.subtypes?.includes("Basic") && card.supertype === "Energy";
}
