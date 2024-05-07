import { Box, Tabs, Tab } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import DeckComposition from "./DeckComposition";
import DeckStatistics from "./DeckStats";
import TabPanel from "./TabPanel";

export default function DeckStatsTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Composition" />
          <Tab label="Simulations" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <DeckComposition />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <DeckStatistics />
      </TabPanel>
    </Box>
  );
}