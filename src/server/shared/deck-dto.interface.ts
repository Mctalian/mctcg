import { SectionedDeck } from "../app/decks/sectioned-deck.interface";
import { Format } from "../app/pdf-exporter/format.enum";
import { GenerateMetadataDto } from "./generate-metadata-dto.interface";
import { ValidateMetadataDto } from "./validate-metadata-dto.interface";

export interface DeckDto extends SectionedDeck {
  errors?: string[];
  warnings?: string[];
  format: Format;
}

export interface DeckValidateDto extends DeckDto, ValidateMetadataDto {}

export interface DeckGenerateDto extends DeckDto, GenerateMetadataDto {}
