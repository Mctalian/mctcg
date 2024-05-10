import { useEffect, useState } from "react"
import { BarChart } from "@mui/x-charts"
import { Box, CircularProgress } from "@mui/material"
import { countCards } from "@mctcg/lib/deck-utils"
import { DeckStats, Simulator } from "@mctcg/lib/simulator"
import { useAppSelector } from "@mctcg/store/hooks"

export default function DeckStatistics() {
  const [loadingDeckStats, setLoadingDeckStats] = useState(true);
  const [deckStats, setDeckStats] = useState({} as DeckStats);
  const deck = useAppSelector((state) => state.decks.decks[state.decks.selectedDeckIndex] );
  useEffect(() => {
    setLoadingDeckStats(true);
    if (countCards(deck) !== 60) {
      setDeckStats({} as DeckStats)
      setLoadingDeckStats(false);
      return;
    }
    const simulator = new Simulator(deck);
    simulator.run();
    setDeckStats({
      ...simulator
    });
    setLoadingDeckStats(false);
  }, [deck])

  if (loadingDeckStats) {
    return <Box sx={{ minWidth: "360px", minHeight: "300px"}}>
      <CircularProgress />
    </Box>
  }

  if (!deckStats?.handFrequency) {
    return <Box sx={{ minWidth: "360px", minHeight: "300px"}}>
      <span>Deck Stats Unavailable: { countCards(deck) !== 60 ? "Deck must have exactly 60 cards" : "There was an issue :(" }</span>
    </Box>
  }
  return (
    <Box sx={{ minWidth: "360px", minHeight: "300px"}}>
      <h4>10,000 Run Simulation Results</h4>
      <p>Mulligan Rate: ~{(deckStats.mulliganPercentage * 100).toFixed(2)}%</p>
      <p>Max Mulligans: {deckStats.maxMulligansInAGame}</p>
      <p>Avg. Mulligans per Game: {deckStats.averageMulligans}</p>
      <Box>
        <BarChart
          width={360}
          height={300}
          series={[
            { data: Array.from(deckStats.handFrequency.values()).map((f) => +(f*100).toFixed(2)), color: "green", label: "% of opening hands with 1" }
          ]}
          xAxis={[
            { data: Array.from(deckStats.handFrequency.keys()), scaleType: "band", tickLabelInterval: () =>  false }
          ]}
        />
      </Box>
      <Box>
        <BarChart
          width={360}
          height={300}
          series={[
            { data: Array.from(deckStats.prizeFrequency.values()).map((f) => +(f*100).toFixed(2)), color: "red", label: "% of time prized" }
          ]}
          xAxis={[
            { data: Array.from(deckStats.prizeFrequency.keys()), scaleType: "band", tickLabelInterval: () =>  false }
          ]}
        />
      </Box>
    </Box>
  )
}
