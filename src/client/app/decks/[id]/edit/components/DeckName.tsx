import { Check, Edit, X } from "@mui/icons-material";
import { Tooltip, IconButton, Box, TextField } from "@mui/material";
import { useState } from "react";
import { useAppDispatch } from "../../../../store/hooks";
import { renameDeck } from "../../../../store/decksSlice";

export default function DeckName({ deck, deckIndex }) {
  const [editing, setEditMode] = useState(false);
  const [deckName, setDeckName] = useState(deck.name);

  const dispatch = useAppDispatch();

  function edit() {
    setDeckName(deck.name);
    setEditMode(true);
  }

  function rename() {
    dispatch(renameDeck({ deckIndex, newName: deckName }));
    setEditMode(false);
  }

  function cancel() {
    setDeckName(deck.name);
    setEditMode(false)
  }

  return (
    <>
      {!editing && <h1>{deck.name} <Tooltip title="Rename Deck">
        <IconButton aria-label="rename deck" onClick={edit}>
          <Edit />
        </IconButton>
      </Tooltip></h1>}
      {editing && <Box sx={{ display: "flex", flexDirection: "row" }}>
        <TextField sx={{ width: "30rem" }} defaultValue={deck.name} value={deckName} onChange={(e) => setDeckName(e.target.value)}/> <Tooltip title="Submit Deck Name">
          <IconButton aria-label="submit deck rename" onClick={rename}>
            <Check />
          </IconButton>
        </Tooltip> <Tooltip title="Cancel">
          <IconButton aria-label="cancel deck rename" onClick={cancel}>
            <X />
          </IconButton>
        </Tooltip>
      </Box>}
    </>
  )
}