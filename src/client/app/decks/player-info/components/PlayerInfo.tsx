"use client"

import { Box, Button, FormControl, FormLabel, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { sendGAEvent } from "@next/third-parties/google";
import { format, isValid } from "date-fns";
import { useId } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setPlayerDob, setPlayerId, setPlayerName } from "../../../store/playerInfoSlice";

export default function PdfPrepForm() {
  const playerNameId = useId();
  const playerIdId = useId();
  const playerDobId = useId();

  const loading = useAppSelector((state) => state.loading.value);
  const { playerName, playerId, playerDob } = useAppSelector((state) => state.playerInfo);
  const dispatch = useAppDispatch();

  return (
    <Box
      component={"form"}
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
        value={playerName}
        onChange={(e) => dispatch(setPlayerName(e.target.value))}
      />
     
      <TextField
        id={playerIdId}
        name="playerId"
        label="Player ID"
        variant="filled"
        required
        fullWidth
        value={playerId}
        onChange={(e) => dispatch(setPlayerId(e.target.value))}
      />

      <FormControl 
       id={playerDobId}
        required>
        <FormLabel>Player Date of Birth</FormLabel>
        <DatePicker
          name="playerDob"
          disableFuture
          value={new Date(playerDob)}
          onChange={(e) => isValid(e) && dispatch(setPlayerDob(format(e, "MM/dd/yyyy")))}
        />
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        onClick={() => sendGAEvent({ event: "buttonClicked", value: "submitPlayerInfo"})}
        href="/decks"
      >
        Submit
      </Button>
    </Box>
  )
}
