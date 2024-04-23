import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PlayerInfoState {
  playerName: string;
  playerId: string;
  playerDob: string;
}

const initialState: PlayerInfoState = {
  playerName: "",
  playerId: "",
  playerDob: "",
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
    }
  }
});

export const initialPlayerInfoState = initialState;

export const { setPlayerName, setPlayerId, setPlayerDob } = playerInfoSlice.actions;

export default playerInfoSlice.reducer;

