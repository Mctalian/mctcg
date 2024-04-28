"use client"

import { useAppSelector } from "../../../../store/hooks";
import DeckTabs from "./DeckTabs";

interface EditDeckProps {
  deckIndex: number;
}

export default function EditDeck({ deckIndex }: EditDeckProps) {
  const deck = useAppSelector((state) => state.decks.decks[deckIndex] );

  return (
    <>
      <h1>{deck.name}</h1>
      <DeckTabs />
    </>
  )
}