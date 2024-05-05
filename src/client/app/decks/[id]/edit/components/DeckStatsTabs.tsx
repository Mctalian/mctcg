import { Box, Tabs, Tab } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { Deck } from "../../../../../lib/deck.interface";
import TabPanel from "./TabPanel";
import DeckStatistics from "./DeckStats";
import { DeckStats } from "@mctcg/lib/simulator";
import DeckComposition from "./DeckComposition";

interface DeckStatsTabsProps {
  deck: Deck,
  deckStats: DeckStats
}

export default function DeckStatsTabs({ deck, deckStats }: DeckStatsTabsProps) {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Composition" />
          <Tab label="Simulations" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <DeckComposition deck={deck} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <DeckStatistics deckStats={deckStats} deck={deck} />
      </TabPanel>
    </Box>
  );
}