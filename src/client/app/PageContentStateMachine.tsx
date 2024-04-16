import { useState } from "react";
import { useFormState } from "react-dom";

import { importDecklist, generatePdf } from "./form-state-actions";
import { useAppDispatch, useAppSelector } from "./hooks";
import styles from "./page.module.css";
import DeckContents from "./DeckContents";
import DeckImportForm from "./DeckImportForm";
import PdfPrepForm from "./PdfPrepForm";
import PdfDownloadLink from "./PdfDownloadLink";
import PdfGenerationError from "./PdfGenerationError";
import { CircularProgress } from "@mui/material";
import { setLoading } from "./loadingSlice";

export default function PageContentStateMachine() {
  const [deck, importFormAction] = useFormState(importDecklist, null);
  const [pdf, generateFormAction] = useFormState(generatePdf, { blob: null, error: null });

  const [startPdfFlow, setStartPdfFlow] = useState(false);
  const [deckName, setDeckName] = useState(`Deck ${new Date().toISOString()}`);

  const dispatch = useAppDispatch();

  function pageState() {
    if (!deck) {
      return <DeckImportForm importFormAction={importFormAction} setDeckName={setDeckName} deckName={deckName} />;
    } else if (!startPdfFlow) {
      dispatch(setLoading(false));
      return <DeckContents deck={deck} deckName={deckName} setStartPdfFlow={setStartPdfFlow} />;
    } else {
      if (!pdf?.blob) {
        return <PdfPrepForm deck={deck} generateFormAction={generateFormAction} />;
      } else if (pdf?.blob && !pdf?.error) {
        dispatch(setLoading(false));
        return <PdfDownloadLink blob={pdf.blob} />;
      } else {
        return <PdfGenerationError error={pdf.error} />;
      }
    }
  }

  return (
    <main className={styles.main}>
      {pageState()}
    </main>
  )
}