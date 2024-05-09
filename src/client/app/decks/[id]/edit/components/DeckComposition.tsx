import { PieChart } from "@mui/x-charts/PieChart";
import { countCards, countSection, countSectionSubtype } from "@mctcg/lib/deck-utils";
import { HighlightScope } from "@mui/x-charts";
import { useAppSelector } from "@mctcg/store/hooks";
import { useEffect, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";

export default function DeckComposition() {
  const [totalCards, setTotalCards] = useState(0);
  const [innerPieData, setInnerPieData] = useState([]);
  const [outerPieData, setOuterPieData] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const deck = useAppSelector((state) => state.decks.decks[state.decks.selectedDeckIndex]);

  useEffect(() => {
    if (deck?.deck) {
      setTotalCards(countCards(deck))
      setInnerPieData([
        { value: countSection(deck.deck.Pokemon), label: "Pokémon", color: "green",},
        { value: countSection(deck.deck.Trainer), label: "Trainers", color: "orange", },
        { value: countSection(deck.deck.Energy), label: "Energy", color: "blue" },
      ])
    }
  },[deck])

  if (!deck) {
    return <p>Loading...</p>
  }
  return (
    <>
      <p>Total cards: {totalCards}</p>
      <PieChart
        height={500}
        width={360}
        skipAnimation={true}
        slotProps={{
          legend: {
            direction: "row",
            position: {
              horizontal: "middle",
              vertical: "top",
            },
            labelStyle: {
              fontSize: isMobile ? "0.8rem" : "1rem"
            }
          }
        }}
        series={[
          {
            arcLabel: (item) => `${item.value}`,
            innerRadius: 0,
            outerRadius: 80,
            data: innerPieData,
            highlighted: { additionalRadius: 20 },
            highlightScope: {
              highlighted: "item",
              faded: "global",
            } as HighlightScope,
          },
          {
            arcLabel: (item) => `${item.value}`,
            innerRadius: 100,
            outerRadius: 120,
            data: [
              { value: countSectionSubtype(deck.deck.Pokemon, "Basic"), label: "Basic", color: "#339933"},
              { value: countSectionSubtype(deck.deck.Pokemon, "Stage 1"), label: "Stage 1", color: "#80c080"},
              { value: countSectionSubtype(deck.deck.Pokemon, "Stage 2"), label: "Stage 2", color: "#003300"},
              { value: countSectionSubtype(deck.deck.Pokemon, "VSTAR"), label: "VSTAR", color: "#001a00"},
              { value: countSectionSubtype(deck.deck.Trainer, "Supporter"), label: "Supporters", color: "#332100"},
              { value: countSectionSubtype(deck.deck.Trainer, "Item"), label: "Items", color: "#996300"},
              { value: countSectionSubtype(deck.deck.Trainer, "Stadium"), label: "Stadiums", color: "#ffc04d"},
              { value: countSectionSubtype(deck.deck.Trainer, "Pokémon Tool"), label: "Tools", color: "#ffa500"},
              { value: countSectionSubtype(deck.deck.Energy, "Basic"), label: "Basic", color: "#000080" },
              { value: countSectionSubtype(deck.deck.Energy, "Special"), label: "Special", color: "#3333ff" },
            ],
            highlighted: { innerRadius: 90, additionalRadius: 10 },
            highlightScope: {
              highlighted: "item",
              faded: "global",
            } as HighlightScope,
          }
        ]}
      />
    </>
  )
}