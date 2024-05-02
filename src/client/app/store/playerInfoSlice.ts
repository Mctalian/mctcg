import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SortType } from "../../lib/sort-type.enum";

interface PlayerInfoState {
  playerName: string;
  playerId: string;
  playerDob: string;
  preferredSort: SortType;
}

const initialState: PlayerInfoState = {
  playerName: "",
  playerId: "",
  playerDob: "",
  preferredSort: SortType.SetChronological,
}

export const playerInfoSlice = createSlice({
  name: "playerInfo",
  initialState,
  reducers: {
    setPlayerName: (state, action: PayloadAction<string>) => {
      state.playerName = action.payload;
    },
    setPlayerId: (state, action: PayloadAction<string>) => {
      state.playerId = action.payload;
    },
    setPlayerDob: (state, action: PayloadAction<string>) => {
      state.playerDob = action.payload;
    },
    setPreferredSortType: (state, action: PayloadAction<SortType>) => {
      state.preferredSort = action.payload;
    }
  }
});

export const initialPlayerInfoState = initialState;

export const { setPlayerName, setPlayerId, setPlayerDob, setPreferredSortType } = playerInfoSlice.actions;

export default playerInfoSlice.reducer;

