import { Format } from "../pdf-exporter/format.enum";

export interface DecklistDto {
  decklist: string;
}

export interface DecklistValidateDto extends DecklistDto {
  format: Format;
}

export interface DecklistGenerateDto extends DecklistValidateDto {
  playerName: string;
  playerId: string;
  playerDob: string;
}
