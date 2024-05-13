import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Deck } from "../../lib/deck.interface";
import { Card } from "@mctcg/lib/card.interface";

interface DecksState {
  decks: Deck[];
  selectedDeckIndex: number;
  selectedCard: Card;
}

const initialState: DecksState = {
  decks: [],
  selectedDeckIndex: -1,
  selectedCard: null,
};

export const decksSlice = createSlice({
  name: 'decks',
  initialState,
  reducers: {
    addDeck: (state, action: PayloadAction<Deck>) => {
      if (!state.decks?.find((d) => d.name === action.payload.name)) {
        const newLen = state.decks.push(action.payload)
        state.selectedDeckIndex = newLen - 1;
      }
    },
    updateDeck: (state, action: PayloadAction<{ deckIndex: number, deck: Deck}>) => {
      const indexToUpdate = action.payload.deckIndex;
      const { preElements, postElements } = getPreAndPostElements(state.decks, indexToUpdate);
      const updatedDeck = action.payload.deck;
      state.decks = [...preElements, updatedDeck, ...postElements];
    },
    removeDeck: (state, action: PayloadAction<string>) => {
      state.decks = state.decks.filter((d) => d.name !== action.payload);
      state.selectedDeckIndex = -1;
    },
    duplicateDeck: (state, action: PayloadAction<Deck>) => {
      const newDeck = action.payload;
      newDeck.name = `Copy ${newDeck.name}`;
      state.decks = [...state.decks, newDeck];
    },
    renameDeck: (state, action: PayloadAction<string>) => {
      const indexToUpdate = state.selectedDeckIndex;
      const { preElements, postElements } = getPreAndPostElements(state.decks, indexToUpdate);
      const renamedDeck = { ...state.decks[indexToUpdate], name: action.payload };
      state.decks = [...preElements, renamedDeck, ...postElements];
    },
    addCardToDeck: (state, action: PayloadAction<Card>) => {
      const supertype = action.payload.supertype;
      const section = supertype === "Pokémon" ? "Pokemon" : supertype;
      const indexToUpdate = state.selectedDeckIndex;
      const { preElements, postElements } = getPreAndPostElements(state.decks, indexToUpdate);
      const deckToUpdate: Deck = { ...state.decks[indexToUpdate]}
      deckToUpdate.deck[section].unshift({
        ...action.payload,
        quantity: 1
      });
      state.decks = [...preElements, deckToUpdate, ...postElements ];
      state.selectedCard = deckToUpdate.deck[section][0];
    },
    removeCardFromDeck: (state, action: PayloadAction<Card>) => {
      const supertype = action.payload.supertype;
      const section = supertype === "Pokémon" ? "Pokemon" : supertype;
      const indexToUpdate = state.selectedDeckIndex;
      const { preElements, postElements } = getPreAndPostElements(state.decks, indexToUpdate);
      const deckToUpdate: Deck = { ...state.decks[indexToUpdate]}
      const cardIndexToRemove = deckToUpdate.deck[section].findIndex((c: Card) => c.id === action.payload.id);
      deckToUpdate.deck[section] = [
        ...deckToUpdate.deck[section].filter((c, i) => i !== cardIndexToRemove)
      ]
      state.decks = [...preElements, deckToUpdate, ...postElements ];
      state.selectedCard = null;
    },
    incrementCardQuantity: (state, action: PayloadAction<{ cardIdentifier: string, cardSection: "Pokemon" | "Trainer" | "Energy" }>) => {
      const indexToUpdate = state.selectedDeckIndex;
      const { preElements, postElements } = getPreAndPostElements(state.decks, indexToUpdate);
      const deckToUpdate: Deck = { ...state.decks[indexToUpdate]}
      const cardSection = action.payload.cardSection;
      const cardIdentifier = action.payload.cardIdentifier;
      const cardIndexToUpdate = deckToUpdate.deck[cardSection].findIndex((c) => cardIdentifier === `${c.setAbbr}-${c.setNumber}`);
      const cardToUpdate = deckToUpdate.deck[cardSection][cardIndexToUpdate];
      cardToUpdate.quantity++;
      const { preElements: preCards, postElements: postCards } = getPreAndPostElements(deckToUpdate.deck[cardSection], cardIndexToUpdate);
      deckToUpdate.deck[cardSection] = [...preCards, { ...cardToUpdate }, ...postCards];
      state.selectedCard = cardToUpdate;
      state.decks = [...preElements, deckToUpdate, ...postElements ];
    },
    decrementCardQuantity: (state, action: PayloadAction<{ cardIdentifier: string, cardSection: "Pokemon" | "Trainer" | "Energy" }>) => {
      const indexToUpdate = state.selectedDeckIndex;
      const { preElements, postElements } = getPreAndPostElements(state.decks, indexToUpdate);
      const deckToUpdate: Deck = { ...state.decks[indexToUpdate]}
      const cardSection = action.payload.cardSection;
      const cardIdentifier = action.payload.cardIdentifier;
      const cardIndexToUpdate = deckToUpdate.deck[cardSection].findIndex((c) => cardIdentifier === `${c.setAbbr}-${c.setNumber}`);
      const { preElements: preCards, postElements: postCards } = getPreAndPostElements(deckToUpdate.deck[cardSection], cardIndexToUpdate);
      const cardToUpdate = deckToUpdate.deck[cardSection][cardIndexToUpdate];
      if (cardToUpdate.quantity !== 1) {
        cardToUpdate.quantity--;
        deckToUpdate.deck[cardSection] = [...preCards, { ...cardToUpdate }, ...postCards];
        state.selectedCard = cardToUpdate;
      } else {
        deckToUpdate.deck[cardSection] = [...preCards, ...postCards];
        state.selectedCard = null;
      }
      state.decks = [...preElements, deckToUpdate, ...postElements ];
    },
    selectCard: (state, action: PayloadAction<Card>) => {
      state.selectedCard = action.payload;
    },
    selectDeck: (state, action: PayloadAction<number>) => {
      state.selectedDeckIndex = action.payload;
    }
  }
});

function getPreAndPostElements(list: any[], indexToUpdate: number) {
  let preElements = [];
  let postElements = [];
  if (indexToUpdate > 0) {
    preElements = list.slice(0, indexToUpdate);
  }
  if (indexToUpdate < list.length - 1) {
    postElements = list.slice(indexToUpdate + 1);
  }
  return {
    preElements,
    postElements,
  }
}

export const initialDecksState = initialState;

export const {
  addCardToDeck,
  addDeck,
  removeDeck,
  duplicateDeck,
  renameDeck,
  updateDeck,
  incrementCardQuantity,
  selectCard,
  decrementCardQuantity,
  removeCardFromDeck,
  selectDeck
} = decksSlice.actions;

export default decksSlice.reducer;
