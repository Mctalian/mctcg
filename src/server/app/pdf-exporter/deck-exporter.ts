import { PDFDocument, PDFForm, PDFPage, rgb } from "pdf-lib";
import { access, mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { differenceInCalendarYears, getDate, getMonth, getYear } from "date-fns";
import { SectionedDeck } from "../decks/sectioned-deck.interface.js";
import { logger } from "../../utils/index.js";
import { Format } from "./format.enum.js";

const FORM_URL = "https://www.pokemon.com/static-assets/content-assets/cms2/pdf/play-pokemon/rules/play-pokemon-deck-list-85x11-tef.pdf"
const LOCAL_FORM_PATH = "pdfs/blank-reg-raw.pdf";
const NAME_FIELD = "Player Name";
const DEFAULT_FILE_NAME = "out/filled-form.pdf";
const HEADER_TEXT_HEIGHT = 16;
const OFFSET_FORMAT_Y = 62;
const OFFSET_HEADER_Y = 81;
const OFFSET_POKEMON_Y = 207;
const OFFSET_TRAINER_Y = 384;
const OFFSET_ENERGY_Y = 665;
const AGE_DIVISION_X = 374;
const QUANTITY_WIDTH = 29;
const NAME_WIDTH = 164;
const SET_WIDTH = 30;
const COLL_NUM_WIDTH = 30;
const REG_WIDTH = 29;
const TABLE_X = 262;
const TABLE_LINE_HEIGHT = 10.1;
const TABLE_ROW_SPACING = 3;
const TABLE_COL_SPACING = 7;
const TABLE_SHARED_PARAMS = {
  borderWidth: 0.5,
  height: TABLE_LINE_HEIGHT,
  backgroundColor: rgb(0.8, 0.8, 0.8),
  borderColor: rgb(0.2, 0.2, 0.2),
};
const CHECKBOX_PARAMS = {
  borderWidth: 1,
  height: 9,
  width: 9,
};

export class DeckExporter {
  private pdfDoc: PDFDocument;
  private form: PDFForm;
  private page: PDFPage;
  private pdfBytes: ArrayBuffer;
  private pageHeight: number;

  constructor(
    private readonly playerName = "",
    private readonly playerId = "",
    private readonly dob: Date | null = null,
    private readonly format: Format = Format.Standard,
    private readonly deck: SectionedDeck | null,
    private readonly fileName = DEFAULT_FILE_NAME,
  ) {}

  private async loadBlankPdf() {
    logger.debug(`Loading blank PDF...`);
    try {
      await access(LOCAL_FORM_PATH);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
      await mkdir("pdfs").catch((error) => {
        if (error.code !== "EEXIST") {
          throw error;
        }
      });
      logger.debug(`Downloading form...`);
      const formBytes = await fetch(FORM_URL).then(res => res.arrayBuffer());
      await writeFile(LOCAL_FORM_PATH, new Uint8Array(formBytes));
    }
    this.pdfBytes = await readFile(LOCAL_FORM_PATH);
    this.pdfDoc = await PDFDocument.load(this.pdfBytes)
    this.page = this.pdfDoc.getPage(0);
    this.form = this.pdfDoc.getForm();
    this.pageHeight = this.page.getHeight();
  }

  private createFormFields() {
    logger.debug(`Creating form and filling in fields...`);
    // Format Section
    this.createFormatCheckboxes();
    // Player Information Section
    this.createPlayerNameField();
    this.createPlayerIdField();
    this.createDateOfBirthField();
    // Age Division Section
    this.createAgeDivisionCheckboxes();
    // Pokemon Section
    this.createPokemonSection();
    // Trainer Section
    this.createTrainerSection();
    // Energy Section
    this.createEnergySection();
  }

  async generatePdf() {
    await this.loadBlankPdf();
    await this.createFormFields();
    logger.debug(`Generating PDF...`);
    const pdfBytes = await this.pdfDoc.save();
    logger.debug(`Generated PDF.`);
    return pdfBytes;
  }

  async saveToFile() {
    await this.cleanUpFile();
    const pdfBytes = await this.generatePdf();
    await mkdir("out").catch((error) => {
      if (error.code !== "EEXIST") {
        throw error;
      }
    });
    await writeFile(this.fileName, pdfBytes);
    logger.debug(`Saved filled form to file: ${this.fileName}`);
    return this.fileName;
  }

  private async cleanUpFile() {
    logger.debug(`Cleaning up output file...`);
    try {
      await unlink(this.fileName);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }

  private createFormatCheckboxes() {
    const format = this.form.createRadioGroup("Format");
    format.enableRequired();
    format.addOptionToPage("Standard", this.page, {
      x: 155,
      y: this.pageHeight - OFFSET_FORMAT_Y,
      ...CHECKBOX_PARAMS,
    });
    format.addOptionToPage("Expanded", this.page, {
      x: 205,
      y: this.pageHeight - OFFSET_FORMAT_Y,
      ...CHECKBOX_PARAMS
    });
    if (this.format === Format.Expanded) {
      format.select("Expanded");
    } else {
      format.select("Standard");
    }
  }

  private createPlayerNameField() {
    const nameField = this.form.createTextField(NAME_FIELD)
    nameField.addToPage(this.page, {
      x: 90,
      y: this.pageHeight - OFFSET_HEADER_Y,
      borderWidth: 0,
      height: HEADER_TEXT_HEIGHT,
      width: 145,
    });
    if (this.playerName) {
      nameField.setText(this.playerName);
    }
  }

  private createPlayerIdField() {
    const playerIdField = this.form.createTextField("Player ID");
    playerIdField.addToPage(this.page, {
      x: 275,
      y: this.pageHeight - OFFSET_HEADER_Y,
      borderWidth: 0,
      height: HEADER_TEXT_HEIGHT,
      width: 98,
    });
    if (this.playerId) {
      playerIdField.setText(this.playerId);
    }
  }

  private createDateOfBirthField() {
    const dobMonthField = this.form.createTextField("Date of Birth (Month)");
    const dobDayField = this.form.createTextField("Date of Birth (Day)");
    const dobYearField = this.form.createTextField("Date of Birth (Year)");
    
    dobMonthField.addToPage(this.page, {
      x: 490,
      y: this.pageHeight - OFFSET_HEADER_Y,
      borderWidth: 0,
      height: HEADER_TEXT_HEIGHT,
      width: 20,
    });
    dobDayField.addToPage(this.page, {
      x: 520,
      y: this.pageHeight - OFFSET_HEADER_Y,
      borderWidth: 0,
      height: HEADER_TEXT_HEIGHT,
      width: 20,
    });
    dobYearField.addToPage(this.page, {
      x: 545,
      y: this.pageHeight - OFFSET_HEADER_Y,
      borderWidth: 0,
      height: HEADER_TEXT_HEIGHT,
      width: 36,
    });
    if (this.dob) {
      dobMonthField.setText(this.datePad((getMonth(this.dob) + 1).toString()));
      dobDayField.setText(this.datePad(getDate(this.dob).toString()));
      dobYearField.setText(getYear(this.dob).toString());
    }
  }

  private createAgeDivisionCheckboxes() {
    const division = this.form.createRadioGroup("Age Division");
    division.enableRequired();
    division.addOptionToPage("Junior", this.page, {
      x: AGE_DIVISION_X,
      y: this.pageHeight - 118,
      ...CHECKBOX_PARAMS
    });
    division.addOptionToPage("Senior", this.page, {
      x: AGE_DIVISION_X,
      y: this.pageHeight - 131,
      ...CHECKBOX_PARAMS
    });
    division.addOptionToPage("Master", this.page, {
      x: AGE_DIVISION_X,
      y: this.pageHeight - 144,
      ...CHECKBOX_PARAMS
    });

    if (this.dob) {
      const numYears = differenceInCalendarYears(new Date(), this.dob);
      if (numYears >= 17) {
        division.select("Master");
      } else if (numYears >= 13) {
        division.select("Senior");
      } else {
        division.select("Junior");
      }
    }
  }

  private createPokemonSection() {
    const NUMBER_OF_POKEMON_LINES = 11;

    for (let i = 0; i < NUMBER_OF_POKEMON_LINES; i++) {
      if (i === NUMBER_OF_POKEMON_LINES - 1 && !(this.deck && this.deck.Pokemon[i])) {
        // Skip the extra lines if there are no more Pokemon cards
        logger.debug(`Skipping extra Pokemon line...`);
        break;
      }
      const pokemonQuantityField = this.form.createTextField(`Pokemon ${i + 1} Quantity`);
      const pokemonNameField = this.form.createTextField(`Pokemon ${i + 1} Name`);
      const pokemonSetField = this.form.createTextField(`Pokemon ${i + 1} Set`);
      const pokemonCollNumField = this.form.createTextField(`Pokemon ${i + 1} Coll #`);
      const pokemonRegField = this.form.createTextField(`Pokemon ${i + 1} Reg`);
      const rowY = this.pageHeight - OFFSET_POKEMON_Y - ((TABLE_LINE_HEIGHT + TABLE_ROW_SPACING) * i);
      pokemonQuantityField.addToPage(this.page, {
        x: TABLE_X,
        y: rowY,
        ...TABLE_SHARED_PARAMS,
        width: QUANTITY_WIDTH,
      });
      pokemonNameField.addToPage(this.page, {
        x: TABLE_X + QUANTITY_WIDTH + TABLE_COL_SPACING,
        y: rowY,
        ...TABLE_SHARED_PARAMS,
        width: NAME_WIDTH,
      });
      pokemonSetField.addToPage(this.page, {
        x: TABLE_X + QUANTITY_WIDTH + NAME_WIDTH + (TABLE_COL_SPACING * 2),
        y: rowY,
        ...TABLE_SHARED_PARAMS,
        width: SET_WIDTH,
      });
      pokemonCollNumField.addToPage(this.page, {
        x: TABLE_X + QUANTITY_WIDTH + NAME_WIDTH + SET_WIDTH + (TABLE_COL_SPACING * 3),
        y: rowY,
        ...TABLE_SHARED_PARAMS,
        width: COLL_NUM_WIDTH,
      });
      pokemonRegField.addToPage(this.page, {
        x: TABLE_X + QUANTITY_WIDTH + NAME_WIDTH + SET_WIDTH + COLL_NUM_WIDTH + (TABLE_COL_SPACING * 4),
        y: rowY,
        ...TABLE_SHARED_PARAMS,
        width: REG_WIDTH,
      });
      if (this.deck && this.deck.Pokemon[i]) {
        const card = this.deck.Pokemon[i];
        pokemonQuantityField.setText(card.quantity.toString());
        pokemonNameField.setText(card.name);
        pokemonSetField.setText(card.setAbbr);
        pokemonCollNumField.setText(card.setNumber);
        pokemonRegField.setText(card.regCode);
      }
    }
  }

  private createTrainerSection() {
    const NUMBER_OF_TRAINER_LINES = 19;

    for (let i = 0; i < NUMBER_OF_TRAINER_LINES; i++) {
      if (i === NUMBER_OF_TRAINER_LINES - 1 && !(this.deck && this.deck.Trainer[i])) {
        // Skip the extra lines if there are no more Trainer cards
        logger.debug(`Skipping extra Trainer line...`);
        break;
      }
      const trainerQuantityField = this.form.createTextField(`Trainer ${i + 1} Quantity`);
      const trainerNameField = this.form.createTextField(`Trainer ${i + 1} Name`);
      const trainerSetField = this.form.createTextField(`Trainer ${i + 1} Set`);
      const trainerCollNumField = this.form.createTextField(`Trainer ${i + 1} Coll #`);
      const trainerRegField = this.form.createTextField(`Trainer ${i + 1} Reg`);
      let rowY = this.pageHeight - OFFSET_TRAINER_Y;
      if (i > 0) {
        rowY -= ((TABLE_LINE_HEIGHT + TABLE_ROW_SPACING) * i);
      }
      trainerQuantityField.addToPage(this.page, {
        x: TABLE_X,
        y: rowY,
        ...TABLE_SHARED_PARAMS,
        width: QUANTITY_WIDTH,
      });
      trainerNameField.addToPage(this.page, {
        x: TABLE_X + QUANTITY_WIDTH + TABLE_COL_SPACING,
        y: rowY,
        ...TABLE_SHARED_PARAMS,
        width: NAME_WIDTH,
      });
      trainerSetField.addToPage(this.page, {
        x: TABLE_X + QUANTITY_WIDTH + NAME_WIDTH + (TABLE_COL_SPACING * 2),
        y: rowY,
        ...TABLE_SHARED_PARAMS,
        width: SET_WIDTH,
      });
      trainerCollNumField.addToPage(this.page, {
        x: TABLE_X + QUANTITY_WIDTH + NAME_WIDTH + SET_WIDTH + (TABLE_COL_SPACING * 3),
        y: rowY,
        ...TABLE_SHARED_PARAMS,
        width: COLL_NUM_WIDTH,
      });
      trainerRegField.addToPage(this.page, {
        x: TABLE_X + QUANTITY_WIDTH + NAME_WIDTH + SET_WIDTH + COLL_NUM_WIDTH + (TABLE_COL_SPACING * 4),
        y: rowY,
        ...TABLE_SHARED_PARAMS,
        width: REG_WIDTH,
      });
      if (this.deck && this.deck.Trainer[i]) {
        const card = this.deck.Trainer[i];
        trainerQuantityField.setText(card.quantity.toString());
        trainerNameField.setText(card.name);
        trainerSetField.setText(card.setAbbr);
        trainerCollNumField.setText(card.setNumber);
        trainerRegField.setText(card.regCode);
      }
    }
  }

  private createEnergySection() {
    const NUMBER_OF_ENERGY_LINES = 5;

    for (let i = 0; i < NUMBER_OF_ENERGY_LINES; i++) {
      if (i === NUMBER_OF_ENERGY_LINES - 1 && !(this.deck && this.deck.Energy[i])) {
        // Skip the extra lines if there are no more Energy cards
        logger.debug(`Skipping extra Energy line...`);
        break;
      }
      const energyQuantityField = this.form.createTextField(`Energy ${i + 1} Quantity`);
      const energyNameField = this.form.createTextField(`Energy ${i + 1} Name`);
      const energySetField = this.form.createTextField(`Energy ${i + 1} Set`);
      const energyCollNumField = this.form.createTextField(`Energy ${i + 1} Coll #`);
      const energyRegField = this.form.createTextField(`Energy ${i + 1} Reg`);
      let rowY = this.pageHeight - OFFSET_ENERGY_Y;
      if (i > 0) {
        rowY -= ((TABLE_LINE_HEIGHT + TABLE_ROW_SPACING) * i);
      }
      energyQuantityField.addToPage(this.page, {
        x: TABLE_X,
        y: rowY,
        ...TABLE_SHARED_PARAMS,
        width: QUANTITY_WIDTH,
      });
      energyNameField.addToPage(this.page, {
        x: TABLE_X + QUANTITY_WIDTH + TABLE_COL_SPACING,
        y: rowY,
        ...TABLE_SHARED_PARAMS,
        width: NAME_WIDTH,
      });
      energySetField.addToPage(this.page, {
        x: TABLE_X + QUANTITY_WIDTH + NAME_WIDTH + (TABLE_COL_SPACING * 2),
        y: rowY,
        ...TABLE_SHARED_PARAMS,
        width: SET_WIDTH,
      });
      energyCollNumField.addToPage(this.page, {
        x: TABLE_X + QUANTITY_WIDTH + NAME_WIDTH + SET_WIDTH + (TABLE_COL_SPACING * 3),
        y: rowY,
        ...TABLE_SHARED_PARAMS,
        width: COLL_NUM_WIDTH,
      });
      energyRegField.addToPage(this.page, {
        x: TABLE_X + QUANTITY_WIDTH + NAME_WIDTH + SET_WIDTH + COLL_NUM_WIDTH + (TABLE_COL_SPACING * 4),
        y: rowY,
        ...TABLE_SHARED_PARAMS,
        width: REG_WIDTH,
      });
      if (this.deck && this.deck.Energy[i]) {
        const card = this.deck.Energy[i];
        energyQuantityField.setText(card.quantity.toString());
        energyNameField.setText(card.name);
        energySetField.setText(card.setAbbr);
        energyCollNumField.setText(card.setNumber);
        energyRegField.setText(card.regCode);
      }
    }
  }

  private datePad(monthOrDate: string) {
    return "0".concat(monthOrDate).slice(-2);
  }
}