"use client";

import React from "react";
import { useFormState } from "react-dom";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { red, yellow } from "@mui/material/colors";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

import styles from "./page.module.css";
import DeckContents from "./DeckContents";
import DeckImportForm from "./DeckImportForm";
import PdfPrepForm from "./PdfPrepForm";
import PdfDownloadLink from "./PdfDownloadLink";
import PdfGenerationError from "./PdfGenerationError";
import { generatePdf, importDecklist } from "./form-state-actions";

const darkTheme = createTheme({
  palette: {
    primary: red,
    secondary: yellow,
    mode: 'dark',
  },
});

export default function Page() {
  const [deck, importFormAction] = useFormState(importDecklist, null);
  const [pdf, generateFormAction] = useFormState(generatePdf, { blob: null, error: null });

  const [startPdfFlow, setStartPdfFlow] = React.useState(false);
  const [deckName, setDeckName] = React.useState(`Deck ${new Date().toISOString()}`);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <main className={styles.main}>
          { !deck && (
            <DeckImportForm importFormAction={importFormAction} setDeckName={setDeckName} deckName={deckName} />
          )}

          { deck && !startPdfFlow && (
            <DeckContents deck={deck} deckName={deckName} setStartPdfFlow={setStartPdfFlow} />
          )}

          { startPdfFlow && !pdf?.blob && (
            <PdfPrepForm deck={deck} generateFormAction={generateFormAction} />
          )}

          { startPdfFlow && pdf?.blob && !pdf?.error && (
            <PdfDownloadLink blob={pdf.blob} />
          )}

          { startPdfFlow && pdf?.error && (
            <PdfGenerationError error={pdf.error} />
          )}
        </main>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
