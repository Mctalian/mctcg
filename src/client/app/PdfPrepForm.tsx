import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Select, TextField } from "@mui/material";
import styles from "./PdfPrepForm.module.css";
import { useId } from "react";
import { DatePicker } from "@mui/x-date-pickers";

export default function PdfPrepForm({ deck, generateFormAction }) {
  const playerNameId = useId();
  const playerIdId = useId();
  const playerDobId = useId();
  const formatId = useId();
  const formatLabelId = useId();
  return (
    <Box
      component={"form"}
      action={generateFormAction}
      display="flex"
      flexDirection="column"
      gap={2}
      p={2}
      minWidth={400}
      width="50vw"
      maxWidth={800}
    >
      <TextField
        id={playerNameId}
        name="playerName"
        label="Player Name"
        variant="filled"
        required
        fullWidth
      />
     
      <TextField
        id={playerIdId}
        name="playerId"
        label="Player ID"
        variant="filled"
        required
        fullWidth
      />

      <FormControl 
       id={playerDobId}
        required>
        <FormLabel>Player Date of Birth</FormLabel>
        <DatePicker
          name="playerDob"
          disableFuture
        />
      </FormControl>

      <FormControl required>
        <FormLabel id={formatLabelId}>Format</FormLabel>
        <RadioGroup
          aria-labelledby={formatLabelId}
          name="format"
        >
          <FormControlLabel value="standard" control={<Radio />} label="Standard" />
          <FormControlLabel value="expanded" control={<Radio />} label="Expanded" />
        </RadioGroup>
      </FormControl>

      <input className={styles.deckInput} type="hidden" name="deck" value={JSON.stringify(deck)}/>

      <Button type="submit" variant="contained">
        Generate PDF
      </Button>
    </Box>
  )
}