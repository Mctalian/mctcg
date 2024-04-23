"use client"

import { Box, Button, List } from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import { sendGAEvent } from "@next/third-parties/google";
import { useRouter } from 'next/navigation'
import CardSection from "./CardSection";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setLoading } from "../../../store/loadingSlice";
import styles from "./DeckContents.module.css"

export default function DeckContents() {
  const router = useRouter();
  const { deck, name: deckName } = useAppSelector((state) => state.deck);
  const dispatch = useAppDispatch();
  dispatch(setLoading(false));

  function deckErrors() {
    if (deck.errors?.length) {
      return (
        <Box
          sx={{
            border: "2px solid red",
            backgroundColor: "rgba(255,0,0,0.1)"
          }}
        >
          <h3><ErrorIcon sx={{ verticalAlign: "middle", margin: "0 0 3px" }} color="error" /> Your deck has errors:</h3>
          <ul>
            {deck.errors.map((error) => <li className={styles.validationsList}>{error}</li>)}
          </ul>
        </Box>
      )
    }
    return <></>
  }

  function deckWarnings() {
    if (deck.warnings?.length) {
      return (
        <Box
          sx={{
            border: "2px solid #ffa726",
            backgroundColor: "rgba(255,167,38,0.1)"
          }}
        >
          <h3><WarningIcon sx={{ verticalAlign: "middle", margin: "0 0 3px" }} color="warning" />Your deck has warnings:</h3>
          <ul>
            {deck.warnings.map((warning) => <li className={styles.validationsList}>{warning}</li>)}
          </ul>
        </Box>
      )
    }
    return <></>
  }

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
      {deckErrors()}
      {deckWarnings()}
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