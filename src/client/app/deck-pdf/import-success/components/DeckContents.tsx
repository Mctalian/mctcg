"use client"

import { Box, Button, List } from "@mui/material";
import { sendGAEvent } from "@next/third-parties/google";
import { useRouter } from 'next/navigation'
import CardSection from "./CardSection";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setLoading } from "../../../store/loadingSlice";
import { addDeck } from "../../../store/decksSlice";
import DeckValidations from "./DeckValidations";

export default function DeckContents() {
  const router = useRouter();
  const deckObj = useAppSelector((state) => state.deck);
  const { deck, name: deckName } = deckObj;
  const dispatch = useAppDispatch();
  dispatch(addDeck(deckObj));
  dispatch(setLoading(false));

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
      <h2>{deckName} <Box sx={{ display: "inline", fontSize: "1rem"}}>{deck.format} Format</Box></h2>
      <DeckValidations validations={deck.errors} type="error" />
      <DeckValidations validations={deck.warnings} type="warning" />
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
          e.preventDefault();
          sendGAEvent({ event: "buttonClicked", value: "startPdfGenerate"})
          router.push('/deck-pdf/prepare');
        }}
        variant="contained"
      >Generate PDF</Button>
    </Box>
  )
}