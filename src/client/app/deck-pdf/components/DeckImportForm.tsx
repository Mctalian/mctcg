"use client"

import { useId } from 'react';
import { sendGAEvent } from '@next/third-parties/google';
import { Box, Button, FormControl, FormLabel, MenuItem, Select, TextField } from '@mui/material';
import styles from './DeckImportForm.module.css';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setLoading } from '../../store/loadingSlice';
import { setDeck } from '../../store/deckSlice';
import { useRouter } from 'next/navigation';

interface DeckFormFieldValue {
  value: string
}

interface DeckFormFields extends EventTarget {
  deckName: DeckFormFieldValue;
  decklist: DeckFormFieldValue;
  sortType: DeckFormFieldValue;
}

export default function DeckImportForm({ deckName }) {
  const deckNameId = useId();
  const deckListId = useId();
  const sortLabelId = useId();
  const sortId = useId();

  const loading = useAppSelector((state) => state.loading.value);
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch(setLoading(true));
    sendGAEvent({ event: "buttonClicked", value: "decklistImport"})
    const target = e.target as DeckFormFields;
    const decklist = target.decklist.value;
    const sortType = target.sortType.value;
    const response = await fetch("/api/v1/decklist/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ decklist, sortType }),
    });
    if (response.status !== 200) {
      dispatch(setLoading(false));
      alert("Error importing decklist");
      return;
    } else {
      const deck = await response.json();
      dispatch(setDeck({
        deck: deck,
        name: deckName,
        sortType: sortType
      }));
      router.push('/deck-pdf/import-success');
    }
  }

  return (
    <>
      <div className={styles.description}>
        <p>
          Begin by pasting your decklist below. Decklists can be generated from Pokemon TCG Live.
        </p>
      </div>
      <Box
        component={"form"}
        display="flex"
        onSubmit={handleSubmit}
        flexDirection="column"
        gap={2}
        p={2}
        minWidth={400}
        width="50vw"
        maxWidth={800}
      >

        <TextField
          id={deckNameId}
          name="deckName"
          label="Deck Name"
          variant="filled"
          required
          fullWidth
          value={deckName}
        />
        

        <TextField
          id={deckListId}
          name="decklist"
          label="Decklist"
          multiline
          fullWidth
          rows={12}
          variant="filled"
          required
        />

        <FormControl required fullWidth>
          <FormLabel id={sortLabelId}>Sort By</FormLabel>
          <Select
            labelId={sortLabelId}
            id={sortId}
            name="sortType"
            defaultValue={"Alphabetical"}
          >
            <MenuItem value="Alphabetical">Alphabetical</MenuItem>
            <MenuItem value="SetAlphabetical">By Set (Alphabetical)</MenuItem>
            <MenuItem value="SetChronological">By Set (Release Date)</MenuItem>
            <MenuItem value="Quantity">By Quantity</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
        >
          Import
        </Button>
      </Box>
    </>
  )
}