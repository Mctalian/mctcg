import { useEffect, useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { AppBar, Box, Dialog, FormControlLabel, FormGroup, IconButton, LinearProgress, Switch, TextField, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Close, Search } from "@mui/icons-material";

import { useAppDispatch, useAppSelector } from "@mctcg/store/hooks";
import { addCardToDeck } from "@mctcg/store/decksSlice";
import { Card } from "@mctcg/lib/card.interface";
import { useDebounce } from "@mctcg/lib/debounce.hook";
import DisplayCardMode from "./DisplayCardMode";

interface CardSearchDto {
  nameQuery?: string;
  formatQuery?: "Standard" | "Expanded" | "Unlimited"
}

interface AddCardDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function AddCardDialog({ open, handleClose}: AddCardDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [rawSearchTerm, setRawSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [standardFormatOnly, setStandardFormatOnly] = useState(true);
  const decksSelector = useAppSelector((state) => state.decks);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
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
    const dto: CardSearchDto = {
      nameQuery: searchTerm
    };
    if (standardFormatOnly) {
      dto.formatQuery = "Standard"
    }
    const cachedResponse = makeCardRequest(dto)
    cachedResponse.then((cachedResults) => {
      setSearchResults(cachedResults ?? []);
      makeCardRequest(dto, false).then((apiResults) => {
        if (apiResults.length > cachedResults.length) {
          setSearchResults(apiResults);
        }
        return;
      })
    }).finally(() => {
      setSearchLoading(false);
    })
  }, [searchTerm, standardFormatOnly])

  function onChange() {
    setSearchTerm(rawSearchTerm)
  }

  const debouncedOnChange = useDebounce(onChange);

  function close() {
    setSearchTerm("")
    setRawSearchTerm("")
    setSearchResults([])
    handleClose()
  }

  function handleClick(c: Card) {
    dispatch(addCardToDeck(c))
    close();
  }

  function displayResults() {
    if (searchTerm.trim().length === 0) {
      return <span>Search for a card to add to your deck</span>;
    }
    if (searchTerm.trim().length > 0 && searchResults.length === 0) {
      return <span>No results found</span>
    }
    const sizeCoefficient = isMobile ? 2 : 3;
    return <DisplayCardMode list={searchResults} handleClick={handleClick} disableHover={true} sizeCoefficient={sizeCoefficient}/>
  }

  function makeCardRequest(dto, cachedResultsOnly = true) {
    return fetch("/api/v1/cards/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...dto, cachedResultsOnly }),
    }).then((response) => {
      if (response.status !== 200) {
        return []
      } else {
        return response.json()
      }
    }).then(payload => {
      return payload.cards?.filter(c => !cardIds(decksSelector).includes(c.id)) ?? []
    });
  }

  function dialogContents() {
    return (
      <>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={close}
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
            <TextField id="search" label="Search by card name" variant="standard" fullWidth onChange={(e) => {
              debouncedOnChange();
              setRawSearchTerm(e.target.value);
            }} value={rawSearchTerm}/>
            <FormGroup sx={{ minWidth: "9rem"}}>
              <FormControlLabel
                control={
                  <Switch
                    checked={standardFormatOnly}
                    onChange={(e) => setStandardFormatOnly(e.target.checked)}/>}
                label="Standard Only?"
                labelPlacement="top"
              />
            </FormGroup>
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
      onClose={close}
    >
      {dialogContents()}
    </Dialog>
  )
}
