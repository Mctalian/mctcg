import { configureStore } from "@reduxjs/toolkit";
import loadingSlice, { initialLoadingState } from "./loadingSlice";
import playerInfoSlice, { initialPlayerInfoState } from "./playerInfoSlice";
import decksSlice, { initialDecksState } from "./decksSlice";
import successSlice, { initialSuccessState } from "./successSlice";
import displayPreferencesSlice, { initialDisplayPreferencesState } from "./displayPreferencesSlice";

type State = {
  decks: typeof initialDecksState,
  displayPreferences: typeof initialDisplayPreferencesState,
  loading: typeof initialLoadingState,
  playerInfo: typeof initialPlayerInfoState,
  success: typeof initialSuccessState,
};

let preloadedState: State = {
  decks: initialDecksState,
  displayPreferences: initialDisplayPreferencesState,
  loading: initialLoadingState,
  playerInfo: initialPlayerInfoState,
  success: initialSuccessState,
};
if (typeof window !== 'undefined' && !!localStorage) {
  // Perform localStorage action
  preloadedState = { 
    ...JSON.parse(localStorage.getItem('store')),
    loading: initialLoadingState,
    success: initialSuccessState,
  };
}

export const store = configureStore({
  preloadedState: preloadedState,
  reducer: {
    decks: decksSlice,
    displayPreferences: displayPreferencesSlice,
    loading: loadingSlice,
    playerInfo: playerInfoSlice,
    success: successSlice,
  },
});


store.subscribe(() => {
  const state = { ...store.getState() };
  delete state.loading;
  delete state.success;
  const newState = {
    ...state,
  }
  localStorage.setItem('store', JSON.stringify(newState));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
