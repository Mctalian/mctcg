"use client"

import { Box, Fab, Tooltip } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@mctcg/store/hooks";
import DeckDisplayPreferences from "./DeckDisplayPreferences";
import DeckName from "./DeckName";
import DeckTabs from "./DeckTabs";
import styles from "./EditDeck.module.css";
import DeckStatsTabs from "./DeckStatsTabs";
import { selectCard, selectDeck } from "@mctcg/store/decksSlice";
import { useEffect, useState } from "react";
import { Add } from "@mui/icons-material";
import AddCardDialog from "./AddCardDialog";
import CardDialog from "./CardDialog";

interface EditDeckProps {
  deckIndex: number;
}

export default function EditDeck({ deckIndex }: EditDeckProps) {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openCardDialog, setOpenCardDialog] = useState(false);
  const { deckDisplay: displayType } = useAppSelector((state) => state.displayPreferences );
  const selectedCard = useAppSelector((state) => state.decks.selectedCard);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(selectDeck(deckIndex));
  }, [deckIndex])

  useEffect(() => {
    if (!selectedCard) {
      setOpenCardDialog(false);
    } else {
      setOpenCardDialog(true);
    }
  }, [selectedCard])

  function handleCloseAddDialog() {
    setOpenAddDialog(false);
  }

  function handleCloseCardDialog() {
    setOpenCardDialog(false);
    dispatch(selectCard(null));
  }

  function addNewCard() {
    setOpenAddDialog(true);
  }

  return (
    <>
      <Box className={styles.deck}>
        <DeckName />
        <DeckDisplayPreferences />
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", flexWrap: "inherit" }}>
          <DeckTabs displayType={displayType} addNewCard={addNewCard} />
          <DeckStatsTabs />
        </Box>
        <Tooltip title="Add a card">
          <Fab className={styles.addFab} aria-label="add a card" color="success" onClick={addNewCard}>
            <Add/>
          </Fab>
        </Tooltip>
      </Box>
      <AddCardDialog open={openAddDialog} handleClose={handleCloseAddDialog} />
      <CardDialog open={openCardDialog} handleClose={handleCloseCardDialog} />
    </>
  )
}