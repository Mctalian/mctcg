import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DeckDisplayType } from "../../lib/deck-display-type.interface";


interface DisplayPreferencesState {
  deckDisplay: DeckDisplayType
}

const initialState: DisplayPreferencesState = {
  deckDisplay: DeckDisplayType.List
};

export const displayPreferencesSlice = createSlice({
  name: 'displayPreferences',
  initialState,
  reducers: {
    setDeckDisplayPreference: (state, action: PayloadAction<DeckDisplayType>) => {
      state.deckDisplay = action.payload;
    }
  }
});

export const initialDisplayPreferencesState = initialState;

export const { setDeckDisplayPreference } = displayPreferencesSlice.actions;

export default displayPreferencesSlice.reducer;
