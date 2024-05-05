import { Box, Tabs, Tab } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { Deck } from "../../../../../lib/deck.interface";
import SectionList from "./SectionList";
import { DeckDisplayType } from "../../../../../lib/deck-display-type.interface";
import TabPanel from "./TabPanel";

interface DeckTabsProps {
  deck: Deck,
  displayType: DeckDisplayType
}

export default function DeckTabs({ deck, displayType }: DeckTabsProps) {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Pokemon" />
          <Tab label="Trainers" />
          <Tab label="Energy" />
          <Tab label="All" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <SectionList list={deck.deck.Pokemon} displayType={displayType} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <SectionList list={deck.deck.Trainer} displayType={displayType} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <SectionList list={deck.deck.Energy} displayType={displayType} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <SectionList list={deck.deck.Pokemon.concat(deck.deck.Trainer, deck.deck.Energy)} displayType={displayType} />
      </TabPanel>
    </Box>
  );
}