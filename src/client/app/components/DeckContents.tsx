import { Box, Button, List } from "@mui/material";
import CardSection from "./CardSection";
import { sendGAEvent } from "@next/third-parties/google";

export default function DeckContents({ deck, deckName, setStartPdfFlow }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      p={2}
      minWidth={400}
      width="50vw"
      maxWidth={800}
    >
      <h2>{deckName}</h2>
      <List
        sx={{
          maxHeight: "50vh",
          overflow: "auto",
          position: 'relative',
        }}
        subheader={<li />}
      >
        <CardSection name="Pokémon" cards={deck.Pokemon} />
        <CardSection name="Trainers" cards={deck.Trainer} />
        <CardSection name="Energy" cards={deck.Energy} />
      </List>
      <Button
        onClick={(e) => {
          setStartPdfFlow(true);
          sendGAEvent({ event: "buttonClicked", value: "startPdfGenerate"})
        }}
        variant="contained"
      >Generate PDF</Button>
    </Box>
  )
}