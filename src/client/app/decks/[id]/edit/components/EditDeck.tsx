"use client"

import { Box } from "@mui/material";
import { useEffect,useState } from "react";
import { useAppSelector } from "@mctcg/store/hooks";
import { countCards } from "@mctcg/lib/deck-utils";
import { DeckStats, Simulator } from "@mctcg/lib/simulator";
import DeckComposition from "./DeckComposition";
import DeckDisplayPreferences from "./DeckDisplayPreferences";
import DeckName from "./DeckName";
import DeckStatistics from "./DeckStats";
import DeckTabs from "./DeckTabs";
import styles from "./EditDeck.module.css";
import DeckStatsTabs from "./DeckStatsTabs";

interface EditDeckProps {
  deckIndex: number;
}

export default function EditDeck({ deckIndex }: EditDeckProps) {
  const deck = useAppSelector((state) => state.decks.decks[deckIndex] );
  const { deckDisplay: displayType } = useAppSelector((state) => state.displayPreferences );
  const [deckStats, setDeckStats] = useState({} as DeckStats);

  useEffect(() => {
    if (countCards(deck) !== 60) {
      setDeckStats({} as DeckStats)
      return;
    }
    const simulator = new Simulator(deck);
    simulator.run();
    setDeckStats({
      ...simulator
    });
  }, [deck])

  return (
    <Box className={styles.deck}>
      <DeckName deck={deck} deckIndex={deckIndex} />
      <DeckDisplayPreferences />
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", flexWrap: "inherit" }}>
        <DeckTabs deck={deck} displayType={displayType} />
        <DeckStatsTabs deck={deck} deckStats={deckStats} />
      </Box>
    </Box>
  )
}