import { useId } from 'react';
import styles from './DeckImportForm.module.css';
import { Box, Button, FormControl, FormLabel, MenuItem, Select, TextField } from '@mui/material';

export default function DeckImportForm({ importFormAction, setDeckName, deckName }) {
  const deckNameId = useId();
  const deckListId = useId();
  const sortLabelId = useId();
  const sortId = useId();
  return (
    <>
      <div className={styles.description}>
        <p>
          Begin by pasting your decklist below. Decklists can be generated from Pokemon TCG Live.
        </p>
      </div>
      <Box
        component={"form"}
        action={importFormAction}
        display="flex"
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
          onChange={(e) => setDeckName(e.target.value)}
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

        <Button className={styles.formButton} type="submit" variant="contained" fullWidth>
          Import
        </Button>
      </Box>
    </>
  )
}