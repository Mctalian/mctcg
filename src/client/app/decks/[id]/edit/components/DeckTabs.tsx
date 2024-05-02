import { Box, Tabs, Tab, Typography, List, ListItem } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { Deck } from "../../../../../lib/deck.interface";
import SectionList from "./SectionList";
import { DisplayType } from "./EditDeck";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

interface DeckTabsProps {
  deck: Deck,
  displayType: DisplayType
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