"use client"

import { Box, Tabs, Tab, CircularProgress } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import SectionList from "./SectionList";
import { DeckDisplayType } from "../../../../../lib/deck-display-type.interface";
import TabPanel from "./TabPanel";
import { useAppSelector } from "@mctcg/store/hooks";

interface DeckTabsProps {
  displayType: DeckDisplayType
  addNewCard: () => void
}

export default function DeckTabs({ displayType, addNewCard }: DeckTabsProps) {
  const deck = useAppSelector((state) => state.decks.decks[state.decks.selectedDeckIndex] );
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (!deck) {
    return <CircularProgress />
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Pokémon" />
          <Tab label="Trainers" />
          <Tab label="Energy" />
          <Tab label="All" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <SectionList list={deck.deck.Pokemon} displayType={displayType} addNewCard={addNewCard}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <SectionList list={deck.deck.Trainer} displayType={displayType} addNewCard={addNewCard}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <SectionList list={deck.deck.Energy} displayType={displayType} addNewCard={addNewCard}/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <SectionList list={deck.deck.Pokemon.concat(deck.deck.Trainer, deck.deck.Energy)} displayType={displayType} addNewCard={addNewCard}/>
      </TabPanel>
    </Box>
  );
}