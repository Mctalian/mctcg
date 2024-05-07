import { useEffect, useState } from "react"
import { BarChart } from "@mui/x-charts"
import { Box } from "@mui/material"
import { countCards } from "@mctcg/lib/deck-utils"
import { Deck } from "@mctcg/lib/deck.interface"
import { DeckStats, Simulator } from "@mctcg/lib/simulator"
import { useAppSelector } from "@mctcg/store/hooks"

export default function DeckStatistics() {
  const deck = useAppSelector((state) => state.decks.decks[state.decks.selectedDeckIndex] );
  const [deckStats, setDeckStats] = useState({} as DeckStats);
  useEffect(() => {
    if (countCards(deck) !== 60) {
      setDeckStats({} as DeckStats)
      return;
    }
    console.log("Running simulator");
    const simulator = new Simulator(deck);
    simulator.run();
    setDeckStats({
      ...simulator
    });
  }, [deck])

  if (!deckStats?.handFrequency) {
    return <span>Deck Stats Unavailable: { countCards(deck) !== 60 ? "Deck must have exactly 60 cards" : "There was an issue :(" }</span>
  }
  return (
    <Box>
      <h4>10,000 Run Simulation Results</h4>
      <p>Mulligan Rate: ~{(deckStats.mulliganPercentage * 100).toFixed(2)}%</p>
      <p>Max Mulligans: {deckStats.maxMulligansInAGame}</p>
      <p>Avg. Mulligans per Game: {deckStats.averageMulligans}</p>
      <Box>
        <BarChart
          width={400}
          height={300}
          series={[
            { data: Array.from(deckStats.handFrequency.values()).map((f) => +(f*100).toFixed(2)), label: "% of opening hands with 1" }
          ]}
          xAxis={[
            { data: Array.from(deckStats.handFrequency.keys()), scaleType: "band", tickLabelInterval: () =>  false }
          ]}
        />
      </Box>
    </Box>
  )
}
