import { Format } from "../app/pdf-exporter/format.enum";

export interface GenerateMetadataDto {
  playerName: string;
  playerId: string;
  playerDob: string;
  format: Format;
}
