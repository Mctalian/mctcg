"use client"

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setLoading } from "../../store/loadingSlice";
import PdfGenerationError from "./components/PdfGenerationError";

export default function Page() {
  const { error } = useAppSelector((state) => state.pdf);

  const dispatch = useAppDispatch();
  dispatch(setLoading(false));

  return <PdfGenerationError error={error} />;
}