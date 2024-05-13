"use client";

import { Check, Edit, Close, FileDownload, Delete } from "@mui/icons-material";
import { Tooltip, IconButton, Box, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@mctcg/store/hooks";
import { removeDeck, renameDeck } from "@mctcg/store/decksSlice";
import { useRouter } from "next/navigation";
import { setLoading } from "@mctcg/store/loadingSlice";

export default function DeckName() {
  const deck = useAppSelector((state) => state.decks.decks[state.decks.selectedDeckIndex] );
  const { playerName, playerId, playerDob, preferredSort } = useAppSelector((state) => state.playerInfo );
  const [editing, setEditMode] = useState(false);
  const [deckName, setDeckName] = useState("");
  useEffect(() => {
    if (deck) {
      setDeckName(deck.name)
    }
  }, [deck])

  const dispatch = useAppDispatch();
  const router = useRouter();

  async function generatePdf(e, deck) {
    e.preventDefault();

    if (playerName && playerId && playerDob) {
      const dto = {
        ...deck,
        playerName,
        playerId,
        playerDob,
        sortType: preferredSort
      };
      const response = await fetch("/api/v1/deck/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      });
      if (response.status !== 200) {
        console.error(response.statusText);
      } else {
        const blob = await response.blob();
        // Create blob link to download
        const url = window.URL.createObjectURL(
          new Blob([blob]),
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `decklist.pdf`,
        );

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
      }
    } else {
      const router = useRouter();
      router.push("/decks/player-info");
    }
    dispatch(setLoading(false));
  }

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
          <Tooltip title="Generate PDF">
            <IconButton aria-label="generate pdf" onClick={(e) => generatePdf(e, deck.deck)}>
              <FileDownload/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Deck">
            <IconButton aria-label="delete deck" onClick={(e) => {
              dispatch(removeDeck(deck.name))
              router.push("/decks");
            }}>
              <Delete/>
            </IconButton>
          </Tooltip>
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