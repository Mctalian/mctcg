"use client"

import { Box, FormControl, FormLabel, MenuItem, Select } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useAppSelector } from "../../../../store/hooks";
import DeckTabs from "./DeckTabs";
import DeckName from "./DeckName";
import styles from "./EditDeck.module.css";
import { useId, useState } from "react";

interface EditDeckProps {
  deckIndex: number;
}

export enum DisplayType {
  List = "List",
  Card = "Card",
}

export default function EditDeck({ deckIndex }: EditDeckProps) {
  const deck = useAppSelector((state) => state.decks.decks[deckIndex] );
  const [displayType, setDisplayType] = useState(DisplayType.List);
  const displayTypeLabelId = useId();
  const displayTypeId = useId();

  return (
    <Box className={styles.deck}>
      <DeckName deck={deck} deckIndex={deckIndex} />
      <FormControl>
        <FormLabel id={displayTypeLabelId}>Display Type</FormLabel>
        <Select
          labelId={displayTypeLabelId}
          id={displayTypeId}
          name="displayType"
          value={displayType}
          onChange={(e) => setDisplayType(e.target.value as DisplayType)}
        >
          <MenuItem value={DisplayType.List}>List</MenuItem>
          <MenuItem value={DisplayType.Card}>Cards</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", flexWrap: "inherit" }}>
        <DeckTabs deck={deck} displayType={displayType} />
        <PieChart
          height={500}
          slotProps={{
            legend: {
              direction: "row",
              position: {
                horizontal: "left",
                vertical: "bottom",
              }
            }
          }}
          series={[
            {
              arcLabel: (item) => `${item.value}`,
              innerRadius: 0,
              outerRadius: 80,
              data: [
                { value: deck.deck.Pokemon.reduce((acc, c) => acc += c.quantity, 0), label: "Pokémon", color: "green",},
                { value: deck.deck.Trainer.reduce((acc, c) => acc += c.quantity, 0), label: "Trainers", color: "orange", },
                { value: deck.deck.Energy.reduce((acc, c) => acc += c.quantity, 0), label: "Energy", color: "blue" },
              ]
            },
            {
              arcLabel: (item) => `${item.value}`,
              innerRadius: 100,
              outerRadius: 120,
              data: [
                { value: deck.deck.Pokemon.filter(p => p.subtypes.includes("Basic")).reduce((acc, c) => acc += c.quantity, 0), label: "Basic", color: "#339933"},
                { value: deck.deck.Pokemon.filter(p => p.subtypes.includes("Stage 1")).reduce((acc, c) => acc += c.quantity, 0), label: "Stage 1", color: "#80c080"},
                { value: deck.deck.Pokemon.filter(p => p.subtypes.includes("Stage 2")).reduce((acc, c) => acc += c.quantity, 0), label: "Stage 2", color: "#003300"},
                { value: deck.deck.Pokemon.filter(p => p.subtypes.includes("VSTAR")).reduce((acc, c) => acc += c.quantity, 0), label: "VSTAR", color: "#001a00"},
                { value: deck.deck.Trainer.filter(p => p.subtypes.includes("Supporter")).reduce((acc, c) => acc += c.quantity, 0), label: "Supporters", color: "#332100"},
                { value: deck.deck.Trainer.filter(p => p.subtypes.includes("Item")).reduce((acc, c) => acc += c.quantity, 0), label: "Items", color: "#996300"},
                { value: deck.deck.Trainer.filter(p => p.subtypes.includes("Stadium")).reduce((acc, c) => acc += c.quantity, 0), label: "Stadiums", color: "#ffc04d"},
                { value: deck.deck.Trainer.filter(p => p.subtypes.includes("Pokémon Tool")).reduce((acc, c) => acc += c.quantity, 0), label: "Tools", color: "#ffa500"},
                { value: deck.deck.Energy.filter(p => p.subtypes.includes("Basic")).reduce((acc, c) => acc += c.quantity, 0), label: "Basic", color: "#000080" },
                { value: deck.deck.Energy.filter(p => p.subtypes.includes("Special")).reduce((acc, c) => acc += c.quantity, 0), label: "Special", color: "#3333ff" },
              ]
            }
          ]}
        />
      </Box>
    </Box>
  )
}