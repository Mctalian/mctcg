"use client"

import { useId } from 'react';
import { sendGAEvent } from '@next/third-parties/google';
import { Box, Button, TextField } from '@mui/material';
import styles from './DeckImportForm.module.css';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setLoading } from '../../../store/loadingSlice';
import { initialDeckState, setDeckName } from '../../../store/deckSlice';
import { useRouter } from 'next/navigation';
import { SortType } from '../../../../lib/sort-type.enum';
import { addDeck } from '../../../store/decksSlice';

interface DeckFormFieldValue {
  value: string
}

interface DeckFormFields extends EventTarget {
  deckName: DeckFormFieldValue;
  decklist: DeckFormFieldValue;
}

export default function DeckImportForm() {
  const deckNameId = useId();
  const deckListId = useId();

  const loading = useAppSelector((state) => state.loading.value);
  const { name: deckName } = useAppSelector((state) => state.deck || initialDeckState);
  const { preferredSort: sortType } = useAppSelector((state) => state.playerInfo)
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch(setLoading(true));
    sendGAEvent({ event: "buttonClicked", value: "decklistImport"})
    const target = e.target as DeckFormFields;
    const decklist = target.decklist.value;
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
      dispatch(addDeck({
        name: deckName,
        deck,
        sortType: sortType || SortType.SetChronological
      }));
      dispatch(setDeckName(initialDeckState.name));
      router.push('/decks');
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
          onChange={(e) => dispatch(setDeckName(e.target.value))}
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