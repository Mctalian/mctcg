import { GenerateMetadataDto } from "./generate-metadata-dto.interface";
import { ValidateMetadataDto } from "./validate-metadata-dto.interface";

export interface DecklistDto {
  decklist: string;
}

export interface DecklistValidateDto extends DecklistDto, ValidateMetadataDto {}

export interface DecklistGenerateDto extends DecklistDto, GenerateMetadataDto {}
