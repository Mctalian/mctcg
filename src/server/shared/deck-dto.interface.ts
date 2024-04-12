import { SectionedDeck } from "../app/decks/sectioned-deck.interface";
import { GenerateMetadataDto } from "./generate-metadata-dto.interface";
import { ValidateMetadataDto } from "./validate-metadata-dto.interface";

export interface DeckDto extends SectionedDeck {}

export interface DeckValidateDto extends DeckDto, ValidateMetadataDto {}

export interface DeckGenerateDto extends DeckDto, GenerateMetadataDto {}
