import { useState } from "react";
import { useFormState } from "react-dom";

import { importDecklist, generatePdf } from "./form-state-actions";
import { useAppDispatch } from "./hooks";
import styles from "./page.module.css";
import DeckContents from "./DeckContents";
import DeckImportForm from "./DeckImportForm";
import PdfPrepForm from "./PdfPrepForm";
import PdfDownloadLink from "./PdfDownloadLink";
import PdfGenerationError from "./PdfGenerationError";
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
        if (pdf?.error) {
          dispatch(setLoading(false));
          return <PdfGenerationError error={pdf.error} />;
        }
        return <PdfPrepForm deck={deck} generateFormAction={generateFormAction} />;
      } else {
        dispatch(setLoading(false));
        if (pdf?.error) {
          return <PdfGenerationError error={pdf.error} />;
        } else {
          return <PdfDownloadLink blob={pdf.blob} />;
        }
      }
    }
  }

  return (
    <main className={styles.main}>
      {pageState()}
    </main>
  )
}