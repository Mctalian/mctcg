import { Close, Search } from "@mui/icons-material";
import { AppBar, Box, Button, Dialog, DialogTitle, IconButton, LinearProgress, TextField, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import DisplayCardMode from "./DisplayCardMode";
import { useAppDispatch, useAppSelector } from "@mctcg/store/hooks";
import { addCardToDeck } from "@mctcg/store/decksSlice";
import { Card } from "@mctcg/lib/card.interface";
import { createSelector } from "@reduxjs/toolkit";

interface AddCardDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function AddCardDialog({ open, handleClose}: AddCardDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const decksSelector = useAppSelector((state) => state.decks);
  const selectedDeckIndex = decks => decks.selectedDeckIndex;
  const decks = decks => decks.decks
  const cardIds = createSelector([decks, selectedDeckIndex], (decks, index) => {
    const deck = decks[index].deck
    return deck.Pokemon.concat(deck.Trainer, deck.Energy).map((c) => c.id);
  })
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      return;
    }
    setSearchLoading(true);
    const dto = {
      nameQuery: searchTerm
    };
    fetch("/api/v1/cards/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    }).then((response) => {
      if (response.status !== 200) {
        return []
      } else {
        return response.json()
      }
    }).then(payload => {
      const cardsToDisplay = payload.cards.filter(c => !cardIds(decksSelector).includes(c.id))
      setSearchResults(cardsToDisplay);
    });
  }, [searchTerm])

  useEffect(() => {
    setSearchLoading(false);
  }, [searchResults]);

  function handleClick(c: Card) {
    dispatch(addCardToDeck(c))
    handleClose()
    setSearchTerm("")
  }

  function displayResults() {
    if (searchTerm.trim().length === 0) {
      return <span>Search for a card to add to your deck</span>;
    }
    if (searchTerm.trim().length > 0 && searchResults.length === 0) {
      return <span>No results found</span>
    }
    return <DisplayCardMode list={searchResults} handleClick={handleClick} disableHover={true} sizeCoefficient={3}/>
  }

  function dialogContents() {
    return (
      <>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <Close />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Add a card to your deck
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ padding: "1rem 1.5rem"}}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <Search sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField id="search" label="Search" variant="standard" fullWidth onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm}/>
          </Box>
          { searchLoading ? <LinearProgress sx={{ margin: "0.25rem 0"}}/> : <Box sx={{ padding: "calc(0.25rem + 2px) 0" }} /> }
          <Box sx={{ padding: "1rem 0"}}>
            {displayResults()}
          </Box>
        </Box>
      </>
    )
  }

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
    >
      {dialogContents()}
    </Dialog>
  )
}
