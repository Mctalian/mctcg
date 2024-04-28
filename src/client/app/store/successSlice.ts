import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface SuccessState {
  value: boolean;
}

const initialState: SuccessState = {
  value: false
};

export const successSlice = createSlice({
  name: 'success',
  initialState,
  reducers: {
    setSuccess: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    }
  }
});

export const initialSuccessState = initialState;

export const { setSuccess } = successSlice.actions;

export default successSlice.reducer;
