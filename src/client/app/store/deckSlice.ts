import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Deck } from "../../lib/deck.interface";
import { SortType } from "../../lib/sort-type.enum";

type DeckState = Deck;

const initialState: DeckState = {
  name: `Deck ${crypto.randomUUID()}`,
  deck: null,
  sortType: SortType.Alphabetical,
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
