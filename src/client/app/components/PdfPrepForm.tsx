import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Select, TextField } from "@mui/material";
import styles from "./PdfPrepForm.module.css";
import { useId } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setLoading } from "../store/loadingSlice";
import { sendGAEvent } from "@next/third-parties/google";

export default function PdfPrepForm({ deck, generateFormAction }) {
  const playerNameId = useId();
  const playerIdId = useId();
  const playerDobId = useId();
  const formatId = useId();
  const formatLabelId = useId();

  const loading = useAppSelector((state) => state.loading.value);
  const dispatch = useAppDispatch();

  function handleSubmit(e) {
    dispatch(setLoading(true));
  }

  return (
    <Box
      component={"form"}
      action={generateFormAction}
      onSubmit={handleSubmit}
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
          defaultValue={"standard"}
        >
          <FormControlLabel value="standard" control={<Radio />} label="Standard" />
          <FormControlLabel value="expanded" control={<Radio />} label="Expanded" />
        </RadioGroup>
      </FormControl>

      <input className={styles.deckInput} type="hidden" name="deck" value={JSON.stringify(deck)}/>

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        onClick={() => sendGAEvent({ event: "buttonClicked", value: "generatePdf"})}
      >
        Generate PDF
      </Button>
    </Box>
  )
}
