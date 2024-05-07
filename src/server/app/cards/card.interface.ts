import { Singularity } from "./singularity.enum.js";

export interface Card {
  id?: string;
  quantity?: number;
  name: string;
  setAbbr: string;
  setNumber: string;
  images?: {
    small?: string;
    large?: string;
  }
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
  return (!!card.subtypes?.includes("Basic") && card.supertype === "Energy") || 
    (card.name.includes("Basic") && card.name.includes("Energy"));
}
