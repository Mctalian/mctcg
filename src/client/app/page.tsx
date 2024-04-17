"use client";

import { useState } from "react";
import { useFormState } from "react-dom";

import { importDecklist, generatePdf } from "./components/form-state-actions";
import { useAppDispatch } from "./store/hooks";
import DeckContents from "./components/DeckContents";
import DeckImportForm from "./components/DeckImportForm";
import PdfPrepForm from "./components/PdfPrepForm";
import PdfDownloadLink from "./components/PdfDownloadLink";
import PdfGenerationError from "./components/PdfGenerationError";
import { setLoading } from "./store/loadingSlice";


export default function Page() {
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
    <>
      {pageState()}
    </>
  );
}
