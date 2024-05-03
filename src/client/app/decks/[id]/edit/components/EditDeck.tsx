"use client"

import { Box, FormControl, FormLabel, MenuItem, Select } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import DeckTabs from "./DeckTabs";
import DeckName from "./DeckName";
import styles from "./EditDeck.module.css";
import { Suspense, useEffect, useId, useState } from "react";
import { DeckStats, Simulator } from "../../../../../lib/simulator";
import { setDeckDisplayPreference } from "../../../../store/displayPreferencesSlice";
import { DeckDisplayType } from "../../../../../lib/deck-display-type.interface";

interface EditDeckProps {
  deckIndex: number;
}

export default function EditDeck({ deckIndex }: EditDeckProps) {
  const deck = useAppSelector((state) => state.decks.decks[deckIndex] );
  const { deckDisplay: displayType } = useAppSelector((state) => state.displayPreferences );
  const [deckStats, setDeckStats] = useState({} as DeckStats);
  const displayTypeLabelId = useId();
  const displayTypeId = useId();
  const dispatch = useAppDispatch()
  function setDisplayType(t: DeckDisplayType) {
    dispatch(setDeckDisplayPreference(t));
  }

  useEffect(() => {
    if (!!deckStats.handFrequency) {
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
      <FormControl>
        <FormLabel id={displayTypeLabelId}>Display Type</FormLabel>
        <Select
          labelId={displayTypeLabelId}
          id={displayTypeId}
          name="displayType"
          value={displayType}
          onChange={(e) => setDisplayType(e.target.value as DeckDisplayType)}
        >
          <MenuItem value={DeckDisplayType.List}>List</MenuItem>
          <MenuItem value={DeckDisplayType.Card}>Cards</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", flexWrap: "inherit" }}>
        <Suspense fallback="Loading...">
          <DeckTabs deck={deck} displayType={displayType} />
        </Suspense>
        <Box sx={{ width: "50%", marginLeft: "1rem" }}>
          { deckStats.handFrequency && (<Box>
            <h4>10,000 Run Simulation Results</h4>
            <p>Mulligan Rate: ~{(deckStats.mulliganPercentage * 100).toFixed(2)}%</p>
            <p>Max Mulligans: {deckStats.maxMulligansInAGame}</p>
            <p>Avg. Mulligans per Game: {deckStats.averageMulligans}</p>
            <Box>
              <BarChart
                width={500}
                height={300}
                series={[
                  { data: Array.from(deckStats.handFrequency.values()).map((f) => +(f*100).toFixed(2)), label: "% of opening hands with 1" }
                ]}
                xAxis={[
                  { data: Array.from(deckStats.handFrequency.keys()), scaleType: "band", tickLabelInterval: () =>  false }
                ]}
              />
            </Box>
          </Box>)}
          <PieChart
            height={500}
            width={500}
            skipAnimation={true}
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
    </Box>
  )
}