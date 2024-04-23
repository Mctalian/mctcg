import { createSlice, PayloadAction } from "@reduxjs/toolkit";

enum Singularity {
  None = "None",
  "ACE SPEC" = "ACE SPEC",
  Radiant = "Radiant",
}

interface Card {
  quantity: number;
  name: string;
  setAbbr: string;
  setNumber: string;
  regCode?: string;
  errors?: string[];
}

interface DeckState {
  name: string;
  deck: {
    Pokemon: Card[];
    Trainer: Card[];
    Energy: Card[];
    errors?: string[];
    warnings?: string[];
    format?: "Standard" | "Expanded" | "Unlimited"
  },
  sortType: string;
}

const initialState: DeckState = {
  name: `Deck ${crypto.randomUUID()}`,
  deck: null,
  sortType: ""
};

export const deckSlice = createSlice({
  name: 'deck',
  initialState,
  reducers: {
    setDeck: (state, action: PayloadAction<DeckState>) => {
      state.deck = action.payload.deck;
      state.name = action.payload.name;
      state.sortType = action.payload.sortType;
    },
    setDeckName: (state, action: PayloadAction<string>) => {
      state.name = action.payload
    }
  }
});

export const initialDeckState = initialState;

export const { setDeck, setDeckName } = deckSlice.actions;

export default deckSlice.reducer;
