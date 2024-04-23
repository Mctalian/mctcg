"use client"

import { Suspense } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setLoading } from "../../store/loadingSlice";
import PdfDownloadLink from "./components/PdfDownloadLink";
import { initialDeckState, setDeckName } from "../../store/deckSlice";

export default function Page() {
  const { blob } = useAppSelector((state) => state.pdf);
  const dispatch = useAppDispatch();
  dispatch(setLoading(false));
  dispatch(setDeckName(initialDeckState.name))

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PdfDownloadLink blob={blob} />
    </Suspense>
  )
}