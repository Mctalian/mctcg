"use client"

import { Suspense } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setLoading } from "../../store/loadingSlice";
import PdfDownloadLink from "./components/PdfDownloadLink";

export default function Page() {
  const { blob } = useAppSelector((state) => state.pdf);
  const dispatch = useAppDispatch();
  dispatch(setLoading(false));

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PdfDownloadLink blob={blob} />
    </Suspense>
  )
}