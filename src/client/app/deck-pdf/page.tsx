"use client"

import { useAppSelector } from "../store/hooks";
import DeckImportForm from "./components/DeckImportForm";

export default function Page() {
  const { name: deckName } = useAppSelector((state) => state.deck);

  return (
    <DeckImportForm deckName={deckName} />
  )
}