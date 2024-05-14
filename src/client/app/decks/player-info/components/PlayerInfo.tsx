"use client"

import { Box, Button, FormControl, FormLabel, MenuItem, Select, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { sendGAEvent } from "@next/third-parties/google";
import { format, isValid } from "date-fns";
import { useId } from "react";
import { useAppDispatch, useAppSelector } from "@mctcg/store/hooks";
import { initialPlayerInfoState, setPlayerDob, setPlayerId, setPlayerName, setPreferredSortType } from "@mctcg/store/playerInfoSlice";
import { SortType } from "@mctcg/lib/sort-type.enum";
import { useRouter } from "next/navigation";

export default function PdfPrepForm() {
  const playerNameId = useId();
  const playerIdId = useId();
  const playerDobId = useId();
  const sortLabelId = useId();
  const sortId = useId();

  const loading = useAppSelector((state) => state.loading.value);
  const { playerName, playerId, playerDob, preferredSort } = useAppSelector((state) => state.playerInfo);
  const dispatch = useAppDispatch();
  const router = useRouter();

  function submitPlayerInfo(e) {
    e.preventDefault();
    sendGAEvent({ event: "buttonClicked", value: "submitPlayerInfo"});
    router.back();
  }

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

      <FormControl required fullWidth>
        <FormLabel id={sortLabelId}>Preferred Sort Method</FormLabel>
        <Select
          labelId={sortLabelId}
          id={sortId}
          name="sortType"
          defaultValue={preferredSort || initialPlayerInfoState.preferredSort}
          onChange={(e) => dispatch(setPreferredSortType(e.target.value as SortType))}
        >
          <MenuItem value={SortType.Alphabetical}>Alphabetical</MenuItem>
          <MenuItem value={SortType.SetAlphabetical}>By Set (Alphabetical)</MenuItem>
          <MenuItem value={SortType.SetChronological}>By Set (Release Date)</MenuItem>
          <MenuItem value={SortType.Quantity}>By Quantity</MenuItem>
        </Select>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        onClick={submitPlayerInfo}
      >
        Submit
      </Button>
    </Box>
  )
}
