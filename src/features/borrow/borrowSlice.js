import { createSlice } from "@reduxjs/toolkit";

const borrowSlice = createSlice({
  name: "borrow",
  initialState: {
    borrows: [],
  },

  reducers: {
    setBorrows: (state, action) => {
      state.borrows = action.payload;
    },
  },
});
export const { setBorrows } = borrowSlice.actions;
export default borrowSlice.reducer;
