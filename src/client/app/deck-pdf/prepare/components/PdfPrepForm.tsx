"use client"

import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Select, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { sendGAEvent } from "@next/third-parties/google";
import { isValid } from "date-fns";
import { useId } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setLoading } from "../../../store/loadingSlice";
import { setPdf } from "../../../store/pdfSlice";
import { useRouter } from "next/navigation";

interface PdfPrepFormFields extends EventTarget {
  playerName: HTMLInputElement;
  playerId: HTMLInputElement;
  playerDob: HTMLInputElement;
  format: HTMLInputElement;
}

export default function PdfPrepForm() {
  const playerNameId = useId();
  const playerIdId = useId();
  const playerDobId = useId();
  const formatId = useId();
  const formatLabelId = useId();

  const loading = useAppSelector((state) => state.loading.value);
  const { deck } = useAppSelector((state) => state.deck);
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(setLoading(true));
    const target = e.target as PdfPrepFormFields;
    const playerName = target.playerName.value;
    const playerId = target.playerId.value;
    const playerDob = target.playerDob.value;
    const format = target.format.value;
  
    if (!playerName || !playerId || !playerDob || !format || !deck) {
      return {
        blob: null,
        error: "Missing required fields",
      };
    }

    if (!isValid(new Date(playerDob))) {
      return {
        blob: null,
        error: "Invalid date of birth",
      };
    }

    const dto = {
      playerName,
      playerId,
      playerDob,
      format,
      ...deck,
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
      dispatch(setPdf({
        blob: null,
        error: await response.text(),
      }));
      router.push("/deck-pdf/error");
    } else {
      const blob = await response.blob();
      dispatch(setPdf({
        blob,
        error: null
      }));
      router.push("/deck-pdf/success");
    }
  }

  return (
    <Box
      component={"form"}
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
          id={formatId}
          aria-labelledby={formatLabelId}
          name="format"
          defaultValue={"standard"}
        >
          <FormControlLabel value="standard" control={<Radio />} label="Standard" />
          <FormControlLabel value="expanded" control={<Radio />} label="Expanded" />
        </RadioGroup>
      </FormControl>

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
