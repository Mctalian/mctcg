import { Check, Edit, Close, FileDownload } from "@mui/icons-material";
import { Tooltip, IconButton, Box, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { renameDeck } from "../../../../store/decksSlice";

export default function DeckName() {
  const deck = useAppSelector((state) => state.decks.decks[state.decks.selectedDeckIndex] );
  const [editing, setEditMode] = useState(false);
  const [deckName, setDeckName] = useState("");
  useEffect(() => {
    if (deck) {
      setDeckName(deck.name)
    }
  }, [deck])

  const dispatch = useAppDispatch();

  function edit() {
    setDeckName(deck.name);
    setEditMode(true);
  }

  function rename() {
    dispatch(renameDeck(deckName));
    setEditMode(false);
  }

  function cancel() {
    setDeckName(deck.name);
    setEditMode(false)
  }

  function deckTitle() {
    if (editing) {
      return (
        <>
          <TextField sx={{ width: "30rem" }} value={deckName} onChange={(e) => setDeckName(e.target.value)}/> <Tooltip title="Submit Deck Name">
            <IconButton aria-label="submit deck rename" onClick={rename}>
              <Check />
            </IconButton>
          </Tooltip> <Tooltip title="Cancel">
            <IconButton aria-label="cancel deck rename" onClick={cancel}>
              <Close />
            </IconButton>
          </Tooltip>
        </>
      )
    } else {
      return (
        <>
          <Typography variant="h5" lineHeight={"40px"}>
            {deckName}
          </Typography>
          <Tooltip title="Rename Deck">
            <IconButton aria-label="rename deck" onClick={edit}>
              <Edit />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="Generate PDF">
            <IconButton aria-label="generate pdf" onClick={(e) => alert("Coming soon")}>
              <FileDownload/>
            </IconButton>
          </Tooltip> */}
        </>
      )
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "row", marginTop: "0.5rem"}}>
      {deckTitle()}
    </Box>
  )
}