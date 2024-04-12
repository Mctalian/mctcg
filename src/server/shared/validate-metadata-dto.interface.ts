import { Format } from "../app/pdf-exporter/format.enum";
import { DeckDto } from "./deck-dto.interface";

export interface ValidateMetadataDto extends DeckDto {
  format: Format;
}
